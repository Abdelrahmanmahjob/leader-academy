"use server";

export type NewsletterResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "failed" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(
  email: string,
): Promise<NewsletterResult> {
  const value = email.trim().toLowerCase();
  if (value.length > 254 || !EMAIL_RE.test(value))
    return { ok: false, reason: "invalid" };

  // Fails on purpose until connected so signups are never silently dropped.
  return { ok: false, reason: "failed" };
}
