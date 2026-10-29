import type { Metadata } from "next";
import { AuthPage } from "@/components/sections/auth/AuthPage";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Leader Academy account.",
};

export default function SignInPage() {
  return <AuthPage mode="signIn" />;
}
