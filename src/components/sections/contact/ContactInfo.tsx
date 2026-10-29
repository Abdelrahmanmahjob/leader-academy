"use client";

import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { contactInfo } from "@/content/contactInfo";

type Item = {
  Icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  ltr?: boolean;
};

const rowClass =
  "group flex min-h-[4.5rem] items-center gap-4 rounded-2xl border border-foreground/10 bg-foreground/[.04] px-4 py-3 " +
  "transition-[translate,border-color,background-color] duration-300";

export function ContactInfo() {
  const t = useTranslations("contactPage");

  const items: Item[] = [
    {
      Icon: Phone,
      label: t("phoneLabel"),
      value: contactInfo.phone,
      href: contactInfo.phoneHref,
      ltr: true,
    },
    {
      Icon: Mail,
      label: t("emailLabel"),
      value: contactInfo.email,
      href: contactInfo.emailHref,
      ltr: true,
    },
    { Icon: MapPin, label: t("addressLabel"), value: t("address") },
  ];

  return (
    <ul className="mt-10 grid gap-3">
      {items.map(({ Icon, label, value, href, ltr }) => {
        const content = (
          <>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-inverse">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold uppercase tracking-[0.14em] text-muted rtl:tracking-normal rtl:normal-case">
                {label}
              </span>
              {/* <bdi dir="ltr"> keeps numbers and addresses in the right order inside Arabic text */}
              <span className="mt-0.5 block truncate text-base font-bold text-foreground">
                {ltr ? <bdi dir="ltr">{value}</bdi> : value}
              </span>
            </span>
            {href ? (
              <ArrowUpRight
                className="size-5 shrink-0 text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rtl:-scale-x-100"
                aria-hidden="true"
              />
            ) : null}
          </>
        );

        return (
          <li key={label} className="contact-info-item">
            {href ? (
              <a
                href={href}
                className={`${rowClass} hover:-translate-y-0.5 hover:border-accent/50 hover:bg-foreground/[.07]`}
              >
                {content}
              </a>
            ) : (
              <div className={rowClass}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
