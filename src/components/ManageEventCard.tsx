"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Tag, Edit, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import UpdateEventModal from "@/components/UpdateEventModal";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface ManageEventCardProps {
  event: {
    _id: string;
    title: string;
    eventType: string;
    eventDate: string;
    location: string;
    imageUrl?: string;
    thumbnail?: string;
    description: string;
    userEmail: string;
  };
  onEventDeleted: (id: string) => void;
  onEventUpdated: () => void;
}

export default function ManageEventCard({
  event,
  onEventDeleted,
  onEventUpdated,
}: ManageEventCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      setDeleting(true);

      const token = await getTokenFromClient();
      if (!token) {
        throw new Error(
          "Authentication error: Could not retrieve secure session token.",
        );
      }

      const res = await fetch(`/api/events/manage?id=${event._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to delete event");

      toast.success("Event deleted successfully.");
      onEventDeleted(event._id);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Could not delete event.");
    } finally {
      setDeleting(false);
    }
  };

  const imageSrc = event.imageUrl || event.thumbnail || "";

  return (
    <>
      <div className="group overflow-hidden rounded-3xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/60 dark:bg-[#1F1915]/80 shadow-md transition-all duration-300 hover:shadow-xl flex flex-col justify-between">
        <div>
          {/* Image Container */}
          <div className="relative h-52 w-full overflow-hidden bg-[#73573F]/10">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={event.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-[#3E3229]/60 dark:text-[#E8E4E2]/60">
                No Image
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F1915]/60 via-transparent to-transparent" />

            {/* Event Type Badge */}
            <span className="absolute bottom-3 left-3 inline-flex items-center space-x-1.5 rounded-full bg-[#73573F] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow">
              <Tag className="h-3 w-3" />
              <span>{event.eventType}</span>
            </span>
          </div>

          {/* Content Body */}
          <div className="p-6">
            <h3 className="font-serif text-xl font-bold tracking-tight text-[#1F1915] dark:text-[#E8E4E2] line-clamp-1">
              {event.title}
            </h3>

            <p className="mt-2 text-sm text-[#3E3229]/80 dark:text-[#A39B94] font-light line-clamp-2">
              {event.description}
            </p>

            <div className="mt-4 space-y-2 text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/70 font-light">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4 text-[#73573F]" />
                <span>{event.eventDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-[#73573F]" />
                <span className="capitalize truncate">{event.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (View, Edit, Delete) */}
        <div className="p-6 pt-0 grid grid-cols-3 gap-2">
          {/* View */}
          <Link
            href={`/events/${event._id}`}
            className="inline-flex items-center justify-center space-x-1 rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/40 dark:bg-[#1F1915]/40 py-2.5 px-2 text-[11px] font-bold uppercase tracking-wider text-[#1F1915] dark:text-[#E8E4E2] hover:bg-[#73573F]/10 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </Link>

          {/* Edit */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center justify-center space-x-1 rounded-xl border border-[#73573F]/40 bg-[#73573F]/10 hover:bg-[#73573F] text-[#1F1915] dark:text-[#E8E4E2] hover:text-white py-2.5 px-2 text-[11px] font-bold uppercase tracking-wider transition-all"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center justify-center space-x-1 rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white py-2.5 px-2 text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{deleting ? "..." : "Delete"}</span>
          </button>
        </div>
      </div>

      {/* Edit Modal Component */}
      <UpdateEventModal
        event={event}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdated={onEventUpdated}
      />
    </>
  );
}
