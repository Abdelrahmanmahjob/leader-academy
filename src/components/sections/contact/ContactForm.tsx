"use client";

import { useRef, useState, type FormEvent } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
// Adjust this path to wherever you placed useGlassSheen.ts
import { useGlassSheen } from "@/hooks/useGlassSheen";
import { gsap, useGSAP } from "./GsapSetup";
import {
  submitContactForm,
  type ContactFormData,
} from "@/lib/contact";
import { FormField, inputClass } from "./FormField";

type Status = "idle" | "submitting" | "success" | "error";
type FieldName = "name" | "phone" | "email" | "message";
type Errors = Partial<Record<FieldName, string>>;

type ContactFormProps = {
  /** Override how the form is sent. Defaults to POST /api/contact. */
  onSubmit?: (data: ContactFormData) => Promise<void>;
};

// Arabic-Indic and Persian digits -> ASCII, so phone numbers typed on an Arabic keyboard validate and send correctly.
function normalizeDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

const read = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

function SuccessPanel({ onReset }: { onReset: () => void }) {
  const t = useTranslations("contactPage");
  const ref = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      headingRef.current?.focus({ preventScroll: true });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const path = ref.current?.querySelector<SVGPathElement>("path");
        if (!path) return;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

        gsap.fromTo(
          "[data-badge]",
          { scale: 0.6, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.7)" },
        );
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.6,
          delay: 0.25,
          ease: "power2.out",
        });
        gsap.fromTo(
          "[data-text] > *",
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            delay: 0.3,
            stagger: 0.08,
            ease: "power3.out",
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      role="status"
      className="flex min-h-[26rem] flex-col items-center justify-center text-center"
    >
      <span
        data-badge
        className="flex size-20 items-center justify-center rounded-full bg-accent text-inverse"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <div data-text className="mt-6 max-w-sm">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-extrabold text-foreground outline-none"
        >
          {t("successTitle")}
        </h2>
        <p className="mt-3 leading-7 text-foreground/70">
          {t("successDescription")}
        </p>
        <Button
          type="button"
          variant="glass"
          size="lg"
          className="mt-6 min-h-12 rounded-full px-7"
          onClick={onReset}
        >
          <Check className="size-4" aria-hidden="true" />
          {t("sendAnother")}
        </Button>
      </div>
    </div>
  );
}

export function ContactForm({
  onSubmit = submitContactForm,
}: ContactFormProps) {
  const t = useTranslations("contactPage");
  const panelRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  useGlassSheen(panelRef);

  function validate(data: ContactFormData): Errors {
    const found: Errors = {};
    if (!data.name) found.name = t("errors.required");
    if (!data.phone) found.phone = t("errors.required");
    else if (
      !/^\+?[\d\s()-]{7,20}$/.test(data.phone) ||
      data.phone.replace(/\D/g, "").length < 7
    )
      found.phone = t("errors.phone");
    if (!data.email) found.email = t("errors.required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      found.email = t("errors.email");
    if (!data.message) found.message = t("errors.required");
    return found;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data: ContactFormData = {
      name: read(formData, "name"),
      phone: normalizeDigits(read(formData, "phone")),
      email: read(formData, "email"),
      message: read(formData, "message"),
      website: read(formData, "website"),
    };

    const found = validate(data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // Honeypot filled: it is a bot. Pretend it worked, send nothing.
    if (data.website) {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    try {
      await onSubmit(data);
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const submitting = status === "submitting";

  return (
    <div
      ref={panelRef}
      className="contact-panel glass-panel rounded-[28px] p-6 transition-[border-color] duration-300 focus-within:border-accent/40 md:p-8"
    >
      {status === "success" ? (
        <SuccessPanel
          onReset={() => {
            setErrors({});
            setStatus("idle");
          }}
        />
      ) : (
        <form
          noValidate
          aria-label={t("formLabel")}
          aria-busy={submitting}
          onSubmit={handleSubmit}
          onInput={(event) => {
            const field = (event.target as HTMLInputElement).name as FieldName;
            if (errors[field])
              setErrors((current) => ({ ...current, [field]: undefined }));
          }}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <FormField name="name" label={t("name")} error={errors.name}>
              {(props) => (
                <input
                  {...props}
                  type="text"
                  autoComplete="name"
                  className={inputClass}
                />
              )}
            </FormField>
            <FormField name="phone" label={t("phone")} error={errors.phone}>
              {(props) => (
                <input
                  {...props}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="auto"
                  className={inputClass}
                />
              )}
            </FormField>
          </div>

          <FormField
            name="email"
            label={t("email")}
            error={errors.email}
            className="mt-5"
          >
            {(props) => (
              <input
                {...props}
                type="email"
                autoComplete="email"
                dir="auto"
                className={inputClass}
              />
            )}
          </FormField>

          <FormField
            name="message"
            label={t("message")}
            error={errors.message}
            className="mt-5"
          >
            {(props) => (
              <textarea
                {...props}
                rows={5}
                className={`${inputClass} resize-y py-3`}
              />
            )}
          </FormField>

          {/* Honeypot */}
          <div
            aria-hidden="true"
            className="absolute -start-[9999px] h-0 w-0 overflow-hidden"
          >
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {status === "error" ? (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground"
            >
              {t("errorMessage")}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="glass-accent"
            size="lg"
            disabled={submitting}
            className="contact-field mt-6 min-h-12 w-full rounded-full px-7 md:w-auto"
          >
            {submitting ? (
              <Loader2
                className="size-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : (
              <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            )}
            {submitting ? t("sending") : t("send")}
          </Button>
        </form>
      )}
    </div>
  );
}
