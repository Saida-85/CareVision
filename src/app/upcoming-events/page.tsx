import EventCard from "@/components/EventCard";

export const dynamic = "force-dynamic"; // <--- Add this line

export default async function UpcomingEventsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  let events = [];
  try {
    const res = await fetch(`${API_URL}/events`, { cache: "no-store" });
    events = await res.json();
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }

  return (
    <main className="min-h-screen px-4 py-12 md:py-16 bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2]">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-serif font-bold mb-8">Upcoming Events</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event: any) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </main>
  );
}
