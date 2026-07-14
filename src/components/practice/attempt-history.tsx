"use client";

import { ArrowRight, Clock3, History } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { PracticeResult } from "@/types/practice";

export function AttemptHistory() {
  const [attempts, setAttempts] = useState<PracticeResult[]>([]);
  useEffect(() => { const timer = window.setTimeout(() => setAttempts(JSON.parse(window.localStorage.getItem("bytewise:attempt-history") ?? "[]") as PracticeResult[]), 0); return () => clearTimeout(timer); }, []);
  if (!attempts.length) return <div className="card p-9 text-center"><History className="mx-auto text-[var(--violet)]" size={44} /><h2 className="mt-4 text-2xl font-black">No completed sets yet</h2><p className="mt-2 text-muted">Your scores and feedback will appear here.</p><Link href="/practise" className="mt-6 inline-flex rounded-xl bg-[var(--violet)] px-5 py-3 font-black text-white">Start a practice set</Link></div>;
  return <div className="space-y-4">{attempts.map((attempt) => <article key={attempt.attemptId} className="card flex flex-wrap items-center gap-5 p-5"><span className={`grid size-16 place-items-center rounded-2xl text-xl font-black ${attempt.percentage >= 70 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200" : "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200"}`}>{attempt.percentage}%</span><div className="min-w-0 flex-1"><p className="font-black">Mixed-topic practice</p><p className="mt-1 flex flex-wrap gap-4 text-sm font-bold text-muted"><span>{attempt.score}/{attempt.availableMarks} marks</span><span className="flex items-center gap-1"><Clock3 size={15} />{Math.floor(attempt.durationSeconds / 60)}m {attempt.durationSeconds % 60}s</span><span>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(attempt.submittedAt))}</span></p></div><Link href={`/practise/results/${attempt.attemptId}`} className="flex min-h-10 items-center gap-2 rounded-xl border px-4 font-black">Review <ArrowRight size={17} /></Link></article>)}</div>;
}
