import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { ResultsView } from "@/components/practice/results-view";

export const metadata: Metadata = { title: "Practice results" };
export default async function ResultsPage({ params }: { params: Promise<{ attemptId: string }> }) { const { attemptId } = await params; return <main id="main-content" className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10"><Breadcrumbs items={[{ label: "Practise", href: "/practise" }, { label: "Results" }]} /><ResultsView attemptId={attemptId} /></main>; }
