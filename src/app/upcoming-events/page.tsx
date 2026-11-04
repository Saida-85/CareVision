"use client";

import { useState, useEffect } from "react";
import EventCard from "@/components/EventCard";
import { Search, Loader2 } from "lucide-react";

const CATEGORIES = [
  "All",
  "Donation",
  "Cleanup",
  "Plantation",
  "Winter Relief",
  "Food Distribution",
  "Health Camp",
  "Education Support",
  "Other",
];

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_URL}/api/events`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setEvents(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Filter events based on both category selection and search query
  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "All" ||
      event.eventType?.toLowerCase() === selectedCategory.toLowerCase();

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      event.title?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query) ||
      event.eventType?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen px-4 py-12 md:py-16 bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2]">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-serif font-bold uppercase tracking-tight mb-2">
          Upcoming Events
        </h1>
        <p className="text-sm text-[#3E3229]/80 dark:text-[#E8E4E2]/70 mb-8 font-light">
          Discover verified volunteer initiatives scheduled for upcoming dates.
        </p>

        {/* Category Filter Pills & Search Bar Layout */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  type="button"
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-[#73573F] text-white shadow-md dark:bg-[#E8E4E2] dark:text-[#1F1915]"
                      : "bg-white/40 dark:bg-[#1F1915]/50 border border-[#D8D2CD] dark:border-[#3E3229] text-[#3E3229] dark:text-[#E8E4E2]/80 hover:border-[#73573F]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73573F] dark:text-[#E8E4E2]/60" />
            <input
              type="text"
              placeholder="Search events or areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/50 dark:bg-[#1F1915]/60 py-2.5 pl-11 pr-4 text-sm text-[#1F1915] dark:text-[#E8E4E2] outline-none placeholder:text-[#3E3229]/60 dark:placeholder:text-[#E8E4E2]/50 focus:border-[#73573F] focus:ring-2 focus:ring-[#73573F]/20 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#73573F] dark:text-[#E8E4E2]" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-[#73573F]/40 p-10 text-center text-sm font-light text-[#3E3229]/70 dark:text-[#E8E4E2]/70">
            No events match your selected category or search query.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event: any) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
