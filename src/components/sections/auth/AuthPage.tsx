"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Eye, EyeOff, Mail, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/sections/contact/FormField";

type AuthMode = "signIn" | "signUp";

export function AuthPage({ mode }: { mode: AuthMode }) {
  const t = useTranslations("authPage");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "notConnected">("idle");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const isSignUp = mode === "signUp";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (
      isSignUp &&
      formData.get("password") !== formData.get("confirmPassword")
    ) {
      setPasswordMismatch(true);
      form
        .querySelector<HTMLInputElement>('[name="confirmPassword"]')
        ?.focus();
      return;
    }

    setPasswordMismatch(false);
    setStatus("notConnected");
  }

  return (
    <main id="main-content" className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:pb-24">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-border bg-surface shadow-[0_32px_100px_-48px_color-mix(in_srgb,var(--la-inverse)_75%,transparent)] lg:min-h-[680px] lg:grid-cols-2">
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md">
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.22em] text-accent rtl:tracking-normal">
              {t(isSignUp ? "signUpEyebrow" : "signInEyebrow")}
            </p>
            <h1 className="text-3xl font-extrabold uppercase tracking-[-0.04em] sm:text-4xl rtl:tracking-normal">
              {t(isSignUp ? "signUpTitle" : "signInTitle")}
            </h1>
            <p className="mt-4 leading-7 text-foreground/65">
              {t(isSignUp ? "signUpDescription" : "signInDescription")}
            </p>

            <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
              {isSignUp ? (
                <label className="grid gap-2 text-sm font-bold">
                  {t("name")}
                  <span className="relative">
                    <UserRound
                      className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-foreground/40"
                      aria-hidden="true"
                    />
                    <input
                      name="name"
                      autoComplete="name"
                      required
                      className={`${inputClass} ps-11`}
                      placeholder={t("namePlaceholder")}
                    />
                  </span>
                </label>
              ) : null}

              <label className="grid gap-2 text-sm font-bold">
                {t("email")}
                <span className="relative">
                  <Mail
                    className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-foreground/40"
                    aria-hidden="true"
                  />
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`${inputClass} ps-11`}
                    placeholder={t("emailPlaceholder")}
                  />
                </span>
              </label>

              <label className="grid gap-2 text-sm font-bold">
                {t("password")}
                <span className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    required
                    minLength={8}
                    className={`${inputClass} pe-12`}
                    placeholder={t("passwordPlaceholder")}
                  />
                  <button
                    type="button"
                    aria-label={t(showPassword ? "hidePassword" : "showPassword")}
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute end-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-foreground/50 transition hover:bg-hover hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </span>
                <span className="text-xs font-normal text-foreground/50">
                  {t("passwordHint")}
                </span>
              </label>

              {isSignUp ? (
                <label className="grid gap-2 text-sm font-bold">
                  {t("confirmPassword")}
                  <input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className={inputClass}
                    placeholder={t("confirmPasswordPlaceholder")}
                    aria-invalid={passwordMismatch}
                    aria-describedby={
                      passwordMismatch ? "auth-password-mismatch" : undefined
                    }
                    onChange={() => setPasswordMismatch(false)}
                  />
                  {passwordMismatch ? (
                    <span
                      id="auth-password-mismatch"
                      className="text-sm font-normal text-destructive"
                    >
                      {t("passwordMismatch")}
                    </span>
                  ) : null}
                </label>
              ) : null}

              {status === "notConnected" ? (
                <p
                  role="status"
                  className="rounded-xl border border-accent/25 bg-accent/10 p-4 text-sm leading-6 text-foreground/80"
                >
                  {t("notConnected")}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                className="mt-1 min-h-12 w-full rounded-full bg-accent font-bold text-inverse hover:bg-accent/85"
              >
                {t(isSignUp ? "createAccount" : "signIn")}
                <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </Button>
            </form>

            {!isSignUp ? (
              <p className="mt-5 text-center text-sm text-foreground/55">
                {t("needHelp")}{" "}
                <Link
                  href="/contact"
                  className="font-bold text-accent underline-offset-4 hover:underline"
                >
                  {t("contactUs")}
                </Link>
              </p>
            ) : null}

            <p className="mt-8 border-t border-border pt-6 text-center text-sm text-foreground/60">
              {t(isSignUp ? "haveAccount" : "noAccount")}{" "}
              <Link
                href={isSignUp ? "/sign-in" : "/sign-up"}
                className="font-extrabold text-accent underline-offset-4 hover:underline"
              >
                {t(isSignUp ? "signIn" : "createAccount")}
              </Link>
            </p>
          </div>
        </section>

        <aside className="relative hidden min-h-[680px] overflow-hidden lg:block">
          <Image
            src="/images/home-page/hero/hero1.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 0px, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/5" />
          <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-accent rtl:tracking-normal">
              {t("brandEyebrow")}
            </p>
            <p className="mt-4 max-w-md text-3xl font-extrabold uppercase leading-tight text-white xl:text-4xl">
              {t("brandTitle")}
            </p>
            <p className="mt-4 max-w-md leading-7 text-white/70">
              {t("brandDescription")}
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
