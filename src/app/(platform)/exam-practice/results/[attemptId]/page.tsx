import type { Metadata } from "next";
import { ExamResults } from "@/components/exam/exam-results";

export const metadata: Metadata = { title: "Exam results" };
export default async function ExamResultsPage({ params }: { params: Promise<{ attemptId: string }> }) { const { attemptId } = await params; return <main id="main-content" className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10"><ExamResults attemptId={attemptId} /></main>; }
