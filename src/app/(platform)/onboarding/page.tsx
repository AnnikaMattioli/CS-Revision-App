import type { Metadata } from "next";
import { CoursePicker } from "@/components/onboarding/course-picker";

export const metadata: Metadata = { title: "Choose your course" };
export default function OnboardingPage() {
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-5 pb-16 pt-20 sm:px-8 lg:pt-14"><div className="mb-8"><span className="font-black text-[var(--violet)]">STEP 1 OF 1</span><h1 className="mt-2 text-4xl font-black tracking-tight">What are you studying?</h1><p className="mt-3 text-lg leading-8 text-muted">Choose your qualification and exam board. You can change this later in settings.</p></div><CoursePicker /></main>;
}
