"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { BrandLogo } from "./BrandLogo";
import { ClassesDropdown } from "./ClassesDropdown";
import { DockItemContent } from "./DockItem";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNavigation } from "./MobileNavigation";
import {
  authLinks,
  ctaClass,
  dockItemClass,
  isActivePath,
  loginClass,
  primaryLinks,
  trailingLinks,
} from "@/content/navigation";
import { useGlassSheen } from "@/hooks/useGlassSheen";

type NavLinkItem =
  | (typeof primaryLinks)[number]
  | (typeof trailingLinks)[number];

function DesktopNavLink({ href, labelKey, icon }: NavLinkItem) {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const selected = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      className={dockItemClass(selected)}
      data-selected={selected}
      aria-current={selected ? "page" : undefined}
    >
      <DockItemContent Icon={icon} label={t(labelKey)} selected={selected} />
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
            <div className="flex items-center gap-5 xl:gap-8">
              <BrandLogo hideNameAtLg />
              <span
                aria-hidden="true"
                className="hidden h-8 w-px bg-foreground/20 lg:block"
              />
            </div>
            {/* Dock: icons only, the active (or hovered) item opens into a labelled pill */}
            <nav
              aria-label={t("mainNavigation")}
              className="hidden items-center gap-1.5 lg:flex"
            >
              {primaryLinks.map((link) => (
                <DesktopNavLink key={link.href} {...link} />
              ))}
              <ClassesDropdown />
              {trailingLinks.map((link) => (
                <DesktopNavLink key={link.href} {...link} />
              ))}
            </nav>

            <div className="hidden items-center gap-2.5 lg:flex">
              <LanguageSwitcher />
              <Link href={authLinks.signin} className={loginClass}>
                {t("login")}
              </Link>
              <Link href={authLinks.signUp} className={ctaClass}>
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
