"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { resetPasswordSchema } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/env";

type Values = z.infer<typeof resetPasswordSchema>;
export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string>();
  const form = useForm<Values>({ resolver: zodResolver(resetPasswordSchema), defaultValues: { email: "" } });
  async function submit(values: Values) {
    if (!hasSupabaseConfig()) { setMessage("Demo mode has no password or email account to reset. Return to sign in and choose “Continue with demo account”."); return; }
    try {
      const { error } = await createClient().auth.resetPasswordForEmail(values.email, { redirectTo: `${window.location.origin}/auth/callback?next=/update-password` });
      if (error) throw error;
      setMessage("If that address has an account, a reset link is on its way.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to send the reset link."); }
  }
  return <AuthShell title="Reset your password" copy="Enter your email and we’ll send a secure reset link."><form onSubmit={form.handleSubmit(submit)} className="mt-7 space-y-4"><label className="block text-sm font-extrabold">Email address<input type="email" {...form.register("email")} className="mt-2 h-12 w-full rounded-xl border bg-[var(--surface)] px-4" /></label>{form.formState.errors.email && <p role="alert" className="text-sm font-bold text-red-600">{form.formState.errors.email.message}</p>}<button className="h-12 w-full rounded-xl bg-[var(--violet)] font-black text-white">Send reset link</button>{message && <p role="status" className="soft-card p-3 text-sm font-bold">{message}</p>}</form></AuthShell>;
}
