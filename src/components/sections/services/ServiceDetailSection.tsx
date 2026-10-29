import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import type { ServiceId } from "@/content/serviceIds";

const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 pt-15";
const images: Record<ServiceId, string> = {
  strength: "/images/home-page/our-paths/our-paths1.webp",
  cardio: "/images/home-page/our-paths/our-paths2.webp",
  mobility: "/images/home-page/our-paths/our-paths3.webp",
  football: "/images/home-page/our-paths/our-paths4.webp",
};

export async function ServiceDetailSection({
  service,
}: {
  service: ServiceId;
}) {
  const selected = service;
  const t = await getTranslations("home.servicesPage.services");
  const root = await getTranslations("home.servicesPage");
  const serviceT = (key: string) => t(`${selected}.${key}`);
  const highlights = t.raw(`${selected}.highlights`) as string[];

  return (
    <section
      id={selected}
      className="scroll-mt-28 border-b border-border bg-background py-16 sm:py-20 lg:py-24"
    >
      <div
        className={`${shell} grid items-stretch gap-5 lg:grid-cols-[.92fr_1.08fr]`}
      >
        <div className="relative min-h-[420px] overflow-hidden rounded-[28px] border border-border sm:min-h-[520px]">
          <Image
            src={images[selected]}
            alt={serviceT("name")}
            fill
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/75 via-transparent to-transparent" />
        </div>
        <div className="flex flex-col justify-center rounded-[28px] border border-border bg-surface p-6 sm:p-8 lg:p-12">
          <p className="text-xs font-extrabold uppercase tracking-[.22em] text-accent rtl:tracking-normal">
            {serviceT("eyebrow")}
          </p>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3.75rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.04em] text-foreground rtl:leading-[1.25] rtl:tracking-normal">
            {serviceT("name")}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8">
            {serviceT("description")}
          </p>
          <ul className="mt-7 space-y-3">
            {highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-3 text-sm leading-7 text-foreground/80 sm:text-base"
              >
                <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check className="size-3.5" />
                </span>
                {highlight}
              </li>
            ))}
          </ul>
          <a
            href="#packages"
            className={buttonVariants({
              variant: "glass-accent",
              size: "lg",
              className: "mt-8 min-h-12 w-fit rounded-full! px-7!",
            })}
          >
            {root("viewPackages")}
          </a>
        </div>
      </div>
    </section>
  );
}
