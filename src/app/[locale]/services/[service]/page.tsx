import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailSection } from "@/components/sections/services/ServiceDetailSection";
import { ServicePackagesSection } from "@/components/sections/services/ServicePackagesSection";
import { MoreServicesSection } from "@/components/sections/services/MoreServicesSection";

const serviceIds = ["strength", "cardio", "mobility"] as const;

export function generateStaticParams() {
  return serviceIds.map((service) => ({ service }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  if (!serviceIds.includes(service as (typeof serviceIds)[number])) return {};
  return {
    title:
      service === "strength"
        ? "Strength & Fitness"
        : service === "cardio"
          ? "Cardio & Heart Health"
          : "Mobility & Recovery",
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  if (!serviceIds.includes(service as (typeof serviceIds)[number])) notFound();

  return (
    <main id="main-content">
      <ServiceDetailSection service={service} />
      <ServicePackagesSection service={service} />
      <MoreServicesSection service={service} />
    </main>
  );
}
