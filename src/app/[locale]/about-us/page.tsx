import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutValues } from "@/components/sections/about/AboutValues";
import { AboutVideo } from "@/components/sections/about/AboutVideo";
import { AboutExperts } from "@/components/sections/about/AboutExperts";
import { AboutMarquee } from "@/components/sections/about/AboutMarquee";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover Leader Academy, our values, coaches, and training community.",
};

export default function AboutUsPage() {
  return (
    <main id="main-content">
      <AboutHero />
      <AboutValues />
      <AboutVideo />
      <AboutExperts />
      <AboutMarquee />
    </main>
  );
}
