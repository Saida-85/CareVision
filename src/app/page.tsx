import HeroBanner from "@/components/HeroBanner";
import HowCanYouHelp from "@/components/HowCanYouHelp";
import EventCard from "@/components/EventCard";
import VisualStories from "@/components/VisualStories";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  let events: any[] = [];
  try {
    const res = await fetch(`${API_URL}/api/events`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Events API responded with ${res.status}`);
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      events = data;
    }
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }

  return (
    <main className="min-h-screen transition-colors duration-300 bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2]">
      <HeroBanner />
      <HowCanYouHelp />
      {/* Upcoming Initiatives Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#73573F] dark:text-[#E8E4E2]/70 mb-2 block">
              Upcoming Initiatives
            </span>
            <h2 className="text-3xl font-serif font-extrabold uppercase tracking-tight md:text-4xl">
              Recent Upcoming Events
            </h2>
            <p className="mt-2 text-sm text-[#3E3229]/80 dark:text-[#E8E4E2]/70 font-light">
              Latest 6 community drives scheduled in your city. Get involved
              today.
            </p>
          </div>

          <Link
            href="/upcoming-events"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#73573F] dark:text-[#E8E4E2] hover:underline"
          >
            <span>View All Events</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {events.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-[#73573F]/40 p-10 text-center text-sm font-light text-[#3E3229]/70 dark:text-[#E8E4E2]/70">
            No upcoming events to show right now. Please check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 6).map((event: any) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
      {/* Visual Stories Gallery Section */}
      <VisualStories />
      {/* Newsletter Subscription Section */}
      <Newsletter />
    </main>
  );
}
