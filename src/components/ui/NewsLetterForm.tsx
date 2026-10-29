"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewsletterResult } from "@/app/api/contact/actions";
import { Button } from "./Button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface NewsletterFormProps {
  action: (email: string) => Promise<NewsletterResult>;
  /** Pre-rendered on the server (contains the Privacy Policy link). */
  consent: ReactNode;
  labels: {
    email: string;
    placeholder: string;
    submit: string;
    submitting: string;
    success: string;
    invalidEmail: string;
    consentRequired: string;
    failed: string;
  };
}

type Feedback = {
  kind: "success" | "error";
  message: string;
  field?: "email" | "consent";
};

export function NewsletterForm({
  action,
  consent,
  labels,
}: NewsletterFormProps) {
  const emailId = useId();
  const feedbackId = useId();
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();

    if (!EMAIL_RE.test(email)) {
      setFeedback({
        kind: "error",
        field: "email",
        message: labels.invalidEmail,
      });
      form.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
      return;
    }
    if (data.get("consent") !== "on") {
      setFeedback({
        kind: "error",
        field: "consent",
        message: labels.consentRequired,
      });
      form.querySelector<HTMLInputElement>('input[name="consent"]')?.focus();
      return;
    }

    setPending(true);
    setFeedback(null);
    try {
      const result = await action(email);
      if (result.ok) {
        form.reset();
        setFeedback({ kind: "success", message: labels.success });
      } else {
        setFeedback({ kind: "error", message: labels.failed });
      }
    } catch {
      setFeedback({ kind: "error", message: labels.failed });
    } finally {
      setPending(false);
    }
  }

  const emailInvalid = feedback?.kind === "error" && feedback.field === "email";
  const consentInvalid =
    feedback?.kind === "error" && feedback.field === "consent";

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      onChange={() => feedback?.kind === "error" && setFeedback(null)}
      className="@container"
    >
      <div className="flex flex-col gap-3 @sm:flex-row">
        <label htmlFor={emailId} className="sr-only">
          {labels.email}
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          disabled={pending}
          placeholder={labels.placeholder}
          aria-invalid={emailInvalid}
          aria-describedby={feedbackId}
          className="min-h-14 min-w-0 flex-1 rounded-md bg-foreground px-5 text-base text-inverse placeholder:text-inverse/60 disabled:opacity-60 aria-invalid:ring-2 aria-invalid:ring-[color-mix(in_srgb,var(--destructive),white_30%)] @sm:min-h-[3.875rem]"
        />
        <Button
          variant="glass"
          size="lg"
          type="submit"
          disabled={pending}
          className="min-h-14 @sm:min-h-[3.875rem] text-xl font-semibold"
        >
          {pending ? (
            <Loader2
              className="size-4 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : null}
          {pending ? labels.submitting : labels.submit}
        </Button>
      </div>

      <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-6 text-muted">
        <span className="relative mt-0.5 size-5 shrink-0">
          <input
            type="checkbox"
            name="consent"
            disabled={pending}
            aria-invalid={consentInvalid}
            aria-describedby={feedbackId}
            className="peer size-5 cursor-pointer appearance-none rounded border border-border-strong bg-surface checked:border-accent checked:bg-accent aria-invalid:border-[color-mix(in_srgb,var(--destructive),white_30%)]"
          />
          <Check
            className="pointer-events-none absolute inset-0 m-auto size-3.5 text-inverse opacity-0 peer-checked:opacity-100"
            strokeWidth={3}
            aria-hidden="true"
          />
        </span>
        <span>{consent}</span>
      </label>

      <div id={feedbackId} aria-live="polite">
        {feedback ? (
          <p
            className={cn(
              "mt-2 text-sm",
              feedback.kind === "success"
                ? "text-accent"
                : "text-[color-mix(in_srgb,var(--destructive),white_30%)]",
            )}
          >
            {feedback.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
