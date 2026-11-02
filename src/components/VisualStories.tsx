export default function VisualStories() {
  const stories = [
    {
      title: "Warmth for Rickshaw Pullers",
      subtitle: "Winter Clothes Drive",
      location: "Mirpur 10, Dhaka",
      image:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=700&q=80",
    },
    {
      title: "Shelterless Night Support",
      subtitle: "Night Blanket Relief",
      location: "Mohammadpur, Dhaka",
      image:
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=700&q=80",
    },
    {
      title: "Eco Plastic-Free Waters",
      subtitle: "Dhanmondi Lake Clean-up",
      location: "Dhanmondi, Dhaka",
      image:
        "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=700&q=80",
    },
    {
      title: "1000 Green Saplings",
      subtitle: "Urban Tree Plantation",
      location: "Uttara, Dhaka",
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=700&q=80",
    },
    {
      title: "Fresh Meals Sharing",
      subtitle: "Community Food Relief",
      location: "Old Dhaka",
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=80",
    },
    {
      title: "Education for Underprivileged",
      subtitle: "Children Book & Bag Drive",
      location: "Rayerbazar, Dhaka",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=700&q=80",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#73573F] dark:text-[#E8E4E2]/70 mb-2 block">
          Visual Stories
        </span>
        <h2 className="text-3xl font-serif font-extrabold uppercase tracking-tight md:text-4xl">
          Community in Action
        </h2>
        <p className="mt-2 text-sm text-[#3E3229]/80 dark:text-[#E8E4E2]/70 font-light max-w-2xl mx-auto">
          Moments from volunteer drives, relief distributions, and green
          initiatives across Dhaka and beyond.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((story, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl shadow-md bg-white dark:bg-[#2A221C] border border-[#3E3229]/10 dark:border-[#E8E4E2]/10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={story.image}
                alt={story.subtitle}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 transition-opacity" />
            </div>

            {/* Card Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className="inline-block px-2.5 py-1 mb-2 text-[10px] font-semibold uppercase tracking-widest bg-[#73573F]/90 backdrop-blur-sm rounded-md">
                {story.title}
              </span>
              <h3 className="text-lg font-bold leading-snug font-serif">
                {story.subtitle}
              </h3>
              <p className="mt-1 text-xs text-gray-300 font-light flex items-center gap-1">
                📍 {story.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
