"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Sun,
  Moon,
  LogIn,
  LogOut,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Settings,
  CheckSquare,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Successfully logged out!");
            router.push("/signup");
            router.refresh();
          },
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full px-8 py-4 flex items-center justify-between border-b transition-colors duration-300 shadow-sm bg-[#E8E4E2]/90 dark:bg-[#1F1915]/90 backdrop-blur-md text-[#1F1915] dark:text-[#E8E4E2] border-[#D8D2CD] dark:border-[#3E3229]">
      {/* Left: Care Vision Logo linked to Home */}
      <Link
        href="/"
        className="flex items-center cursor-pointer overflow-visible pl-4"
      >
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
      </Link>

      {/* Center: Navigation Link */}
      <Link
        href="/upcoming-events"
        className="flex items-center space-x-2 cursor-pointer transition-colors duration-200 font-medium text-sm text-[#3E3229] hover:text-[#1F1915] dark:text-[#E8E4E2]/80 dark:hover:text-[#E8E4E2]"
      >
        <Calendar className="w-4 h-4 text-[#73573F] dark:text-[#E8E4E2]/60" />
        <span>Upcoming Events</span>
      </Link>

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

        {/* Conditional Auth: User Profile / Dropdown vs Login Link */}
        {!isPending &&
          (user ? (
            <div
              className="relative flex items-center space-x-3"
              ref={dropdownRef}
            >
              {/* User Profile Trigger with Hover Title */}
              <div
                title={user.name || "User"}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#73573F] dark:border-[#00C896] shadow-md transition-transform group-hover:scale-105 flex items-center justify-center bg-[#73573F] text-white font-bold text-sm">
                  {user?.image &&
                  (user.image.startsWith("http") ||
                    user.image.startsWith("/")) ? (
                    <img
                      src={user.image}
                      alt={user.name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="text-[#3E3229] dark:text-[#E8E4E2] focus:outline-none"
                >
                  {dropdownOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Logout Button in Navbar */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-xs border border-[#73573F]/30 dark:border-[#3E3229] text-[#73573F] dark:text-[#E8E4E2] hover:bg-[#73573F]/10 dark:hover:bg-[#3E3229]/50 transition-all shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Logout</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-14 w-64 rounded-2xl border border-[#D8D2CD] dark:border-[#3E3229] bg-[#E8E4E2] dark:bg-[#151a21] shadow-2xl backdrop-blur-xl py-3 text-[#1F1915] dark:text-[#E8E4E2] z-50 animate-in fade-in slide-in-from-top-2">
                  {/* User Info Header */}
                  <div className="px-4 pb-3 border-b border-[#D8D2CD] dark:border-[#3E3229]">
                    <p className="font-bold text-sm truncate text-[#1F1915] dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-[#3E3229]/70 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Dropdown Links (Private/Protected Routes) */}
                  <div className="py-2 space-y-1">
                    <Link
                      href="/create-event"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-xs font-semibold hover:bg-[#73573F]/10 dark:hover:bg-white/5 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-[#73573F] dark:text-[#00C896]" />
                      <span>Create Event</span>
                    </Link>

                    <Link
                      href="/manage-events"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-xs font-semibold hover:bg-[#73573F]/10 dark:hover:bg-white/5 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-purple-500" />
                      <span>Manage Events</span>
                    </Link>

                    <Link
                      href="/joined-events"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-xs font-semibold hover:bg-[#73573F]/10 dark:hover:bg-white/5 transition-colors"
                    >
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                      <span>Joined Events</span>
                    </Link>
                  </div>

                  {/* Dropdown Footer Logout */}
                  <div className="pt-2 border-t border-[#D8D2CD] dark:border-[#3E3229]">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Login Link styled as a Button (Fixed nesting issue) */
            <div className="relative z-[999] pointer-events-auto">
              <Link
                href="/signup"
                className="flex items-center space-x-2 px-5 py-2 rounded-xl font-semibold text-sm shadow-md transition-all duration-300 bg-[#73573F] text-[#E8E4E2] hover:bg-[#1F1915] dark:bg-[#E8E4E2] dark:text-[#1F1915] dark:hover:bg-[#73573F] dark:hover:text-[#E8E4E2] cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            </div>
          ))}
      </div>
    </nav>
  );
}
