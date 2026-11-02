import type { Metadata } from "next";
import { ServicesPathsSection } from "@/components/sections/services/ServicesPathsSection";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore football skills, conditioning, and player development at Leader Academy.",
};

export default function ServicesPage() {
  return (
    <main id="main-content" className="pt-12">
      <ServicesPathsSection />
    </main>
  );
}
