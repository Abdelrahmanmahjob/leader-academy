import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12";
const ids = ["strength", "cardio", "mobility"] as const;

export async function ServicePackagesSection({ service }: { service: string }) {
  const selected = ids.includes(service as (typeof ids)[number]) ? service : "strength";
  const root = await getTranslations("home.servicesPage");
  const serviceRoot = await getTranslations(`home.servicesPage.services.${selected}`);
  const packagePrices = root.raw("packagePrices") as Record<string, Array<{ name: string; price: string; unit: string; description: string }>>;
  const packages = packagePrices[selected];

  return (
    <section id="packages" className="scroll-mt-28 border-b border-border bg-background py-16 sm:py-20 lg:py-24">
      <div className={shell}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[.22em] text-accent rtl:tracking-normal">{root("packagesTitle")}</p>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-extrabold uppercase tracking-[-0.04em] rtl:tracking-normal">{root("packagesTitle")}</h2>
          <p className="mt-4 text-base text-foreground/65 sm:text-lg">{serviceRoot("packagesDescription")}</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-14">
          {packages.map((pkg, index) => (
            <article key={pkg.name} className={`relative flex min-h-[340px] flex-col rounded-[28px] border p-6 transition-transform duration-500 sm:p-8 lg:hover:-translate-y-2 ${index === 1 ? "border-accent/60 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--la-accent)_10%,var(--la-surface)),var(--la-surface))]" : "border-border bg-surface"}`}>
              <p className="text-lg font-bold text-foreground/75">{pkg.name}</p>
              <div className="mt-5 flex items-end gap-2 border-b border-border pb-6">
                <span className="text-5xl font-extrabold tracking-tight">{pkg.price}</span>
                <span className="pb-1 text-sm font-bold text-foreground/60">SAR / {pkg.unit}</span>
              </div>
              <p className="mt-5 leading-7 text-foreground/65">{pkg.description}</p>
              <ul className="mt-auto space-y-3 pt-8">
                {[serviceRoot("name")].map((feature) => <li key={feature} className="flex items-center gap-3 text-sm font-medium text-foreground/80"><span className="flex size-5 items-center justify-center rounded-full bg-accent/15 text-accent"><Check className="size-3.5" /></span>{feature}</li>)}
              </ul>
              <Link href="/contact" className={buttonVariants({ variant: index === 1 ? "glass-accent" : "glass", size: "lg", className: "mt-7 min-h-12 w-full rounded-full!" })}>{root("viewPackages")}</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
