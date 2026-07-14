import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Sign in" };
export default function SignInPage() {
  return <AuthShell title="Welcome back" copy="Pick up your revision exactly where you left it."><AuthForm mode="sign-in" /></AuthShell>;
}
