"use client";

import React from "react";
import Link from "next/link";
import {
  HeartHandshake,
  CalendarPlus,
  Gift,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

type HelpItem = {
  title: string;
  description: string;
  href: string;
  cta: string;
  Icon: LucideIcon;
};

const helpItems: HelpItem[] = [
  {
    title: "Become a Volunteer",
    description:
      "Pick a drive near you, join with one click, and show up with your neighbors. Every pair of hands counts.",
    href: "/events",
    cta: "Find an event",
    Icon: HeartHandshake,
  },
  {
    title: "Organize a Drive",
    description:
      "See a need in your area? Create an event for clothes, blankets, meals, or a cleanup and invite others to join.",
    href: "/events/create",
    cta: "Create an event",
    Icon: CalendarPlus,
  },
  {
    title: "Give What You Can",
    description:
      "Donate warm clothes, food, or school supplies at a nearby drive and reach people who need them most.",
    href: "/events",
    cta: "See active drives",
    Icon: Gift,
  },
  {
    title: "Spread the Word",
    description:
      "Share upcoming events with friends and family. More volunteers means more people helped.",
    href: "/events",
    cta: "Share events",
    Icon: Megaphone,
  },
];

export default function HowCanYouHelp() {
  return (
    <section className="px-4 py-16 transition-colors duration-300 md:py-20 bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2]">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-serif font-extrabold uppercase tracking-tight text-[#1F1915] dark:text-[#E8E4E2] md:text-4xl">
            How can{" "}
            <span className="text-[#73573F] dark:text-[#E8E4E2]/90">
              you help?
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#3E3229]/80 dark:text-[#E8E4E2]/70 md:text-base">
            Change starts with one person deciding to act. Choose the way that
            fits you best and make a difference in your neighborhood this week.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {helpItems.map(({ title, description, href, cta, Icon }) => (
            <article
              key={title}
              className="group relative flex h-full flex-col items-center rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-[#E8E4E2]/60 dark:bg-[#1F1915]/60 px-6 pb-8 pt-12 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#73573F]/40"
            >
              {/* Ribbon (shows on hover) */}
              <div className="absolute -top-2 left-1/2 flex h-24 w-20 -translate-x-1/2 items-center justify-center bg-[#73573F] opacity-0 shadow-md transition-opacity duration-300 [clip-path:polygon(0_0,100%_0,100%_100%,50%_88%,0_100%)] group-hover:opacity-100">
                <Icon className="h-9 w-9 text-[#E8E4E2]" strokeWidth={1.5} />
              </div>

              {/* Default icon (hides on hover) */}
              <div className="mb-6 flex h-16 items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                <Icon
                  className="h-12 w-12 text-[#73573F] dark:text-[#E8E4E2]/60"
                  strokeWidth={1.25}
                />
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#1F1915] dark:text-[#E8E4E2]">
                {title}
              </h3>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-[#3E3229]/80 dark:text-[#E8E4E2]/70">
                {description}
              </p>

              <Link
                href={href}
                className="mt-6 text-sm font-bold uppercase tracking-wide text-[#73573F] dark:text-[#E8E4E2] transition-colors hover:text-[#1F1915] dark:hover:text-[#73573F]"
              >
                {cta} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
