"use client"; // <-- Add this line at the top

export default function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="rounded-3xl bg-[#73573F] dark:bg-[#2A221C] p-8 md:p-14 text-center text-white shadow-xl relative overflow-hidden">
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

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-5 py-3.5 rounded-xl bg-white/10 dark:bg-black/20 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#E8E4E2] text-[#1F1915] font-semibold text-sm uppercase tracking-wider hover:bg-white transition-all shadow-md"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-xs text-[#E8E4E2]/60">
            No spam guaranteed. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
