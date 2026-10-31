"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calendar, Sun, Moon, LogIn } from "lucide-react";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <nav
      className={`w-full px-8 py-4 flex items-center justify-between border-b transition-colors duration-300 shadow-sm ${
        isDarkMode
          ? "bg-[#1F1915] text-[#E8E4E2] border-[#3E3229]"
          : "bg-[#E8E4E2] text-[#1F1915] border-[#D8D2CD]"
      }`}
    >
      {/* Left: Care Vision Logo */}
      <div className="flex items-center cursor-pointer overflow-visible pl-4">
        <Image
          src="/careVisionLogo.png"
          alt="Care Vision Logo"
          width={400}
          height={150}
          priority
          style={{
            height: "50px",
            width: "auto",
            objectFit: "contain",
            transform: "scale(2.5)",
            transformOrigin: "left center",
          }}
        />
      </div>

      {/* Center: Navigation Link */}
      <div
        className={`flex items-center space-x-2 cursor-pointer transition-colors duration-200 font-medium text-sm ${
          isDarkMode
            ? "text-[#E8E4E2]/80 hover:text-[#E8E4E2]"
            : "text-[#3E3229] hover:text-[#1F1915]"
        }`}
      >
        <Calendar
          className={`w-4 h-4 ${
            isDarkMode ? "text-[#E8E4E2]/60" : "text-[#73573F]"
          }`}
        />
        <span>Upcoming Events</span>
      </div>

      {/* Right: Controls (Theme Toggle & Dynamic Theme Login Button) */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`group p-2 rounded-full border transition-all duration-200 focus:outline-none ${
            isDarkMode
              ? "border-[#3E3229] text-amber-400 hover:bg-[#3E3229]/50"
              : "border-[#73573F]/30 text-[#1F1915] hover:bg-[#73573F]/10"
          }`}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 transition-transform duration-700 ease-in-out group-hover:rotate-180" />
          ) : (
            <Moon className="w-4 h-4 transition-transform duration-700 ease-in-out group-hover:-rotate-30 group-hover:scale-110" />
          )}
        </button>

        {/* Dynamic Login Button */}
        <button
          className={`flex items-center space-x-2 px-5 py-2 rounded-xl font-semibold text-sm shadow-md transition-all duration-300 ${
            isDarkMode
              ? "bg-[#E8E4E2] text-[#1F1915] hover:bg-[#73573F] hover:text-[#E8E4E2]"
              : "bg-[#73573F] text-[#E8E4E2] hover:bg-[#1F1915] hover:text-[#E8E4E2]"
          }`}
        >
          <LogIn className="w-4 h-4" />
          <span>Login</span>
        </button>
      </div>
    </nav>
  );
}
