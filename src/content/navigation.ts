/**
 * Single source of truth for navigation data and shared styling helpers.
 * Used by Navbar, ClassesDropdown and MobileNavigation.
 */

export const primaryLinks = [
  { href: "/", labelKey: "home" },
  { href: "/about-us", labelKey: "aboutUs" },
  { href: "/services", labelKey: "services" },
] as const;

export const classesLinks = [
  { href: "/classes", labelKey: "classes" },
  { href: "/timetable", labelKey: "timetable" },
  { href: "/trainers", labelKey: "trainers" },
] as const;

export const contactLink = { href: "/contact", labelKey: "contact" } as const;

/** Flat list used by the mobile overlay (same order as the desktop bar). */
export const mobileLinks = [
  ...primaryLinks,
  ...classesLinks,
  contactLink,
] as const;

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop nav item: shared by links and the dropdown trigger. */
export function navItemClass(selected: boolean): string {
  const base =
    "inline-flex min-h-11 items-center gap-1 text-[15px] font-medium transition-colors duration-200";
  return selected
    ? `${base} text-accent`
    : `${base} text-foreground hover:text-foreground/65`;
}

/** Primary call-to-action pill (white capsule), shared by desktop bar and mobile overlay. */
export const ctaClass =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-6 text-[15px] font-semibold text-inverse " +
  "transition-[background-color,box-shadow,transform] duration-200 hover:bg-muted " +
  "hover:shadow-[0_0_0_4px_color-mix(in_srgb,var(--la-accent)_22%,transparent)] active:scale-[0.97]";
