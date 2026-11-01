"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link"; // Fixed: Imported from next/link
import { ArrowRight, HeartHandshake } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative w-full py-16 md:py-24 px-8 border-b transition-colors duration-300 bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2] border-[#D8D2CD] dark:border-[#3E3229]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text Content & Call to Actions */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest mb-6 transition-colors duration-300 bg-[#73573F]/10 dark:bg-[#73573F]/20 border-[#73573F]/20 dark:border-[#73573F]/40 text-[#73573F] dark:text-[#E8E4E2]">
            <HeartHandshake className="w-4 h-4" />
            <span>Community Care & Support</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-tight mb-6 transition-colors duration-300 text-[#1F1915] dark:text-[#E8E4E2]">
            Bring Help to Those Who Need It
          </h1>

          {/* Subtitle Paragraph */}
          <p className="text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-light transition-colors duration-300 text-[#3E3229]/80 dark:text-[#E8E4E2]/70">
            Connect with local initiatives, join meaningful events, or start
            your own campaign to make a lasting difference.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
            {/* Primary Action Link */}
            <Link
              href="/events"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-semibold text-base shadow-lg transition-all duration-300 bg-[#73573F] dark:bg-[#E8E4E2] text-[#E8E4E2] dark:text-[#1F1915] hover:bg-[#1F1915] dark:hover:bg-[#73573F] dark:hover:text-[#E8E4E2]"
            >
              <span>Explore Upcoming Events</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Secondary Action Link (Fixed: removed nested <button>) */}
            <Link
              href="/create-event"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 border px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 border-[#73573F]/30 dark:border-[#73573F]/50 text-[#1F1915] dark:text-[#E8E4E2] hover:bg-[#73573F]/10 dark:hover:bg-[#73573F]/20 text-center"
            >
              <span>Create an Event</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Banner PNG Image */}
        <div className="flex items-center justify-center relative w-full h-full min-h-[320px] md:min-h-[400px]">
          <Image
            src="/bannerPic.png"
            alt="Care Vision Community Support"
            width={600}
            height={500}
            priority
            className="w-full max-w-lg h-auto object-contain drop-shadow-md transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>
      </div>
    </section>
  );
}
