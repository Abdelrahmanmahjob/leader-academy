"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { AboutSection } from "./AboutSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "./SectionHeading";
import { trackGlassPointer } from "./shared/Glass";
import { NO_MOTION, gsap, useGSAP } from "./shared/Motion";
import { VideoModal } from "@/components/ui/VideoModal";

const VIDEO_SRC = "/videos/about-video.mp4";
const POSTER_SRC = "/images/about-page/video-sum.jpg";

export function AboutVideo() {
  const t = useTranslations("home.about");
  const [open, setOpen] = useState(false);
  const closeVideo = useCallback(() => setOpen(false), []);
  const pulseRef = useRef<HTMLSpanElement>(null);

  // One quiet pulse on the play button: transform/opacity only, off under reduced motion.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_MOTION, () => {
        gsap.fromTo(
          pulseRef.current,
          { scale: 1, autoAlpha: 0.55 },
          {
            scale: 1.7,
            autoAlpha: 0,
            duration: 1.8,
            ease: "power2.out",
            repeat: -1,
            repeatDelay: 0.5,
          },
        );
      });
      return () => mm.revert();
    },
    { scope: pulseRef },
  );

  return (
    <AboutSection aria-labelledby="about-video-title" glow={false}>
      <div
        data-reveal=""
        className="relative min-h-[420px] overflow-hidden rounded-[32px] border border-border sm:min-h-[520px] lg:min-h-[620px]"
      >
        <div data-parallax="" className="absolute inset-x-0 -inset-y-[12%]">
          <Image
            src={POSTER_SRC}
            alt={t("videoImageAlt")}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/10 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start justify-between gap-5 p-3 sm:flex-row sm:items-end sm:p-5 lg:p-8">
          <GlassCard className="max-w-xl rounded-[24px] p-6 sm:p-8">
            <SectionHeading
              id="about-video-title"
              title={t("videoTitle")}
              description={t("videoDescription")}
              reveal={false}
            />
          </GlassCard>

          <button
            type="button"
            onClick={() => setOpen(true)}
            onPointerMove={trackGlassPointer}
            aria-label={t("playVideo")}
            aria-haspopup="dialog"
            className="glass-button relative mx-3 mb-3 flex size-[72px] shrink-0 items-center justify-center rounded-full border text-inverse transition-transform duration-300 [--glass-tint-mix:88%] [--glass-tint:var(--la-accent)] hover:scale-105 active:scale-95 sm:m-0 sm:size-20 motion-reduce:transition-none"
          >
            <span
              ref={pulseRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-full border border-accent/60"
            />
            {/* Playback arrows are not mirrored in RTL, so a physical nudge is intentional. */}
            <Play
              className="size-7 translate-x-0.5 fill-current"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {open ? (
        <VideoModal
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          label={t("videoDialog")}
          closeLabel={t("closeVideo")}
          onClose={closeVideo}
        />
      ) : null}
    </AboutSection>
  );
}
