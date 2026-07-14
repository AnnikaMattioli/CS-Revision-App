import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Create an account" };
export default function SignUpPage() {
  return <AuthShell title="Start learning smarter" copy="Create your free account. You can choose your course next."><AuthForm mode="sign-up" /></AuthShell>;
}
