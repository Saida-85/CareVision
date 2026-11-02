"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    // Simulate network / subscription response
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      toast.success("Successfully subscribed to local cause alerts!");
    }, 500);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="rounded-3xl bg-[#73573F] dark:bg-[#2A221C] p-8 md:p-14 text-center text-white shadow-xl relative overflow-hidden transition-colors duration-300">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8E4E2]/80 mb-2 block">
            Stay Connected
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-extrabold uppercase tracking-tight mb-4">
            Subscribe to Local Cause Alerts
          </h2>
          <p className="text-sm md:text-base text-[#E8E4E2]/90 font-light mb-8">
            Get notified when new winter drives, blanket distributions, or
            emergency cleanups are organized in your neighborhood.
          </p>

          {!subscribed ? (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-5 py-3.5 rounded-xl bg-white/10 dark:bg-black/20 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#E8E4E2] text-[#1F1915] font-semibold text-sm uppercase tracking-wider hover:bg-white transition-all shadow-md disabled:opacity-75"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-inner animate-in fade-in zoom-in-95 duration-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>You&apos;re subscribed to local community alerts!</span>
            </div>
          )}

          <p className="mt-4 text-xs text-[#E8E4E2]/60">
            No spam guaranteed. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
