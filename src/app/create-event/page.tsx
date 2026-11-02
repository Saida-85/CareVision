"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  CalendarDays,
  ImageIcon,
  Loader2,
  MapPin,
  PlusCircle,
  Sparkles,
  Tag,
  Type,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Connect these two to BetterAuth once login is ready                */
/* ------------------------------------------------------------------ */
// For testing right now, you can put your email or leave it to allow testing.
const activeUserEmail = "saida@carevision.com"; // TODO: replace with session.user.email from BetterAuth
async function getToken(): Promise<string> {
  return ""; // TODO: return the JWT for the Authorization header
}

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */
const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Winter Relief",
  "Food Distribution",
  "Health Camp",
  "Education Support",
  "Other",
];

const PHOTO_PRESETS = [
  {
    label: "Winter Clothes",
    url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Blanket Relief",
    url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Cleanup",
    url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Tree Plantation",
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
  },
];

type FormState = {
  title: string;
  eventType: string;
  eventDate: string;
  location: string;
  thumbnail: string;
  description: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
  title: "",
  eventType: "",
  eventDate: "",
  location: "",
  thumbnail: "",
  description: "",
};

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validate(form: FormState, minDate: string): Errors {
  const errors: Errors = {};

  if (!form.title.trim()) {
    errors.title = "Give your event a title so people can find it.";
  } else if (form.title.trim().length < 5) {
    errors.title = "Title should be at least 5 characters.";
  }

  if (!form.eventType) {
    errors.eventType = "Choose the type of event.";
  }

  if (!form.eventDate) {
    errors.eventDate = "Pick a date for your event.";
  } else if (minDate && form.eventDate < minDate) {
    errors.eventDate =
      "The date must be today or later. Past dates can't be used.";
  }

  if (!form.location.trim()) {
    errors.location = "Tell volunteers where to go.";
  }

  if (!form.thumbnail.trim()) {
    errors.thumbnail = "Add a thumbnail image link.";
  } else if (!isValidUrl(form.thumbnail.trim())) {
    errors.thumbnail = "Enter a valid link starting with http:// or https://";
  }

  if (!form.description.trim()) {
    errors.description = "Add a short description of the event.";
  } else if (form.description.trim().length < 30) {
    errors.description =
      "Description should be at least 30 characters, so volunteers know what to expect.";
  }

  return errors;
}

