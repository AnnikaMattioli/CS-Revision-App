"use client";

import { CheckCircle2, CircleHelp, XCircle } from "lucide-react";
import { useState } from "react";

export function LessonKnowledgeCheck({ question, options, correctIndex }: { question: string; options: string[]; correctIndex: number }) {
  const [selected, setSelected] = useState<number>();
  const correct = selected === correctIndex;

  return <fieldset className="mt-6 rounded-2xl border-2 border-violet-200 bg-violet-50/70 p-5 dark:border-violet-500/30 dark:bg-violet-500/10">
    <legend className="flex items-center gap-2 px-2 font-black text-[var(--violet)]"><CircleHelp size={20} />Quick check</legend>
    <p className="mt-1 font-black leading-7">{question}</p>
    <div className="mt-4 grid gap-2">{options.map((option, index) => <button key={`${index}-${option}`} type="button" onClick={() => setSelected(index)} aria-pressed={selected === index} className={`min-h-12 rounded-xl border px-4 py-3 text-left font-bold transition ${selected === index ? correct ? "border-emerald-500 bg-emerald-100 dark:bg-emerald-500/15" : "border-amber-500 bg-amber-50 dark:bg-amber-500/10" : "bg-[var(--surface)] hover:border-[var(--violet)]"}`}>{option}</button>)}</div>
    <div aria-live="polite">{selected !== undefined ? <p className={`mt-4 flex items-start gap-2 rounded-xl p-3 font-bold ${correct ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100" : "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-100"}`}>{correct ? <CheckCircle2 className="shrink-0" size={20} /> : <XCircle className="shrink-0" size={20} />}{correct ? "Correct — that is the precise idea to remember." : "Not quite — try another answer, then compare it with the explanation above."}</p> : null}</div>
  </fieldset>;
}
