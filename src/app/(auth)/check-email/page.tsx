import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { ButtonLink } from "@/components/ui/button";

export default function CheckEmailPage() {
  return <AuthShell title="Check your inbox" copy="We sent you a secure confirmation link."><div className="mt-7 text-center"><MailCheck className="mx-auto text-[var(--teal)]" size={52} /><p className="mt-5 leading-7 text-muted">Open the link in your email to confirm your account, then you&apos;ll choose your course.</p><ButtonLink href="/sign-in" variant="secondary" className="mt-6 w-full">Back to sign in</ButtonLink></div></AuthShell>;
}
