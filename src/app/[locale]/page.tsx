import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/home/HeroSection";
import { OurPathsSection } from "@/components/sections/home/OurPathsSection";
import { PricingSection } from "@/components/sections/home/PricingSection";
import { PartnerSection } from "@/components/sections/home/PartnerSection";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Personalized training and a supportive community at Leader Academy.",
};

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroSection />
      <OurPathsSection />
      <PricingSection />
      <PartnerSection />
    </main>
  );
}
