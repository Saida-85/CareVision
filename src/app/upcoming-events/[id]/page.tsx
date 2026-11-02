import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Mail,
  ArrowLeft,
  Sparkles,
  Tag,
  Clock,
} from "lucide-react";

interface EventDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetailsPage({ params }: EventDetailProps) {
  const { id } = await params;

  let event = null;
  try {
    const res = await fetch(`http://localhost:8000/events/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return notFound();
    event = await res.json();
  } catch (error) {
    console.error("Failed to fetch event details:", error);
  }

  if (!event || !event._id) {
    return notFound();
  }

  return (
    <main className="min-h-screen px-4 py-12 transition-colors duration-300 md:py-16 bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2]">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          href="/upcoming-events"
          className="mb-8 inline-flex items-center space-x-2 rounded-full border border-[#73573F]/20 dark:border-[#73573F]/40 bg-[#73573F]/10 dark:bg-[#73573F]/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#73573F] dark:text-[#E8E4E2] transition-all hover:bg-[#73573F]/20"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Events</span>
        </Link>

        {/* Main Card Container */}
        <div className="overflow-hidden rounded-3xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/60 dark:bg-[#1F1915]/80 shadow-xl backdrop-blur-md">
          {/* Thumbnail Image */}
          <div className="relative h-72 w-full sm:h-96">
            <img
              src={event.imageUrl} // <-- Make sure this says event.imageUrl, not event.thumbnail
              alt={event.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F1915]/70 via-transparent to-transparent" />

            {/* Event Type Badge over image */}
            <span className="absolute bottom-4 left-4 inline-flex items-center space-x-1.5 rounded-full bg-[#73573F] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md">
              <Tag className="h-3.5 w-3.5" />
              <span>{event.eventType}</span>
            </span>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-10">
            <span className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#73573F] dark:text-[#E8E4E2]/70 mb-3">
              <Sparkles className="h-4 w-4" />
              <span>Care Vision Initiative</span>
            </span>

            <h1 className="text-3xl font-serif font-extrabold uppercase tracking-tight text-[#1F1915] dark:text-[#E8E4E2] md:text-4xl">
              {event.title}
            </h1>

            {/* Meta Info Grid (Date, Location, Organizer) */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 border-y border-[#D8D2CD] dark:border-[#3E3229] py-6 text-sm">
              {/* Date */}
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#73573F]/10 text-[#73573F] dark:bg-[#73573F]/20 dark:text-[#E8E4E2]">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/60 font-medium">
                    Event Date
                  </p>
                  <p className="font-semibold text-[#1F1915] dark:text-[#E8E4E2]">
                    {event.eventDate}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#73573F]/10 text-[#73573F] dark:bg-[#73573F]/20 dark:text-[#E8E4E2]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/60 font-medium">
                    Location
                  </p>
                  <p className="font-semibold text-[#1F1915] dark:text-[#E8E4E2] capitalize">
                    {event.location}
                  </p>
                </div>
              </div>

              {/* Organizer Email */}
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#73573F]/10 text-[#73573F] dark:bg-[#73573F]/20 dark:text-[#E8E4E2]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/60 font-medium">
                    Organizer
                  </p>
                  <p className="font-semibold text-[#1F1915] dark:text-[#E8E4E2] truncate max-w-[180px]">
                    {event.userEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-[#1F1915] dark:text-[#E8E4E2] mb-3">
                About This Cause
              </h2>
              <p className="text-base leading-relaxed text-[#3E3229]/90 dark:text-[#E8E4E2]/80 whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Created Timestamp footer info */}
            <div className="mt-10 flex items-center justify-between text-xs text-[#3E3229]/60 dark:text-[#E8E4E2]/50 border-t border-[#D8D2CD]/50 dark:border-[#3E3229]/50 pt-4">
              <span className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Published on {new Date(event.createdAt).toLocaleDateString()}
                </span>
              </span>
              <span>Event ID: {event._id}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
