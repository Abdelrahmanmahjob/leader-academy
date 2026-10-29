import type { Metadata } from "next";
import { ServicesPathsSection } from "@/components/sections/services/ServicesPathsSection";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore strength, cardio, and mobility services at Leader Academy.",
};

export default function ServicesPage() {
  return (
    <main id="main-content" className="pt-12">
      <ServicesPathsSection />
    </main>
  );
}
