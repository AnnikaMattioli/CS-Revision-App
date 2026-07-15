import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { AttemptHistory } from "@/components/practice/attempt-history";

export const metadata: Metadata = { title: "Attempt history" };
export default function HistoryPage() { return <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10"><Breadcrumbs items={[{ label: "Practise", href: "/practise" }, { label: "Attempt history" }]} /><h1 className="text-4xl font-black tracking-tight">Attempt history</h1><p className="mb-8 mt-3 text-lg text-muted">Review previous scores, marking and improvement advice.</p><AttemptHistory /></main>; }
