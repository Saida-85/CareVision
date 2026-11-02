"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Heart,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client"; // Adjust path to your auth client

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Assignment Password Validation Rules:
    // - Length at least 6 characters
    // - Must have an uppercase letter
    // - Must have a lowercase letter
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter.");
      return;
    }

    try {
      setLoading(true);

      // Better Auth Sign Up (Automatically saves user data to MongoDB database)
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        image: photoURL, // Maps photoURL to Better Auth's image field saved in MongoDB
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully! Welcome to CareVision.");
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      console.error(err);
      toast.error("Google sign-in failed.");
    }
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
            Create Account
          </h1>
          <p className="text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/70 mt-2 font-light">
            Join CareVision to organize and participate in drives
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E3229] dark:text-[#E8E4E2]/80 mb-1.5">
              Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#3E3229]/50 dark:text-[#E8E4E2]/50">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Saida Nosrat"
                required
                className="w-full rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white dark:bg-[#1F1915]/60 py-3 pl-11 pr-4 text-sm text-[#1F1915] dark:text-[#E8E4E2] placeholder-[#3E3229]/40 dark:placeholder-[#E8E4E2]/40 focus:border-[#73573F] focus:outline-none focus:ring-1 focus:ring-[#73573F] transition-all"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E3229] dark:text-[#E8E4E2]/80 mb-1.5">
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
                className="w-full rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white dark:bg-[#1F1915]/60 py-3 pl-11 pr-4 text-sm text-[#1F1915] dark:text-[#E8E4E2] placeholder-[#3E3229]/40 dark:placeholder-[#E8E4E2]/40 focus:border-[#73573F] focus:outline-none focus:ring-1 focus:ring-[#73573F] transition-all"
              />
            </div>
          </div>

          {/* Photo URL Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E3229] dark:text-[#E8E4E2]/80 mb-1.5">
              Photo URL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#3E3229]/50 dark:text-[#E8E4E2]/50">
                <ImageIcon className="h-4 w-4" />
              </span>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                required
                className="w-full rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white dark:bg-[#1F1915]/60 py-3 pl-11 pr-4 text-sm text-[#1F1915] dark:text-[#E8E4E2] placeholder-[#3E3229]/40 dark:placeholder-[#E8E4E2]/40 focus:border-[#73573F] focus:outline-none focus:ring-1 focus:ring-[#73573F] transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E3229] dark:text-[#E8E4E2]/80 mb-1.5">
              Password
            </label>
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
                className="w-full rounded-xl border border-[#D8D2CD] dark:border-[#3E3229] bg-white dark:bg-[#1F1915]/60 py-3 pl-11 pr-12 text-sm text-[#1F1915] dark:text-[#E8E4E2] placeholder-[#3E3229]/40 dark:placeholder-[#E8E4E2]/40 focus:border-[#73573F] focus:outline-none focus:ring-1 focus:ring-[#73573F] transition-all"
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
            <p className="text-[10px] text-[#3E3229]/60 dark:text-[#E8E4E2]/50 mt-1">
              Must have uppercase, lowercase, and min 6 characters.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center space-x-2 rounded-xl bg-[#73573F] hover:bg-[#5c4532] text-white py-3.5 text-xs font-bold uppercase tracking-[0.15em] transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            <span>{loading ? "Creating Account..." : "Register"}</span>
            {!loading && <span className="text-base">→</span>}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
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

        {/* Footer Redirect to Login */}
        <p className="mt-6 text-center text-xs text-[#3E3229]/70 dark:text-[#E8E4E2]/70 font-light">
          Already have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#73573F] dark:text-[#E8E4E2] hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}
