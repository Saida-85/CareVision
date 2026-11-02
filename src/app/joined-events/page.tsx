"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  CheckCircle2,
  HeartHandshake,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface JoinedEventItem {
  _id: string;
  eventId: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  joinedAt: string;
}

export default function JoinedEventsPage() {
  const router = useRouter();
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const user = session?.user;

  const [joinedEvents, setJoinedEvents] = useState<JoinedEventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthPending && !user) {
      router.push("/signup");
      return;
    }

    if (user?.email) {
      fetchJoinedEvents(user.email);
    }
  }, [user, isAuthPending, router]);

  const fetchJoinedEvents = async (email: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/events/joined?email=${encodeURIComponent(email)}`,
      );
      if (!res.ok) throw new Error("Failed to fetch joined events");
      const data = await res.json();
      setJoinedEvents(data);
    } catch (err) {
      console.error(err);
      toast.error("Could not load your joined events.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthPending || loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2]">
        <Loader2 className="w-10 h-10 animate-spin text-[#73573F] dark:text-[#E8E4E2] mb-4" />
        <p className="text-sm font-medium tracking-wide">
          Loading your volunteer commitments...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2] transition-colors duration-300 px-4 py-12 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="border-b border-[#D8D2CD] dark:border-[#3E3229] pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#73573F]/10 dark:bg-[#3E3229]/40 text-[#73573F] dark:text-[#E8E4E2] text-xs font-bold mb-3 border border-[#73573F]/20 dark:border-[#3E3229]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>My Volunteer Commitments</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#1F1915] dark:text-[#E8E4E2] uppercase">
            Joined Events
          </h1>
          <p className="text-xs sm:text-sm text-[#3E3229]/70 dark:text-[#E8E4E2]/70 mt-2 font-light">
            Here are all the social development and community service drives you
            have signed up for, sorted by event date.
          </p>
        </div>

        {/* Dynamic Content: Empty State vs Cards Grid */}
        {joinedEvents.length === 0 ? (
          /* Empty State Container */
          <div className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl border-2 border-dashed border-[#D8D2CD] dark:border-[#3E3229] bg-white/40 dark:bg-[#1F1915]/60 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#73573F]/10 dark:bg-[#3E3229]/60 text-[#73573F] dark:text-[#E8E4E2] mb-6 shadow-inner border border-[#73573F]/20 dark:border-[#3E3229]">
              <HeartHandshake className="h-8 w-8" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-[#1F1915] dark:text-[#E8E4E2] mb-3">
              You Haven&apos;t Joined Any Events Yet
            </h3>

            <p className="text-xs sm:text-sm text-[#3E3229]/70 dark:text-[#E8E4E2]/70 max-w-lg mb-8 leading-relaxed">
              Discover active community cleanups, blanket distributions, and
              winter relief drives in your area and join hands!
            </p>

            <Link href="/upcoming-events">
              <button className="flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-[#73573F] hover:bg-[#5c4532] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xl active:scale-95">
                <span>Explore Upcoming Events</span>
                <span className="text-base">→</span>
              </button>
            </Link>
          </div>
        ) : (
          /* Joined Events Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedEvents.map((event) => (
              <div
                key={event._id}
                className="group flex flex-col justify-between rounded-3xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/70 dark:bg-[#1F1915]/80 overflow-hidden shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl"
              >
                <div>
                  {/* Event Image */}
                  <div className="relative w-full h-52 overflow-hidden bg-[#D8D2CD]/40 dark:bg-[#3E3229]/40">
                    <Image
                      src={event.thumbnail}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Event Type Tag */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#73573F] text-white shadow-md">
                        {event.eventType}
                      </span>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#1F1915]/90 text-white text-[11px] font-medium backdrop-blur-md border border-[#3E3229]">
                        <Calendar className="w-3.5 h-3.5 text-[#E8E4E2]" />
                        <span>{new Date(event.eventDate).toDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    <h2 className="text-xl font-serif font-bold text-[#1F1915] dark:text-[#E8E4E2] line-clamp-1">
                      {event.title}
                    </h2>

                    <div className="flex items-center space-x-1.5 text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/70 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#73573F] dark:text-[#E8E4E2]" />
                      <span className="truncate">{event.location}</span>
                    </div>

                    <p className="text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/70 line-clamp-2 pt-1 leading-relaxed">
                      You have signed up as a confirmed volunteer for this
                      initiative.
                    </p>
                  </div>
                </div>

                {/* Footer Details */}
                <div className="p-6 pt-0 space-y-4">
                  <p className="text-[11px] text-[#3E3229]/60 dark:text-[#E8E4E2]/50 font-medium">
                    Joined{" "}
                    {new Date(event.joinedAt || Date.now()).toDateString()}
                  </p>

                  <Link
                    href={`/events/${event.eventId || event._id}`}
                    className="block"
                  >
                    <button className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-[#73573F] hover:bg-[#5c4532] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-[0.98]">
                      <span>View Event</span>
                      <span className="text-sm">→</span>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
