import Hero from "@/components/landing/Hero";
import TripGrid from "@/components/trips/TripGrid";
import BlogSection from "@/components/blogs/BlogSection";

export default function Home() {
  return (
    <div className="space-y-12">
      <Hero />
      <TripGrid />
      <BlogSection />
    </div>
  );
}