"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { ChevronRight, Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ctaClass, isActivePath, mobileLinks } from "@/content/navigation";
import { useDirection } from "@/hooks/useDirection";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNavigation() {
  // `open` is the user's intent; `present` keeps the overlay mounted while the exit animation runs.
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const overlayId = useId();
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const { flip } = useDirection();

  const openMenu = () => {
    setPresent(true);
    setOpen(true);
  };

  const closeMenu = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  // Build the open/close timeline each time the overlay mounts.
  useGSAP(
    () => {
      const overlay = overlayRef.current;
      if (!present || !overlay) return;

      const sheet = overlay.querySelector("[data-sheet]");
      const items = overlay.querySelectorAll("[data-item]");
      const footer = overlay.querySelector("[data-footer]");
      const focusFirst = () => {
        if (!tlRef.current?.reversed()) {
          overlay
            .querySelector<HTMLElement>("[data-item] a")
            ?.focus({ preventScroll: true });
        }
      };

      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const reduce = Boolean(ctx.conditions?.reduce);
          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.out" },
            onReverseComplete: () => setPresent(false),
          });

          if (reduce) {
            tl.fromTo(
              overlay,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.01 },
            ).call(focusFirst, undefined, 0.03);
          } else {
            tl.fromTo(
              overlay,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.3, ease: "power2.out" },
            )
              .fromTo(
                sheet,
                { autoAlpha: 0, x: -flip * 28, scale: 0.97 },
                { autoAlpha: 1, x: 0, scale: 1, duration: 0.45 },
                0.04,
              )
              .fromTo(
                items,
                { autoAlpha: 0, x: -flip * 18 },
                { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.04 },
                0.12,
              )
              .fromTo(
                footer,
                { autoAlpha: 0, y: 14 },
                { autoAlpha: 1, y: 0, duration: 0.35 },
                0.3,
              )
              .call(focusFirst, undefined, 0.16);
          }

          tlRef.current = tl;
          return () => {
            tlRef.current = null;
          };
        },
      );
    },
    { scope: overlayRef, dependencies: [present, flip] },
  );

  // Play on open, reverse (faster) on close, unmount if no timeline exists.
  useEffect(() => {
    if (!present) return;
    const tl = tlRef.current;
    if (open) tl?.timeScale(1).play();
    else if (tl) tl.timeScale(1.6).reverse();
    else setPresent(false);
  }, [open, present]);

  // Scroll lock + Escape while the overlay is mounted.
  useEffect(() => {
    if (!present) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [present, closeMenu]);

  // The overlay is portaled, so hiding the trigger with `lg:hidden` is not enough: close it when the desktop layout takes over.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 64rem)");
    function onChange(event: MediaQueryListEvent) {
      if (!event.matches) return;
      tlRef.current?.kill();
      setOpen(false);
      setPresent(false);
    }
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  function trapTab(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !overlayRef.current) return;
    const focusable = Array.from(
      overlayRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = document.activeElement;

    if (
      event.shiftKey &&
      (current === first || !overlayRef.current.contains(current))
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      (current === last || !overlayRef.current.contains(current))
    ) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        className="glass-panel inline-flex size-11 items-center justify-center rounded-full text-foreground transition-transform duration-200 active:scale-95"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={present ? overlayId : undefined}
        aria-label={t("openMenu")}
        onClick={openMenu}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {present
        ? createPortal(
            <div
              ref={overlayRef}
              id={overlayId}
              role="dialog"
              aria-modal="true"
              aria-label={t("menu")}
              onKeyDown={trapTab}
              className="glass-overlay fixed inset-0 z-[70] flex flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:hidden"
            >
              <div className="flex h-12 items-center justify-end">
                <button
                  type="button"
                  className="glass-panel inline-flex size-11 items-center justify-center rounded-full text-foreground transition-transform duration-200 active:scale-95"
                  aria-label={t("closeMenu")}
                  onClick={() => closeMenu()}
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              {/* Blur is already provided by the overlay behind, so the sheet skips its own backdrop-filter. */}
              <div
                data-sheet
                className="glass-panel mt-4 min-h-0 flex-1 overflow-hidden rounded-3xl [-webkit-backdrop-filter:none] [backdrop-filter:none]"
              >
                <nav
                  aria-label={t("mainNavigation")}
                  className="h-full overflow-y-auto overscroll-contain p-2"
                >
                  <ul className="flex flex-col">
                    {mobileLinks.map((link) => {
                      const selected = isActivePath(pathname, link.href);
                      return (
                        <li
                          key={link.href}
                          data-item
                          className="border-b border-foreground/10 last:border-b-0"
                        >
                          <Link
                            href={link.href}
                            className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl px-4 text-lg font-bold transition-colors duration-200 active:bg-foreground/10 ${
                              selected ? "text-accent" : "text-foreground"
                            }`}
                            aria-current={selected ? "page" : undefined}
                            onClick={() => closeMenu(false)}
                          >
                            {t(link.labelKey)}
                            <ChevronRight
                              className={`size-5 rtl:rotate-180 ${selected ? "text-accent" : "text-muted"}`}
                              aria-hidden="true"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              <div
                data-footer
                className="glass-panel mt-3 flex flex-wrap items-center justify-between gap-3 rounded-3xl p-3 [-webkit-backdrop-filter:none] [backdrop-filter:none]"
              >
                <LanguageSwitcher />
                <Link
                  href="/contact"
                  className={ctaClass}
                  onClick={() => closeMenu(false)}
                >
                  {t("getStarted")}
                </Link>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
