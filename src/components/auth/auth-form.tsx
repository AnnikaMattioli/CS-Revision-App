"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { signInSchema, signUpSchema, type SignUpValues } from "@/lib/validation/auth";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string>();
  const schema = isSignUp ? signUpSchema : signInSchema;
  const form = useForm<SignUpValues>({
    resolver: zodResolver(schema) as unknown as Resolver<SignUpValues>,
    defaultValues: { email: "", password: "", displayName: "" },
  });

  async function onSubmit(values: SignUpValues) {
    setFormError(undefined);
    try {
      const supabase = createClient();
      if (isSignUp) {
        const signUpValues = values as SignUpValues;
        const { error } = await supabase.auth.signUp({
          email: signUpValues.email,
          password: signUpValues.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
            data: { display_name: signUpValues.displayName },
          },
        });
        if (error) throw error;
        router.push("/check-email");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  const inputClass = "mt-2 h-12 w-full rounded-xl border bg-[var(--surface)] px-4 text-base font-semibold placeholder:text-[var(--muted)]/70";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-5" noValidate>
      {isSignUp && (
        <label className="block text-sm font-extrabold">Your name
          <input autoComplete="name" className={inputClass} placeholder="Alex" {...form.register("displayName")} aria-invalid={Boolean(form.formState.errors.displayName)} />
          {form.formState.errors.displayName && <span role="alert" className="mt-1.5 block text-sm font-bold text-red-600 dark:text-red-400">{form.formState.errors.displayName.message}</span>}
        </label>
      )}
      <label className="block text-sm font-extrabold">Email address
        <input type="email" autoComplete="email" className={inputClass} placeholder="you@example.com" {...form.register("email")} aria-invalid={Boolean(form.formState.errors.email)} />
        {form.formState.errors.email && <span role="alert" className="mt-1.5 block text-sm font-bold text-red-600 dark:text-red-400">{form.formState.errors.email.message}</span>}
      </label>
      <label className="block text-sm font-extrabold">Password
        <span className="relative block">
          <input type={showPassword ? "text" : "password"} autoComplete={isSignUp ? "new-password" : "current-password"} className={`${inputClass} pr-12`} placeholder="At least 8 characters" {...form.register("password")} aria-invalid={Boolean(form.formState.errors.password)} />
          <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute bottom-1 right-1 grid size-10 place-items-center rounded-lg text-muted" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
        </span>
        {form.formState.errors.password && <span role="alert" className="mt-1.5 block text-sm font-bold text-red-600 dark:text-red-400">{form.formState.errors.password.message}</span>}
      </label>
      {!isSignUp && <div className="text-right"><Link href="/forgot-password" className="text-sm font-extrabold text-[var(--violet)] hover:underline">Forgot password?</Link></div>}
      {formError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{formError}</p>}
      <button type="submit" disabled={form.formState.isSubmitting} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--violet)] px-5 font-black text-white shadow-lg shadow-violet-500/20 transition hover:bg-[var(--violet-dark)] disabled:cursor-wait disabled:opacity-70">
        {form.formState.isSubmitting && <LoaderCircle className="animate-spin" size={18} />}{isSignUp ? "Create my account" : "Sign in"}
      </button>
      <p className="text-center text-sm text-muted">{isSignUp ? "Already revising with us?" : "New to Bytewise?"} <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-black text-[var(--violet)] hover:underline">{isSignUp ? "Sign in" : "Create an account"}</Link></p>
    </form>
  );
}
