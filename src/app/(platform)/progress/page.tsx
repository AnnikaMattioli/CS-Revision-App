import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { ProgressDashboard } from "@/components/progress/progress-dashboard";
import { getProgressSnapshot } from "@/lib/progress/repository";

export const metadata: Metadata = { title: "Progress" };
export default async function ProgressPage() { const snapshot = await getProgressSnapshot(); return <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10"><Breadcrumbs items={[{ label: "Progress" }]} /><div className="mb-8"><p className="font-black text-[var(--violet)]">PROGRESS & ADAPTATION</p><h1 className="mt-2 text-4xl font-black tracking-tight">See what is getting stronger</h1><p className="mt-3 max-w-3xl text-lg leading-8 text-muted">Understand your mastery, spot the next useful step and practise where it will make the biggest difference.</p></div><ProgressDashboard initial={snapshot} /></main>; }
