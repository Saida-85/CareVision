"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { MapPin, Phone, Mail, ArrowUp } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2] border-t border-[#73573F]/20 transition-colors duration-300">
      {/* Top Gold Hairline Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#73573F]/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 1. INVITATION BAND (NEWSLETTER) */}
        <div className="py-12 md:py-16 border-b border-[#73573F]/15 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#1F1915] dark:text-[#E8E4E2]">
              Stay connected
            </h2>
            <p className="mt-2 text-sm text-[#3E3229]/80 dark:text-[#A39B94] font-light">
              Receive thoughtful updates on health initiatives and community
              impact.
            </p>
          </div>

          <div className="relative">
            {!subscribed ? (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end"
              >
                <div className="relative flex-grow">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full bg-transparent border-b border-[#73573F]/40 py-3 text-sm text-[#1F1915] dark:text-[#E8E4E2] placeholder:text-[#3E3229]/60 dark:placeholder:text-[#A39B94]/60 outline-none focus:border-[#73573F] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-transparent border border-[#73573F] text-[#73573F] hover:bg-[#73573F] hover:text-[#E8E4E2] dark:hover:text-[#1F1915] px-8 py-3 text-xs uppercase tracking-[0.18em] font-medium transition-all duration-300 min-h-[44px] flex items-center justify-center cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="text-[#73573F] font-serif italic text-xl animate-fade-in">
                Thank you for subscribing to Care Vision.
              </div>
            )}
          </div>
        </div>

        {/* 2. MAIN FOOTER GRID (3 COLUMNS: Brand, Services, Contact) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-16 gap-12 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link
              href="/"
              className="font-serif text-3xl text-[#73573F] tracking-wide inline-block"
            >
              Care Vision
            </Link>
            <p className="text-sm text-[#3E3229]/80 dark:text-[#A39B94] font-light leading-relaxed max-w-xs">
              Dedicated to bringing refined, compassionate health initiatives
              and seamless community support to every life we touch.
            </p>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#73573F] mb-6">
              Services
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Health Checkups", href: "#" },
                { label: "Community Outreach", href: "#" },
                { label: "Telehealth Support", href: "#" },
                { label: "Volunteer", href: "/create-event" },
                { label: "Donate", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#3E3229]/80 dark:text-[#A39B94] hover:text-[#1F1915] dark:hover:text-[#E8E4E2] font-light transition-colors relative inline-block group"
                  >
                    {link.label}
                    <span className="absolute bottom-[-2px] left-0 w-0 h-[1px] bg-[#73573F] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#73573F] mb-6">
              Contact
            </h3>
            <address className="not-italic space-y-4 text-sm text-[#3E3229]/80 dark:text-[#A39B94] font-light">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#73573F] shrink-0 mt-1" />
                <span>123 Your Street, City, Country</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#73573F] shrink-0" />
                <a
                  href="tel:+000000000000"
                  className="hover:text-[#73573F] transition-colors"
                >
                  +000 000 000 000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#73573F] shrink-0" />
                <a
                  href="mailto:hello@carevision.org"
                  className="hover:text-[#73573F] transition-colors"
                >
                  hello@carevision.org
                </a>
              </div>

              {/* 24/7 Support Badge */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[#73573F]/20 bg-[#73573F]/5 mt-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#73573F] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#73573F]"></span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#1F1915] dark:text-[#E8E4E2] font-normal">
                  Support available 24/7
                </span>
              </div>
            </address>
          </div>
        </div>

        {/* 3. BOTTOM BAR */}
        <div className="py-8 border-t border-[#73573F]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#3E3229]/80 dark:text-[#A39B94] font-light">
          <p>© {currentYear} Care Vision. All rights reserved.</p>

          <ul className="flex items-center gap-6">
            <li>
              <Link
                href="/privacy"
                className="hover:text-[#73573F] transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-[#73573F] transition-colors"
              >
                Terms
              </Link>
            </li>
            <li>
              <Link
                href="/accessibility"
                className="hover:text-[#73573F] transition-colors"
              >
                Accessibility
              </Link>
            </li>
          </ul>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="w-11 h-11 rounded-full border border-[#73573F]/30 bg-transparent text-[#1F1915] dark:text-[#E8E4E2] flex items-center justify-center hover:border-[#73573F] hover:bg-[#73573F] hover:text-[#E8E4E2] dark:hover:text-[#1F1915] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
