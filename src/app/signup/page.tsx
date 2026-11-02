"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Heart } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);
      // Add your sign-in logic here (e.g., Better Auth)
      toast.success("Successfully signed in!");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.success("Redirecting to Google login...");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2] transition-colors duration-300">
      <div className="w-full max-w-md rounded-3xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/70 dark:bg-[#1F1915]/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        {/* Brand Logo Icon */}
        <div className="flex justify-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#73573F]/10 text-[#73573F] dark:bg-[#73573F]/20 dark:text-[#E8E4E2] shadow-inner">
            <Heart className="h-7 w-7 fill-[#73573F]/20 text-[#73573F] dark:text-[#E8E4E2]" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold tracking-tight text-[#1F1915] dark:text-[#E8E4E2] uppercase">
            Welcome Back
          </h1>
          <p className="text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/70 mt-2 font-light">
            Sign in to organize and join community drives
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E3229] dark:text-[#E8E4E2]/80 mb-2">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#3E3229]/50 dark:text-[#E8E4E2]/50">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white dark:bg-[#1F1915]/60 py-3.5 pl-11 pr-4 text-sm text-[#1F1915] dark:text-[#E8E4E2] placeholder-[#3E3229]/40 dark:placeholder-[#E8E4E2]/40 focus:border-[#73573F] focus:outline-none focus:ring-1 focus:ring-[#73573F] transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3E3229] dark:text-[#E8E4E2]/80">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-[#73573F] dark:text-[#E8E4E2] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#3E3229]/50 dark:text-[#E8E4E2]/50">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white dark:bg-[#1F1915]/60 py-3.5 pl-11 pr-12 text-sm text-[#1F1915] dark:text-[#E8E4E2] placeholder-[#3E3229]/40 dark:placeholder-[#E8E4E2]/40 focus:border-[#73573F] focus:outline-none focus:ring-1 focus:ring-[#73573F] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#3E3229]/50 dark:text-[#E8E4E2]/50 hover:text-[#1F1915] dark:hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#73573F] hover:bg-[#5c4532] text-white py-3.5 text-xs font-bold uppercase tracking-[0.15em] transition-all shadow-lg active:scale-[0.98]"
          >
            <span>Sign In</span>
            <span className="text-base">→</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#D8D2CD] dark:border-[#3E3229]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/90 dark:bg-[#1F1915] px-3 text-[#3E3229]/60 dark:text-[#E8E4E2]/60 font-medium tracking-wider">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center space-x-3 rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white/50 dark:bg-[#1F1915]/50 hover:bg-[#D8D2CD]/20 dark:hover:bg-[#3E3229]/50 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#1F1915] dark:text-[#E8E4E2] transition-all shadow-sm active:scale-[0.98]"
        >
          <FcGoogle className="h-5 w-5" />
          <span>Continue with Google</span>
        </button>

        {/* Footer Redirect */}
        <p className="mt-8 text-center text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/70 font-light">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#73573F] dark:text-[#E8E4E2] hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
