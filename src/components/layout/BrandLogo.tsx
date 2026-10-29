import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 shrink-0 rounded-full overflow-hidden items-center gap-3 rounded-sm"
      aria-label="Leader Academy home"
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
        <span className="hidden text-sm font-extrabold uppercase tracking-[0.08em] sm:inline">
          Leader Academy
        </span>
      ) : null}
    </Link>
  );
}
