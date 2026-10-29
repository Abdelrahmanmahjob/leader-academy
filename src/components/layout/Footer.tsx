import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "./BrandLogo";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("navigation");

  const links = [
    { href: "/", label: nav("home") },
    { href: "/about-us", label: nav("aboutUs") },
    { href: "/services", label: nav("services") },
    { href: "/classes", label: nav("classes") },
  ] as const;

  return (
    <footer className="relative z-20 border-t border-border bg-background/95">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <BrandLogo />
            <p className="mt-5 max-w-md text-sm leading-6 text-muted">
              {t("brandDescription")}
            </p>
          </div>

          <nav aria-label={t("quickLinks")}>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider">{t("quickLinks")}</h2>
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link className="inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-foreground" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider">{t("contact")}</h2>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-bold transition-colors hover:bg-hover"
            >
              {t("contactCta")}
            </Link>
          </div>
        </div>
        <div className="border-t border-border py-6 text-xs text-muted">{t("copyright")}</div>
      </Container>
    </footer>
  );
}
