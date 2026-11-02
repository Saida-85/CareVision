"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Tag,
  Edit3,
  Trash2,
  PlusCircle,
  Loader2,
  AlertCircle,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import UpdateEventModal from "@/components/UpdateEventModal";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail?: string;
  imageUrl?: string;
  location: string;
  eventDate: string;
  userEmail: string;
}

export default function ManageEventsPage() {
  const router = useRouter();
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const user = session?.user;

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit Modal States
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch events created by the logged-in user
  useEffect(() => {
    if (!isAuthPending && !user) {
      router.push("/signup");
      return;
    }

    if (user?.email) {
      fetchUserEvents(user.email);
    }
  }, [user, isAuthPending, router]);

  const fetchUserEvents = async (email: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/events/manage?email=${encodeURIComponent(email)}`,
      );
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Could not load your created events.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setDeletingId(eventId);
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user?.email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete event");
      }

      toast.success("Event deleted successfully!");
      setEvents((prev) => prev.filter((ev) => ev._id !== eventId));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong while deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isAuthPending || loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2]">
        <Loader2 className="w-10 h-10 animate-spin text-[#73573F] dark:text-[#E8E4E2] mb-4" />
        <p className="text-sm font-medium tracking-wide">
          Loading your managed events...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2] transition-colors duration-300 px-4 py-12 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8D2CD] dark:border-[#3E3229] pb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight text-[#1F1915] dark:text-[#E8E4E2] uppercase">
              Manage Your Events
            </h1>
            <p className="text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/70 mt-1">
              View, edit, or delete events you have created for community
              service
            </p>
          </div>
          <Link href="/create-event">
            <button className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#73573F] hover:bg-[#5c4532] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95">
              <PlusCircle className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
          </Link>
        </div>

        {/* Empty State */}
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-[#1F1915]/60 rounded-3xl border border-[#D8D2CD] dark:border-[#3E3229] text-center p-6">
            <AlertCircle className="w-12 h-12 text-[#73573F] dark:text-[#E8E4E2]/50 mb-4" />
            <h3 className="text-lg font-serif font-bold mb-2">
              No Events Created Yet
            </h3>
            <p className="text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/70 max-w-md mb-6">
              You haven&apos;t posted any social service events yet. Start
              making an impact in your community today!
            </p>
            <Link href="/create-event">
              <button className="px-6 py-3 rounded-xl bg-[#73573F] hover:bg-[#5c4532] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md">
                Post First Event
              </button>
            </Link>
          </div>
        ) : (
          /* Event Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const imageSrc = event.thumbnail || event.imageUrl || "";
              return (
                <div
                  key={event._id}
                  className="group flex flex-col justify-between rounded-3xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/70 dark:bg-[#1F1915]/80 overflow-hidden shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-2xl"
                >
                  <div>
                    {/* Event Thumbnail */}
                    <div className="relative w-full h-48 overflow-hidden bg-[#D8D2CD]/40 dark:bg-[#3E3229]/40">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#3E3229]/60">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#73573F] text-white shadow-md">
                          {event.eventType}
                        </span>
                      </div>
                    </div>

                    {/* Event Body */}
                    <div className="p-6 space-y-3">
                      <h2 className="text-lg font-serif font-bold text-[#1F1915] dark:text-[#E8E4E2] line-clamp-1">
                        {event.title}
                      </h2>
                      <p className="text-xs text-[#3E3229]/80 dark:text-[#E8E4E2]/70 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="pt-2 space-y-2 text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/60 font-medium">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-[#73573F] dark:text-[#E8E4E2]" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3.5 h-3.5 text-[#73573F] dark:text-[#E8E4E2]" />
                          <span>
                            {event.eventDate
                              ? new Date(event.eventDate).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer (View, Edit, Delete) */}
                  <div className="p-4 border-t border-[#D8D2CD] dark:border-[#3E3229] grid grid-cols-3 gap-2 bg-white/40 dark:bg-[#1F1915]/40">
                    <Link
                      href={`/events/${event._id}`}
                      className="inline-flex items-center justify-center space-x-1 py-2 px-2 rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] text-xs font-semibold text-[#1F1915] dark:text-[#E8E4E2] hover:bg-[#73573F]/10 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>

                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsEditModalOpen(true);
                      }}
                      className="inline-flex items-center justify-center space-x-1 py-2 px-2 rounded-xl border border-[#73573F]/40 bg-[#73573F]/10 hover:bg-[#73573F] text-[#1F1915] dark:text-[#E8E4E2] hover:text-white text-xs font-semibold transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(event._id)}
                      disabled={deletingId === event._id}
                      className="inline-flex items-center justify-center space-x-1 py-2 px-2 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      {deletingId === event._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal Component */}
      {selectedEvent && (
        <UpdateEventModal
          event={selectedEvent}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEvent(null);
          }}
          onUpdated={() => {
            if (user?.email) fetchUserEvents(user.email);
          }}
        />
      )}
    </main>
  );
}
