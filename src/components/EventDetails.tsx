"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

interface EventDetailsProps {
  event: {
    _id: string;
    title: string;
    description: string;
    eventType: string;
    thumbnail?: string;
    imageUrl?: string;
    location: string;
    eventDate: string;
    volunteers?: string[];
  };
}

export default function EventDetails({ event }: EventDetailsProps) {
  const router = useRouter();

  // Directly grab session state from Better Auth
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const user = session?.user;

  const [isJoined, setIsJoined] = useState(false);
  const [volunteerCount, setVolunteerCount] = useState(
    event.volunteers?.length || 0,
  );
  const [loading, setLoading] = useState(false);

  // Check initial join status on load
  useEffect(() => {
    if (user?.email && event._id) {
      checkUserJoined(user.email, event._id);
    }
  }, [user, event._id]);

  const checkUserJoined = async (email: string, eventId: string) => {
    try {
      const res = await fetch(
        `/api/events/joined?email=${encodeURIComponent(email)}`,
      );
      if (res.ok) {
        const joinedEvents = await res.json();
        const joined = joinedEvents.some(
          (item: any) => item.eventId === eventId || item._id === eventId,
        );
        setIsJoined(joined);
      }
    } catch (err) {
      console.error("Error checking join status:", err);
    }
  };

  const handleJoinToggle = async () => {
    if (isAuthPending) return;

    if (!user) {
      toast.error("Please log in to join this event.");
      router.push("/signup");
      return;
    }

    try {
      setLoading(true);

      if (isJoined) {
        // LEAVE EVENT LOGIC
        const res = await fetch("/api/events/leave", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: event._id,
            userEmail: user.email,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to leave event");
        }

        setIsJoined(false);
        setVolunteerCount((prev) => Math.max(0, prev - 1));
        toast("You have left this event.", { icon: "ℹ️" });
      } else {
        // JOIN EVENT LOGIC
        const res = await fetch("/api/events/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: event._id,
            userEmail: user.email,
            userName: user.name || "Volunteer",
            title: event.title,
            description: event.description || "Community service initiative",
            eventType: event.eventType || "Community",
            thumbnail: event.thumbnail || event.imageUrl || "",
            location: event.location,
            eventDate: event.eventDate,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to join event");
        }

        setIsJoined(true);
        setVolunteerCount((prev) => prev + 1);
        toast.success(
          "You have successfully joined this event! Thank you for gathering for good!",
        );
      }

      router.refresh();
    } catch (err: any) {
      console.error("Join/Leave error:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-3xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/60 dark:bg-[#1F1915]/80 p-6 shadow-md">
      <div>
        <span className="font-medium text-[#1F1915] dark:text-[#E8E4E2]">
          {volunteerCount} Volunteers Joined
        </span>
        <p className="text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/70 font-light mt-0.5">
          {isJoined
            ? "You are confirmed for this initiative"
            : "Join to participate"}
        </p>
      </div>

      <button
        onClick={handleJoinToggle}
        disabled={loading || isAuthPending}
        className={`flex items-center space-x-2 rounded-full px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] transition-all duration-300 shadow-md ${
          isJoined
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "border border-[#73573F] bg-[#73573F] text-white hover:bg-[#5E4531]"
        } disabled:opacity-75 active:scale-95`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isJoined ? (
          <span>✓ Joined (Click to Leave)</span>
        ) : (
          <span>+ Join Event</span>
        )}
      </button>
    </div>
  );
}
