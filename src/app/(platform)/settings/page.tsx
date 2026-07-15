import type { Metadata } from "next";
import { CoursePicker } from "@/components/onboarding/course-picker";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DeleteAccount } from "@/components/settings/delete-account";

export const metadata: Metadata = { title: "Settings" };
export default function SettingsPage() {
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-4xl px-5 pb-16 pt-20 sm:px-8 lg:pt-12"><h1 className="text-4xl font-black tracking-tight">Settings</h1><p className="mt-2 text-muted">Keep Bytewise working the way you like.</p><section className="card mt-7 p-6"><div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-black">Appearance</h2><p className="mt-1 text-sm text-muted">Switch between light and dark mode. Your choice is saved on this device.</p></div><ThemeToggle /></div></section><section className="card mt-6 p-6"><h2 className="text-xl font-black">Your course</h2><p className="mt-1 text-sm text-muted">Changing course updates the content shown on your dashboard.</p><CoursePicker /></section><section className="card mt-6 border-red-200 p-6"><h2 className="text-xl font-black">Your data</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-muted">You can permanently delete your account and associated personal learning records. Class-level anonymous aggregates may no longer identify you.</p><DeleteAccount /></section></main>;
}
