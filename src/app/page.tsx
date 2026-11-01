import HeroBanner from "@/components/HeroBanner";
import HowCanYouHelp from "@/components/HowCanYouHelp";

export default function Home() {
  return (
    <main className="min-h-screen transition-colors duration-300 bg-[#E8E4E2] dark:bg-[#1F1915] text-[#1F1915] dark:text-[#E8E4E2]">
      <HeroBanner />
      <HowCanYouHelp />
    </main>
  );
}
