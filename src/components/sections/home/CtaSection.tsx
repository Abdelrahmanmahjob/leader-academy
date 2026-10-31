"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/Button";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("home.cta");

  useGSAP(
    () => {
      gsap.fromTo(
        ".cta-content",
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        imageRef.current,
        { scale: 1.12 },
        {
          scale: 1,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            once: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="border-b border-border bg-background py-4 sm:py-6"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="relative isolate flex min-h-[430px] items-end overflow-hidden rounded-[32px] border border-border sm:min-h-[500px] lg:min-h-[560px]">
          <div ref={imageRef} className="absolute inset-0 -z-20">
            <Image
              src="/images/home-page/cta/cta.jpg"
              alt=""
              fill
              priority={false}
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover object-center"
            />
          </div>
          <div
            className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/75 to-background/10 rtl:bg-linear-to-t"
            aria-hidden="true"
          />
          <div className="w-full p-6 sm:p-10 lg:p-14">
            <div className="max-w-3xl">
              <p className="cta-content mb-4 text-xs font-extrabold uppercase tracking-[0.22em] text-accent rtl:tracking-normal rtl:normal-case">
                Leader Academy
              </p>
              <h2 className="cta-content text-[clamp(1.5rem,5vw,3rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.04em] text-foreground rtl:leading-[1.25] rtl:tracking-normal">
                {t("title")}
              </h2>
              <div className="cta-content mt-6 flex flex-wrap items-center gap-4">
                <p className="text-base font-semibold text-foreground/75 sm:text-lg">
                  {t("description")}
                </p>
                <Link
                  href="/contact"
                  className={buttonVariants({
                    variant: "glass-accent",
                    size: "lg",
                    className: "min-h-12 rounded-full! px-7!",
                  })}
                >
                  {t("button")}
                  <ArrowUpRight className="size-5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