function inputClass(hasError: boolean, withIcon = true) {
  return [
    "w-full rounded-xl border bg-[#E8E4E2]/50 dark:bg-[#1F1915]/60 py-3 pr-4 text-sm text-[#1F1915] dark:text-[#E8E4E2] outline-none transition-colors",
    "placeholder:text-[#3E3229]/60 dark:placeholder:text-[#E8E4E2]/50 focus:ring-2",
    withIcon ? "pl-11" : "pl-4",
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "border-[#D8D2CD] dark:border-[#3E3229] focus:border-[#73573F] focus:ring-[#73573F]/20 dark:focus:border-[#E8E4E2]",
  ].join(" ");
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-semibold text-[#1F1915] dark:text-[#E8E4E2]"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/60">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default function CreateEventPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");
    setMinDate(today);
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!activeUserEmail) {
      toast.error("Please log in to create an event.");
      return;
    }

    const found = validate(form, minDate);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      // Points directly to your Express server running on port 8000
      const res = await fetch("http://localhost:8000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          eventType: form.eventType,
          eventDate: form.eventDate,
          location: form.location.trim(),
          thumbnail: form.thumbnail.trim(),
          description: form.description.trim(),
          userEmail: activeUserEmail,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(
          data.message ||
            "Something went wrong while adding your event. Please try again.",
        );
        return;
      }

      toast.success("Event added! Neighbors can now find and join it.");
      setForm(emptyForm);
      router.push("/upcoming-events");
    } catch {
      toast.error(
        "Couldn't reach the server. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-12 transition-colors duration-300 md:py-16 bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2]">
      <div className="mx-auto max-w-2xl">
        <span className="mb-4 inline-flex items-center space-x-2 rounded-full border border-[#73573F]/20 dark:border-[#73573F]/40 bg-[#73573F]/10 dark:bg-[#73573F]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#73573F] dark:text-[#E8E4E2]">
          <Sparkles className="h-4 w-4" />
          <span>Care Vision Event</span>
        </span>

        <h1 className="text-3xl font-serif font-extrabold uppercase tracking-tight text-[#1F1915] dark:text-[#E8E4E2] md:text-4xl">
          Create a{" "}
          <span className="text-[#73573F] dark:text-[#E8E4E2]/90">
            Care Event
          </span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#3E3229]/80 dark:text-[#E8E4E2]/70 md:text-base">
          Gather your neighbors for a winter clothes distribution, a food drive,
          or a cleanup your area needs.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-6">
          <Field label="Event Title" htmlFor="title" error={errors.title}>
            <div className="relative">
              <Type className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73573F] dark:text-[#E8E4E2]/60" />
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Blanket Distribution for the Needy, Mohammadpur"
                className={inputClass(!!errors.title)}
              />
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field
              label="Event Type"
              htmlFor="eventType"
              error={errors.eventType}
            >
              <div className="relative">
                <Tag className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73573F] dark:text-[#E8E4E2]/60" />
                <select
                  id="eventType"
                  value={form.eventType}
                  onChange={(e) => update("eventType", e.target.value)}
                  className={inputClass(!!errors.eventType)}
                >
                  <option value="" className="bg-[#E8E4E2] dark:bg-[#1F1915]">
                    Select event type
                  </option>
                  {EVENT_TYPES.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-[#E8E4E2] dark:bg-[#1F1915]"
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </Field>

            <Field
              label="Event Date"
              htmlFor="eventDate"
              error={errors.eventDate}
              hint="Pick today or a future date so volunteers can plan ahead."
            >
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73573F] dark:text-[#E8E4E2]/60" />
                <input
                  id="eventDate"
                  type="date"
                  min={minDate}
                  value={form.eventDate}
                  onChange={(e) => update("eventDate", e.target.value)}
                  className={`${inputClass(!!errors.eventDate)} [color-scheme:light] dark:[color-scheme:dark]`}
                />
              </div>
            </Field>
          </div>

          <Field label="Location" htmlFor="location" error={errors.location}>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73573F] dark:text-[#E8E4E2]/60" />
              <input
                id="location"
                type="text"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="e.g. Mirpur 10 Community Field, Dhaka"
                className={inputClass(!!errors.location)}
              />
            </div>
          </Field>

          <div>
            <Field
              label="Thumbnail Image URL"
              htmlFor="thumbnail"
              error={errors.thumbnail}
              hint="Use a clear photo of the cause. It appears on your event card."
            >
              <div className="relative">
                <ImageIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73573F] dark:text-[#E8E4E2]/60" />
                <input
                  id="thumbnail"
                  type="url"
                  value={form.thumbnail}
                  onChange={(e) => update("thumbnail", e.target.value)}
                  placeholder="Paste a direct image link (ends in .jpg, .png, or .webp)"
                  className={inputClass(!!errors.thumbnail)}
                />
              </div>
            </Field>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/60">
              <span>Need a photo? Try:</span>
              {PHOTO_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => update("thumbnail", preset.url)}
                  className="font-semibold text-[#73573F] dark:text-[#E8E4E2] underline transition-opacity hover:opacity-80"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <Field
            label="Event Description"
            htmlFor="description"
            error={errors.description}
          >
            <textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Tell volunteers what the event is for, what to bring, and when to arrive."
              className={`${inputClass(!!errors.description, false)} resize-y`}
            />
            <p className="mt-1 text-right text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/60">
              {form.description.trim().length} / 30 minimum
            </p>
          </Field>

          <div className="flex items-center justify-between rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-[#E8E4E2]/60 dark:bg-[#1F1915]/60 px-5 py-4 text-sm">
            <span className="text-[#3E3229]/80 dark:text-[#E8E4E2]/70">
              Organizing as
            </span>
            <span className="font-semibold text-[#1F1915] dark:text-[#E8E4E2]">
              {activeUserEmail || "Not logged in"}
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center space-x-2 rounded-xl px-8 py-3.5 text-base font-semibold shadow-lg transition-all duration-300 bg-[#73573F] dark:bg-[#E8E4E2] text-[#E8E4E2] dark:text-[#1F1915] hover:bg-[#1F1915] dark:hover:bg-[#73573F] dark:hover:text-[#E8E4E2] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Adding Event...</span>
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5" />
                <span>Add Event</span>
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
