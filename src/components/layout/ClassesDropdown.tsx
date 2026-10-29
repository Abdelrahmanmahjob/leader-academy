"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  classesLinks,
  classesMenu,
  dockItemClass,
  isActivePath,
} from "@/content/navigation";
import { useDirection } from "@/hooks/useDirection";
import { useGlassSheen } from "@/hooks/useGlassSheen";
import { DockItemContent } from "./DockItem";

const CLOSE_DELAY_MS = 140;

export function ClassesDropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const lastPointerType = useRef("mouse");

  const menuId = useId();
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const { flip } = useDirection();

  const active = classesLinks.some((item) => isActivePath(pathname, item.href));

  useGlassSheen(glassRef);

  // Build one reusable open/close timeline. Direction-aware, reduced-motion aware.
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const items = panel.querySelectorAll("[data-menu-item]");

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
          });

          if (reduce) {
            tl.fromTo(
              panel,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.01 },
            );
          } else {
            tl.fromTo(
              panel,
              {
                autoAlpha: 0,
                y: -8,
                scale: 0.97,
                transformOrigin: flip === 1 ? "0% 0%" : "100% 0%",
              },
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.28 },
            ).fromTo(
              items,
              { autoAlpha: 0, x: -flip * 10 },
              { autoAlpha: 1, x: 0, duration: 0.24, stagger: 0.045 },
              0.06,
            );
          }

          tlRef.current = tl;
          return () => {
            tlRef.current = null;
          };
        },
      );
    },
    { scope: rootRef, dependencies: [flip] },
  );

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) tl.timeScale(1).play();
    else tl.timeScale(1.6).reverse();
  }, [open]);

  // Escape + outside press, only while open.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }

    function onPointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      )
        setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  function cancelClose() {
    window.clearTimeout(closeTimer.current);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = window.setTimeout(
      () => setOpen(false),
      CLOSE_DELAY_MS,
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        cancelClose();
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") scheduleClose();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={dockItemClass(active)}
        data-selected={active}
        data-open={open}
        aria-expanded={open}
        aria-controls={menuId}
        onPointerDown={(event) => {
          lastPointerType.current = event.pointerType;
        }}
        onClick={(event) => {
          // Hover already opened it for a real mouse click: keep it open instead of toggling shut.
          const mouseClick =
            lastPointerType.current === "mouse" && event.detail > 0;
          setOpen((value) => (mouseClick ? true : !value));
        }}
      >
        <DockItemContent
          Icon={classesMenu.icon}
          label={t(classesMenu.labelKey)}
          selected={active}
          trailing={
            <ChevronDown
              className={`ms-1.5 size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          }
        />
      </button>

      {/* Wrapper carries the hover "bridge" (pt-6, clears the capsule edge) so the pointer never crosses a dead gap. */}
      <div
        ref={panelRef}
        id={menuId}
        className="invisible absolute start-0 top-full z-10 w-60 max-w-[calc(100vw-2rem)] pt-6 opacity-0"
      >
        <div ref={glassRef} className="glass-panel rounded-2xl p-1.5">
          <ul className="flex flex-col gap-0.5">
            {classesLinks.map((item) => {
              const selected = isActivePath(pathname, item.href);
              const Icon = item.icon;
              return (
                <li key={item.href} data-menu-item>
                  <Link
                    href={item.href}
                    className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors duration-200 hover:bg-foreground/10 focus-visible:outline-offset-[-2px] ${
                      selected ? "text-accent" : "text-foreground"
                    }`}
                    aria-current={selected ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <Icon
                      className={`size-4 ${selected ? "text-accent" : "text-muted"}`}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{t(item.labelKey)}</span>
                    {selected ? (
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-accent"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
