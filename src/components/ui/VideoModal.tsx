"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { gsap, useGSAP } from "../sections/about/shared/Motion";

interface VideoModalProps {
  src: string;
  poster: string;
  label: string;
  closeLabel: string;
  /** Must be referentially stable (useCallback). */
  onClose: () => void;
}

const FOCUSABLE =
  'button, [href], video[controls], [tabindex]:not([tabindex="-1"])';

export function VideoModal({
  src,
  poster,
  label,
  closeLabel,
  onClose,
}: VideoModalProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const reduced = useRef(false);

  useGSAP(
    () => {
      reduced.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced.current) return;
      timeline.current = gsap
        .timeline({
          defaults: { duration: 0.45, ease: "power3.out" },
          onReverseComplete: onClose,
        })
        .from(rootRef.current, { autoAlpha: 0 })
        .from(frameRef.current, { autoAlpha: 0, y: 24, scale: 0.94 }, 0.05);
      return () => {
        timeline.current = null;
      };
    },
    { scope: rootRef },
  );

  const requestClose = useCallback(() => {
    videoRef.current?.pause();
    if (timeline.current) timeline.current.reverse();
    else onClose();
  }, [onClose]);

  useEffect(() => {
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== "Tab" || !rootRef.current) return;
      const nodes = rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [requestClose]);

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      className="glass-overlay fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={requestClose}
        aria-label={closeLabel}
        className="glass-button absolute end-4 top-4 flex size-12 items-center justify-center rounded-full border text-foreground sm:end-6 sm:top-6"
      >
        <X className="size-5" aria-hidden="true" />
      </button>
      <div
        ref={frameRef}
        className="glass-panel w-full max-w-5xl rounded-[28px] p-2 sm:p-3"
      >
        <video
          ref={videoRef}
          className="aspect-video max-h-[80vh] w-full rounded-[20px] bg-black"
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          preload="metadata"
        />
      </div>
    </div>,
    document.body,
  );
}
