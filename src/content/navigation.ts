import {
  CalendarDays,
  Dumbbell,
  Home,
  Info,
  LayoutGrid,
  Mail,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Single source of truth for navigation data and shared styling helpers.
 * Used by Navbar, ClassesDropdown and MobileNavigation.
 */

export type NavLinkData = {
  href: string;
  labelKey: string;
  icon: LucideIcon;
};

export const primaryLinks = [
  { href: "/", labelKey: "home", icon: Home },
  { href: "/about-us", labelKey: "aboutUs", icon: Info },
  { href: "/services", labelKey: "services", icon: LayoutGrid },
] as const;

/** Items inside the Classes dropdown. Trainers is now a top-level link. */
export const classesLinks = [
  { href: "/classes", labelKey: "classes", icon: Dumbbell },
  { href: "/timetable", labelKey: "timetable", icon: CalendarDays },
] as const;

/** The dropdown trigger itself. */
export const classesMenu = { labelKey: "classes", icon: Dumbbell } as const;

export const trainersLink = {
  href: "/trainers",
  labelKey: "trainers",
  icon: Users,
} as const;
export const contactLink = {
  href: "/contact",
  labelKey: "contact",
  icon: Mail,
} as const;

/** Links shown after the Classes dropdown on desktop. */
export const trailingLinks = [trainersLink, contactLink] as const;

/** Flat list used by the mobile overlay (same order as the desktop bar). */
export const mobileLinks = [
  ...primaryLinks,
  ...classesLinks,
  trainersLink,
  contactLink,
] as const;

/** Adjust these two paths to your real auth routes. */
export const authLinks = { login: "/login", signUp: "/sign-up" } as const;

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Desktop dock item (icon button that expands into a labelled pill).
 * Pair with <DockItemContent />, and set data-selected / data-open on the element.
 */
export function dockItemClass(selected: boolean): string {
  const base =
    "group/dock relative inline-flex h-11 shrink-0 items-center rounded-full px-3 text-[15px] font-semibold " +
    "transition-[background-color,color,box-shadow] duration-300";

  return selected
    ? `${base} bg-accent text-inverse shadow-[0_10px_26px_-10px_color-mix(in_srgb,var(--la-accent)_85%,transparent)]`
    : `${base} text-foreground/65 hover:bg-foreground/10 hover:text-foreground focus-visible:bg-foreground/10 focus-visible:text-foreground`;
}

/** Primary call-to-action pill (white capsule), shared by desktop bar and mobile overlay. */
export const ctaClass =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-6 text-[15px] font-semibold text-inverse " +
  "transition-[background-color,box-shadow,transform] duration-200 hover:bg-muted " +
  "hover:shadow-[0_0_0_4px_color-mix(in_srgb,var(--la-accent)_22%,transparent)] active:scale-[0.97]";

/** Secondary glass pill (Login). Surface comes from `.glass-button` in globals.css. */
export const loginClass =
  "glass-button inline-flex min-h-12 items-center justify-center rounded-full border bg-clip-border px-5 text-[15px] font-semibold text-foreground " +
  "transition-[border-color,box-shadow,transform] duration-200 active:scale-[0.97]";
