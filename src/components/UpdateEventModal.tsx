"use client";

import { useState, useEffect } from "react";
import {
  X,
  CalendarDays,
  ImageIcon,
  MapPin,
  Tag,
  Type,
  Loader2,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

interface UpdateEventModalProps {
  event: {
    _id: string;
    title: string;
    eventType: string;
    eventDate: string;
    location: string;
    thumbnail?: string;
    imageUrl?: string;
    description: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function UpdateEventModal({
  event,
  isOpen,
  onClose,
  onUpdated,
}: UpdateEventModalProps) {
  const [form, setForm] = useState({
    title: event.title || "",
    eventType: event.eventType || "",
    eventDate: event.eventDate || "",
    location: event.location || "",
    imageUrl: event.thumbnail || event.imageUrl || "",
    description: event.description || "",
  });
  const [submitting, setSubmitting] = useState(false);

  // FIX 1: Keep form synced whenever a different event is selected for editing
  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        eventType: event.eventType || "",
        eventDate: event.eventDate || "",
        location: event.location || "",
        imageUrl: event.thumbnail || event.imageUrl || "",
        description: event.description || "",
      });
    }
  }, [event]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // FIX 2: Ensure PUT request correctly updates both imageUrl and thumbnail fields
      const res = await fetch(`/api/events/${event._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          thumbnail: form.imageUrl, // ensures backend schema catches both
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to update event");
      }

      toast.success("Event updated successfully!");
      onUpdated();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Could not update event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-3xl border border-[#D8D2CD] dark:border-[#3E3229] bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#D8D2CD] dark:border-[#3E3229]">
          <div>
            <h2 className="text-2xl font-serif font-bold uppercase tracking-tight">
              Update Event
            </h2>
            <p className="text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/70 mt-1">
              Modify the details for your social service initiative
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#73573F]/10 dark:hover:bg-[#3E3229] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2">
              Title
            </label>
            <div className="relative">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#73573F] dark:text-[#E8E4E2]/60" />
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/60 dark:bg-[#1F1915]/80 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#73573F] transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Event Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                Event Type
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#73573F] dark:text-[#E8E4E2]/60" />
                <select
                  value={form.eventType}
                  onChange={(e) =>
                    setForm({ ...form, eventType: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/60 dark:bg-[#1F1915]/80 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#73573F] transition-all"
                >
                  <option value="Food Drive">Food Drive</option>
                  <option value="Cleanup">Cleanup</option>
                  <option value="Winter Relief">Winter Relief</option>
                  <option value="Donation">Donation</option>
                  <option value="Health Camp">Health Camp</option>
                  <option value="Plantation">Plantation</option>
                  <option value="Food Distribution">Food Distribution</option>
                  <option value="Education Support">Education Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                Event Date
              </label>
              <div className="relative">
                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#73573F] dark:text-[#E8E4E2]/60" />
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) =>
                    setForm({ ...form, eventDate: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/60 dark:bg-[#1F1915]/80 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#73573F] transition-all [color-scheme:light] dark:[color-scheme:dark]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#73573F] dark:text-[#E8E4E2]/60" />
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/60 dark:bg-[#1F1915]/80 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#73573F] transition-all"
                required
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2">
              Thumbnail Image URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#73573F] dark:text-[#E8E4E2]/60" />
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/60 dark:bg-[#1F1915]/80 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#73573F] transition-all"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/60 dark:bg-[#1F1915]/80 p-4 text-sm outline-none focus:border-[#73573F] transition-all resize-y"
              required
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D8D2CD] dark:border-[#3E3229]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] text-xs font-bold uppercase tracking-wider hover:bg-[#73573F]/15 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#73573F] hover:bg-[#5c4532] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-75"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
