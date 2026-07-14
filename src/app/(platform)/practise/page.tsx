import type { Metadata } from "next";
import { History, Sparkles } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { PracticeLauncher } from "@/components/practice/practice-launcher";

export const metadata: Metadata = { title: "Practise" };
export default function PractisePage() {
  return <main id="main-content" className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10"><Breadcrumbs items={[{ label: "Practise" }]} /><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div className="max-w-3xl"><p className="flex items-center gap-2 font-black text-[var(--violet)]"><Sparkles size={18} /> ORIGINAL EXAM-STYLE PRACTICE</p><h1 className="mt-2 text-4xl font-black tracking-tight">Turn knowledge into marks</h1><p className="mt-3 text-lg leading-8 text-muted">Build a set, answer without seeing the mark scheme, then get detailed feedback on every mark.</p></div><Link href="/practise/history" className="flex min-h-11 items-center gap-2 rounded-xl border bg-[var(--surface)] px-4 font-black"><History size={18} />Attempt history</Link></div><PracticeLauncher /></main>;
}
