import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { SolutionSteps } from "@/components/content/solution-steps";
import { getWorkedSolutions } from "@/lib/content/repository";

type Params = Promise<{ solutionSlug: string }>;
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> { const { solutionSlug } = await params; const { solutions } = await getWorkedSolutions(); return { title: solutions.find((item) => item.slug === solutionSlug)?.title ?? "Worked solution" }; }
export default async function WorkedSolutionPage({ params }: { params: Params }) {
  const { solutionSlug } = await params; const { solutions } = await getWorkedSolutions(); const solution = solutions.find((item) => item.slug === solutionSlug); if (!solution) notFound();
  return <main id="main-content" className="mx-auto max-w-4xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10"><Breadcrumbs items={[{ label: "Worked solutions", href: "/worked-solutions" }, { label: solution.title }]} /><header className="card p-6 sm:p-8"><p className="text-sm font-black text-[var(--teal)]">{solution.topicTitle}</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{solution.title}</h1><div className="mt-6 rounded-2xl bg-[var(--surface-soft)] p-5"><p className="text-sm font-extrabold text-muted">QUESTION</p><p className="mt-2 text-lg font-bold leading-8">{solution.prompt}</p></div></header><div className="mt-7"><p className="mb-4 font-black text-muted">Open each step before revealing the model answer.</p><SolutionSteps solution={solution} /></div></main>;
}
