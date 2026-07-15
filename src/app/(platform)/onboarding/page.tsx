import type { Metadata } from "next";
import { CoursePicker } from "@/components/onboarding/course-picker";

export const metadata: Metadata = { title: "Set up your account" };
export default function OnboardingPage() {
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-5 pb-16 pt-20 sm:px-8 lg:pt-14"><div className="mb-8"><span className="font-black text-[var(--violet)]">ACCOUNT SETUP</span><h1 className="mt-2 text-4xl font-black tracking-tight">Let’s personalise Bytewise</h1><p className="mt-3 text-lg leading-8 text-muted">Choose how you use the app and the Computer Science course you study or teach.</p></div><CoursePicker onboarding /></main>;
}
