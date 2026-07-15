import type { Metadata } from "next";
import { ArrowRight, FileCheck2 } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { getWorkedSolutions } from "@/lib/content/repository";

export const metadata: Metadata = { title: "Worked solutions" };
export default async function WorkedSolutionsPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams; const { solutions } = await getWorkedSolutions(); const filtered = topic ? solutions.filter((item) => item.topicSlug === topic) : solutions;
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10"><Breadcrumbs items={[{ label: "Worked solutions" }]} /><div className="max-w-3xl"><p className="font-black text-[var(--teal)]">EXAM TECHNIQUE, UNPACKED</p><h1 className="mt-2 text-4xl font-black tracking-tight">Worked solutions</h1><p className="mt-3 text-lg leading-8 text-muted">See how to turn a question into a structured, well-justified answer—one decision at a time.</p></div><section className="mt-8 grid gap-5 md:grid-cols-2">{filtered.map((solution) => <article key={solution.id} className="card group flex flex-col p-6"><span className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-[var(--teal)] dark:bg-emerald-500/15"><FileCheck2 /></span><p className="mt-5 text-sm font-black text-[var(--teal)]">{solution.topicTitle}</p><h2 className="mt-1 text-xl font-black">{solution.title}</h2><p className="mt-3 line-clamp-3 flex-1 leading-7 text-muted">{solution.prompt}</p><Link href={`/worked-solutions/${solution.slug}`} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border font-black transition group-hover:bg-[var(--teal)] group-hover:text-slate-950">See every step <ArrowRight size={17} /></Link></article>)}</section>{!filtered.length && <div className="card mt-8 p-8 text-center"><p className="text-xl font-black">No worked solutions published here yet</p></div>}</main>;
}
