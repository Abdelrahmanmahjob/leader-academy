"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { BrandLogo } from "./BrandLogo";
import { ClassesDropdown } from "./ClassesDropdown";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNavigation } from "./MobileNavigation";
import {
  contactLink,
  ctaClass,
  isActivePath,
  navItemClass,
  primaryLinks,
} from "@/content/navigation";
import { useGlassSheen } from "@/hooks/useGlassSheen";

type NavLinkItem = (typeof primaryLinks)[number] | typeof contactLink;

function DesktopNavLink({ href, labelKey }: NavLinkItem) {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const selected = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      className={navItemClass(selected)}
      aria-current={selected ? "page" : undefined}
    >
      {t(labelKey)}
    </Link>
  );
}

export function Navbar() {
  const t = useTranslations("navigation");
  const capsuleRef = useRef<HTMLDivElement>(null);

  useGlassSheen(capsuleRef);

  return (
    <header className="fixed inset-x-0 top-0 z-[60] pt-3 sm:pt-4">
      <Container>
        <div ref={capsuleRef} className="glass-host relative">
          {/* Glass is a sibling layer: it never becomes a backdrop root or containing block for the dropdown. */}
          <span
            aria-hidden="true"
            className="glass-pill pointer-events-none absolute inset-0 rounded-full"
          />

          <div className="relative z-10 flex h-16 items-center justify-between gap-4 ps-5 pe-2.5 lg:h-[72px] lg:ps-7 lg:pe-3">
            <div className="flex items-center gap-6 xl:gap-8">
              <BrandLogo />
              <span
                aria-hidden="true"
                className="hidden h-8 w-px bg-foreground/20 lg:block"
              />

              <nav
                aria-label={t("mainNavigation")}
                className="hidden items-center gap-8 lg:flex"
              >
                {primaryLinks.map((link) => (
                  <DesktopNavLink key={link.href} {...link} />
                ))}
                <ClassesDropdown />
                <DesktopNavLink {...contactLink} />
              </nav>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <LanguageSwitcher />
              <Link href="/contact" className={ctaClass}>
                {t("getStarted")}
              </Link>
            </div>

            <MobileNavigation />
          </div>
        </div>
      </Container>
    </header>
  );
}
