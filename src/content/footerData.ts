// Static footer data. Translatable text lives in messages (footer.*).

// Taken from the reference screenshot: replace with Leader Academy's real details if they differ.
export const CONTACT = {
  email: "info@anansky.net",
  phone: "+966 57 360 9846",
} as const;

// TODO: replace with the real profile URLs.
export const SOCIALS = [
  { id: "facebook", href: "https://www.facebook.com/" },
  { id: "instagram", href: "https://www.instagram.com/" },
  { id: "youtube", href: "https://www.youtube.com/" },
  { id: "tiktok", href: "https://www.tiktok.com/" },
] as const;

export type SocialId = (typeof SOCIALS)[number]["id"];

// Rendered in the Explore column AND the bottom bar (as in the reference), defined once.
// Adjust the routes to match your app.
export const LEGAL_LINKS = [
  { href: "/terms-and-conditions", labelKey: "terms" },
  { href: "/privacy-policy", labelKey: "privacy" },
] as const;

// Put the logo files in /public/images/payments/ (white-background tiles are drawn by the footer).
export const PAYMENTS = [
  { name: "Visa", src: "/images/footer/visa.svg" },
  { name: "Mastercard", src: "/images/footer/mastercard.svg" },
  { name: "Apple Pay", src: "/images/footer/apple-pay.webp" },
  { name: "mada", src: "/images/footer/mada2.png" },
  { name: "American Express", src: "/images/footer/amex2.jpg" },
] as const;
