import type { Metadata } from "next";
import { ExamSetup } from "@/components/exam/exam-setup";

export const metadata: Metadata = { title: "Exam practice" };
export default function ExamPracticePage() { return <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10"><div className="mb-8"><p className="font-black text-[var(--coral)]">TIMED EXAM PRACTICE</p><h1 className="mt-2 text-4xl font-black tracking-tight">Ready when you are</h1><p className="mt-3 max-w-3xl text-lg leading-8 text-muted">Choose the shape of your paper, then work in a focused exam interface with autosave, a clear timer and no hints.</p></div><ExamSetup /></main>; }
