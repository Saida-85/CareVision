"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calendar, Sun, Moon, LogIn } from "lucide-react";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev;
      if (nextMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return nextMode;
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full px-8 py-4 flex items-center justify-between border-b transition-colors duration-300 shadow-sm bg-[#E8E4E2]/90 dark:bg-[#1F1915]/90 backdrop-blur-md text-[#1F1915] dark:text-[#E8E4E2] border-[#D8D2CD] dark:border-[#3E3229]">
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
      <div className="flex items-center space-x-2 cursor-pointer transition-colors duration-200 font-medium text-sm text-[#3E3229] hover:text-[#1F1915] dark:text-[#E8E4E2]/80 dark:hover:text-[#E8E4E2]">
        <Calendar className="w-4 h-4 text-[#73573F] dark:text-[#E8E4E2]/60" />
        <span>Upcoming Events</span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="group p-2 rounded-full border transition-all duration-200 focus:outline-none border-[#73573F]/30 text-[#1F1915] hover:bg-[#73573F]/10 dark:border-[#3E3229] dark:text-amber-400 dark:hover:bg-[#3E3229]/50"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 transition-transform duration-700 ease-in-out group-hover:rotate-180" />
          ) : (
            <Moon className="w-4 h-4 transition-transform duration-700 ease-in-out group-hover:-rotate-30 group-hover:scale-110" />
          )}
        </button>

        {/* Login Button */}
        <button className="flex items-center space-x-2 px-5 py-2 rounded-xl font-semibold text-sm shadow-md transition-all duration-300 bg-[#73573F] text-[#E8E4E2] hover:bg-[#1F1915] dark:bg-[#E8E4E2] dark:text-[#1F1915] dark:hover:bg-[#73573F] dark:hover:text-[#E8E4E2]">
          <LogIn className="w-4 h-4" />
          <span>Login</span>
        </button>
      </div>
    </nav>
  );
}
