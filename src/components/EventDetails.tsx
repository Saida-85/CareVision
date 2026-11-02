"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast"; // <-- Import react-hot-toast

interface EventDetailsProps {
  event: {
    _id: string;
    title: string;
    eventType: string;
    eventDate: string;
    location: string;
    imageUrl: string;
    description: string;
    volunteers?: string[];
  };
  currentUserId?: string;
}

export default function EventDetails({
  event,
  currentUserId,
}: EventDetailsProps) {
  const [isJoined, setIsJoined] = useState(
    currentUserId ? event.volunteers?.includes(currentUserId) : false,
  );
  const [volunteerCount, setVolunteerCount] = useState(
    event.volunteers?.length || 0,
  );
  const [loading, setLoading] = useState(false);

  const handleJoinToggle = async () => {
    console.log("Button clicked! currentUserId:", currentUserId);
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

    if (!currentUserId) {
      toast.error("Please log in to join this event.");
      return;
    }

    try {
      setLoading(true);
      const endpoint = isJoined
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/events/${event._id}/leave`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/events/${event._id}/join`;

      console.log("Fetching endpoint:", endpoint);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });

      console.log("Response status:", res.status);
      if (!res.ok) throw new Error("Failed to update event status");

      if (!isJoined) {
        setIsJoined(true);
        setVolunteerCount((prev) => prev + 1);
        toast.success(
          "You have successfully joined this event! Thank you for gathering for good!",
        );
      } else {
        setIsJoined(false);
        setVolunteerCount((prev) => Math.max(0, prev - 1));
        toast("You have left this event.", { icon: "ℹ️" });
      }
    } catch (err) {
      console.error("Catch error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Global Toaster container for react-hot-toast */}
      <Toaster position="top-right" />

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
          disabled={loading}
          className={`rounded-full px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] transition-all duration-300 ${
            isJoined
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "border border-[#73573F] bg-[#73573F] text-white hover:bg-[#5E4531]"
          }`}
        >
          {isJoined ? "✓ Joined (Click to Leave)" : "+ Join Event"}
        </button>
      </div>
    </>
  );
}
