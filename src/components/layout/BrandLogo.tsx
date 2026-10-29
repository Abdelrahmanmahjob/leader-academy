import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type BrandLogoProps = {
  compact?: boolean;
  /** Hide the name between lg and xl, where the navbar is tightest. */
  hideNameAtLg?: boolean;
};

export function BrandLogo({
  compact = false,
  hideNameAtLg = false,
}: BrandLogoProps) {
  const t = useTranslations("navigation");

  return (
    <Link
      href="/"
      className="inline-flex min-h-11 shrink-0 items-center gap-3 overflow-hidden rounded-full"
      aria-label={t("homeLabel")}
    >
      <Image
        src="/brand/logo.webp"
        alt=""
        width={compact ? 48 : 56}
        height={compact ? 48 : 56}
        className="h-12 w-12 rounded-full object-contain sm:h-14 sm:w-14"
        priority
      />
      {!compact ? (
        <span
          className={`hidden text-sm font-extrabold uppercase tracking-[0.08em] sm:inline rtl:tracking-normal rtl:normal-case ${
            hideNameAtLg ? "lg:hidden xl:inline" : ""
          }`}
        >
          Leader Academy
        </span>
      ) : null}
    </Link>
  );
}
