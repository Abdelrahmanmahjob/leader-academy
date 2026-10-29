import { Fragment } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "./BrandLogo";
import { FooterReveal } from "../ui/FooterReveal";
import { NewsletterForm } from "../ui/NewsLetterForm";
import { SocialIcon } from "../ui/SocialIcons";
import { subscribeToNewsletter } from "@/app/api/contact/actions";
import { CONTACT, LEGAL_LINKS, PAYMENTS, SOCIALS } from "@/content/footerData";

const heading = "text-xl font-bold text-foreground";
const navLink =
  "inline-flex min-h-10 items-center text-base text-muted transition-[color,transform] duration-200 hover:translate-x-1 hover:text-foreground rtl:hover:-translate-x-1 motion-reduce:transition-none motion-reduce:hover:translate-x-0";

export async function Footer() {
  const [t, nav] = await Promise.all([
    getTranslations("footer"),
    getTranslations("navigation"),
  ]);

  const exploreLinks = [
    { href: "/about-us", label: nav("aboutUs") },
    { href: "/services", label: nav("services") },
    { href: "/classes", label: nav("classes") },
    { href: "/trainers", label: t("meetTheTeam") },
    ...LEGAL_LINKS.map((l) => ({ href: l.href, label: t(l.labelKey) })),
  ];

  const consent = t.rich("consent", {
    privacy: (chunks) => (
      <Link
        href="/privacy-policy"
        className="text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
      >
        {chunks}
      </Link>
    ),
  });

  return (
    <footer className="relative isolate z-20 overflow-hidden border-t border-border bg-surface-raised">
      {/* Specular edge + faint accent light: the footer's only "glass" lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/25 to-transparent"
      />
      <AmbientGlow side="start" />

      <Container>
        <FooterReveal>
          <div className="grid gap-x-10 gap-y-12 py-12 md:grid-cols-2 lg:grid-cols-[1.1fr_.9fr_1.1fr_1.8fr] lg:py-16 xl:gap-x-14">
            {/* Brand */}
            <div data-reveal="" className="flex flex-col">
              <BrandLogo />
              <p className="mt-6 max-w-xs text-base leading-8 text-muted">
                {t("brandDescription")}
              </p>
              <ul
                aria-label={t("followUs")}
                className="mt-10 flex gap-3 lg:mt-auto lg:pt-10"
              >
                {SOCIALS.map(({ id, href }) => (
                  <li key={id}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`social.${id}`)}
                      className="glass-button flex size-11 items-center justify-center rounded-full border text-foreground transition-[transform,color] duration-300 [--glass-tint-mix:75%] [--glass-tint:var(--la-border-strong)] hover:-translate-y-0.5 hover:text-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      <SocialIcon id={id} className="size-[1.125rem]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore */}
            <nav data-reveal="" aria-labelledby="footer-explore">
              <h2 id="footer-explore" className={heading}>
                {t("explore")}
              </h2>
              <ul className="mt-6 space-y-1">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={navLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <div data-reveal="">
              <h2 className={heading}>{t("contactInfo")}</h2>
              <address className="mt-6 space-y-5 not-italic">
                <p className="text-base leading-8 text-muted">{t("address")}</p>
                <p className="text-base text-muted">{t("needHelp")}</p>
                <div className="space-y-2">
                  {/* Email and phone stay left-to-right inside Arabic text */}
                  <a
                    dir="ltr"
                    href={`mailto:${CONTACT.email}`}
                    className="block w-fit text-base font-bold text-foreground transition-colors hover:text-accent"
                  >
                    {CONTACT.email}
                  </a>
                  <a
                    dir="ltr"
                    href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                    className="block w-fit text-base font-bold text-foreground transition-colors hover:text-accent"
                  >
                    {CONTACT.phone}
                  </a>
                </div>
              </address>
            </div>

            {/* Newsletter */}
            <section
              data-reveal=""
              aria-labelledby="footer-newsletter"
              className="md:col-span-2 lg:col-span-1"
            >
              <h2 id="footer-newsletter" className={heading}>
                {t("newsletterTitle")}
              </h2>
              <p className="mb-6 mt-6 text-base leading-8 text-muted">
                {t("newsletterDescription")}
              </p>
              <NewsletterForm
                action={subscribeToNewsletter}
                consent={consent}
                labels={{
                  email: t("emailLabel"),
                  placeholder: t("emailPlaceholder"),
                  submit: t("subscribe"),
                  submitting: t("subscribing"),
                  success: t("subscribeSuccess"),
                  invalidEmail: t("errorInvalidEmail"),
                  consentRequired: t("errorConsent"),
                  failed: t("errorFailed"),
                }}
              />
            </section>
          </div>

          {/* Bottom bar */}
          <div
            data-reveal=""
            className="flex flex-col gap-6 border-t border-border py-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="space-y-1">
              <p className="text-sm text-muted">{t("copyright")}</p>
              <nav aria-label={t("legal")}>
                <ul className="flex flex-wrap items-center gap-x-3 text-sm">
                  {LEGAL_LINKS.map((link, i) => (
                    <Fragment key={link.href}>
                      {i > 0 ? (
                        <li aria-hidden="true" className="text-muted">
                          ·
                        </li>
                      ) : null}
                      <li>
                        <Link
                          href={link.href}
                          className="inline-flex min-h-11 items-center text-foreground transition-colors hover:text-accent"
                        >
                          {t(link.labelKey)}
                        </Link>
                      </li>
                    </Fragment>
                  ))}
                </ul>
              </nav>
            </div>

            <ul
              aria-label={t("paymentMethods")}
              className="flex flex-wrap gap-3"
            >
              {PAYMENTS.map((payment) => (
                <li
                  key={payment.name}
                  className="relative h-11 w-[4.5rem] overflow-hidden rounded-md bg-foreground"
                >
                  <Image
                    src={payment.src}
                    alt={payment.name}
                    fill
                    sizes="72px"
                    className="object-contain p-2"
                  />
                </li>
              ))}
            </ul>
          </div>
        </FooterReveal>
      </Container>
    </footer>
  );
}
