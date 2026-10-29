import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailSection } from "@/components/sections/services/ServiceDetailSection";
import { ServicePackagesSection } from "@/components/sections/services/ServicePackagesSection";
import { MoreServicesSection } from "@/components/sections/services/MoreServicesSection";
import { isServiceId, SERVICE_IDS } from "@/content/serviceIds";

export function generateStaticParams() {
  return SERVICE_IDS.map((service) => ({ service }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  if (!isServiceId(service)) return {};

  const titles = {
    strength: "Strength & Fitness",
    cardio: "Cardio & Heart Health",
    mobility: "Mobility & Recovery",
    football: "Football Performance",
  } satisfies Record<(typeof SERVICE_IDS)[number], string>;

  return {
    title: titles[service],
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  if (!isServiceId(service)) notFound();

  return (
    <main id="main-content">
      <ServiceDetailSection service={service} />
      <ServicePackagesSection service={service} />
      <MoreServicesSection service={service} />
    </main>
  );
}
