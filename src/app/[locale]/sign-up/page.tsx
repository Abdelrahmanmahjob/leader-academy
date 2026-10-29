import type { Metadata } from "next";
import { AuthPage } from "@/components/sections/auth/AuthPage";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create your Leader Academy account.",
};

export default function SignUpPage() {
  return <AuthPage mode="signUp" />;
}
