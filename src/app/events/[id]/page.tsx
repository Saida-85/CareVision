"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Mail,
  ArrowLeft,
  Tag,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface EventDetail {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail?: string;
  imageUrl?: string;
  location: string;
  eventDate: string;
  userEmail: string;
  volunteerCount?: number;
}

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const user = session?.user;

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [volunteerCount, setVolunteerCount] = useState(0);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  useEffect(() => {
    if (user?.email && id) {
      checkJoinStatus(user.email, id);
    }
  }, [user, id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/events/${id}`);
      if (!res.ok) throw new Error("Event not found");
      const data = await res.json();
      setEvent(data);
      setVolunteerCount(data.volunteerCount || 0);
    } catch (err) {
      console.error(err);
      toast.error("Could not load event details.");
    } finally {
      setLoading(false);
    }
  };

  const checkJoinStatus = async (email: string, eventId: string) => {
    try {
      const res = await fetch(
        `/api/events/joined?email=${encodeURIComponent(email)}`,
      );
      if (res.ok) {
        const joinedList = await res.json();
        const alreadyJoined = joinedList.some(
          (item: any) => item.eventId === eventId || item._id === eventId,
        );
        setHasJoined(alreadyJoined);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleJoin = async () => {
    if (!user) {
      toast.error("Please login to participate!");
      router.push("/signup");
      return;
    }

    if (!event) return;

    const validThumbnail =
      event.thumbnail ||
      event.imageUrl ||
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop";

    try {
      setActionLoading(true);

      if (hasJoined) {
        // LEAVE EVENT
        const res = await fetch("/api/events/leave", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: event._id,
            userEmail: user.email,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to leave event");

        setHasJoined(false);
        setVolunteerCount((prev) => Math.max(0, prev - 1));
        toast("You have left this event.", { icon: "ℹ️" });
      } else {
        // JOIN EVENT
        const res = await fetch("/api/events/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: event._id,
            userEmail: user.email,
            userName: user.name,
            title: event.title,
            description: event.description,
            eventType: event.eventType,
            thumbnail: validThumbnail,
            location: event.location,
            eventDate: event.eventDate,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to join event");

        setHasJoined(true);
        setVolunteerCount((prev) => prev + 1);
        toast.success(
          "You have successfully joined this event! Thank you for gathering for good!",
        );
      }

      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || isAuthPending) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2]">
        <Loader2 className="w-10 h-10 animate-spin text-[#73573F] dark:text-[#E8E4E2] mb-4" />
        <p className="text-sm font-medium">Loading event details...</p>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2] p-6 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Event Not Found</h2>
        <Link href="/upcoming-events">
          <button className="px-6 py-3 rounded-xl bg-[#73573F] text-white text-xs font-bold uppercase tracking-wider">
            Back to Upcoming Events
          </button>
        </Link>
      </main>
    );
  }

  const thumbnailSrc = event.thumbnail || event.imageUrl;

  return (
    <main className="min-h-screen bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2] transition-colors duration-300 px-4 py-8 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <Link
          href="/upcoming-events"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-[#3E3229]/40 border border-[#D8D2CD] dark:border-[#3E3229] text-xs font-bold uppercase tracking-wider text-[#1F1915] dark:text-[#E8E4E2] hover:bg-[#73573F]/10 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>

        {/* Main Card */}
        <div className="rounded-3xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/80 dark:bg-[#1F1915]/90 overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Banner Image */}
          <div className="relative w-full h-[320px] sm:h-[420px] overflow-hidden bg-[#D8D2CD]/40 dark:bg-[#3E3229]/40">
            {thumbnailSrc && thumbnailSrc.trim() !== "" ? (
              <Image
                src={thumbnailSrc}
                alt={event.title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-800 text-sm">
                No Image Available
              </div>
            )}
            <div className="absolute bottom-6 left-6">
              <span className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#73573F] text-white shadow-lg backdrop-blur-md">
                <Tag className="w-3.5 h-3.5" />
                <span>{event.eventType}</span>
              </span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-8 sm:p-10 space-y-8">
            {/* Title & Join/Leave Button Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#D8D2CD] dark:border-[#3E3229] pb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#73573F] dark:text-[#E8E4E2]/60 mb-2">
                  Care Vision Initiative
                </p>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F1915] dark:text-[#E8E4E2] tracking-tight uppercase">
                  {event.title}
                </h1>
              </div>

              {/* Join Box with Toggle Button */}
              <div className="flex items-center justify-between md:justify-end gap-4 p-4 rounded-2xl border border-[#D8D2CD] dark:border-[#3E3229] bg-[#E8E4E2]/50 dark:bg-[#1F1915]/60 min-w-[280px]">
                <div>
                  <p className="text-xs font-bold text-[#1F1915] dark:text-[#E8E4E2]">
                    {volunteerCount} Volunteers Joined
                  </p>
                  <p className="text-[10px] text-[#3E3229]/60 dark:text-[#E8E4E2]/50">
                    {hasJoined
                      ? "You are confirmed for this initiative"
                      : "Join to participate"}
                  </p>
                </div>

                <button
                  onClick={handleToggleJoin}
                  disabled={actionLoading}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 ${
                    hasJoined
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-[#73573F] hover:bg-[#5c4532] text-white"
                  } disabled:opacity-75`}
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : hasJoined ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Joined (Click to Leave)</span>
                    </>
                  ) : (
                    <span>+ Join Event</span>
                  )}
                </button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center space-x-3 p-4 rounded-xl border border-[#D8D2CD]/60 dark:border-[#3E3229]/60 bg-white/40 dark:bg-[#1F1915]/40">
                <Calendar className="w-5 h-5 text-[#73573F] dark:text-[#E8E4E2]" />
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#3E3229]/60 dark:text-[#E8E4E2]/50">
                    Event Date
                  </p>
                  <p className="text-xs font-bold text-[#1F1915] dark:text-[#E8E4E2]">
                    {event.eventDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-xl border border-[#D8D2CD]/60 dark:border-[#3E3229]/60 bg-white/40 dark:bg-[#1F1915]/40">
                <MapPin className="w-5 h-5 text-[#73573F] dark:text-[#E8E4E2]" />
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#3E3229]/60 dark:text-[#E8E4E2]/50">
                    Location
                  </p>
                  <p className="text-xs font-bold text-[#1F1915] dark:text-[#E8E4E2] truncate">
                    {event.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-xl border border-[#D8D2CD]/60 dark:border-[#3E3229]/60 bg-white/40 dark:bg-[#1F1915]/40">
                <Mail className="w-5 h-5 text-[#73573F] dark:text-[#E8E4E2]" />
                <div>
                  <p className="text-[10px] uppercase font-semibold text-[#3E3229]/60 dark:text-[#E8E4E2]/50">
                    Organizer
                  </p>
                  <p className="text-xs font-bold text-[#1F1915] dark:text-[#E8E4E2] truncate">
                    {event.userEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="pt-4 space-y-3">
              <h3 className="text-base font-serif font-bold text-[#1F1915] dark:text-[#E8E4E2] uppercase">
                Event Description
              </h3>
              <p className="text-sm text-[#3E3229]/80 dark:text-[#E8E4E2]/80 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
