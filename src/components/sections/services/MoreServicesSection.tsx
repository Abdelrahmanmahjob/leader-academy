import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SERVICE_IDS, type ServiceId } from "@/content/serviceIds";

const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12";
const images: Record<ServiceId, string> = {
  strength: "/images/home-page/our-paths/our-paths1.webp",
  cardio: "/images/home-page/our-paths/our-paths2.webp",
  mobility: "/images/home-page/our-paths/our-paths3.webp",
  football: "/images/home-page/our-paths/our-paths4.webp",
};

export async function MoreServicesSection({
  service,
}: {
  service: ServiceId;
}) {
  const selected = service;
  const root = await getTranslations("home.servicesPage");
  const services = root.raw("services") as Record<
    ServiceId,
    { name: string; eyebrow: string }
  >;
  const others = SERVICE_IDS.filter((id) => id !== selected);

  return (
    <section className="border-b border-border bg-background py-16 sm:py-20 lg:py-24">
      <div className={shell}>
        <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold uppercase tracking-[-0.04em] rtl:tracking-normal">
          {root("moreTitle")}
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3 lg:mt-12">
          {others.map((id) => {
            const item = services[id];
            return (
              <Link
                key={id}
                href={`/services/${id}`}
                className="group relative min-h-[420px] overflow-hidden rounded-[28px] border border-border bg-surface sm:min-h-[500px]"
              >
                <Image
                  src={images[id]}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <span className="flex size-12 items-center justify-center rounded-full bg-accent text-inverse">
                    <ArrowUpRight className="size-5 rtl:-scale-x-100" />
                  </span>
                  <p className="mt-5 text-xs font-extrabold uppercase tracking-[.18em] text-accent rtl:tracking-normal">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                    {item.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
