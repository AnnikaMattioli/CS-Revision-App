"use client";

import { CheckCircle2, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import type { WorkedSolution } from "@/types/content";

export function SolutionSteps({ solution }: { solution: WorkedSolution }) {
  const [visible, setVisible] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { const frame = requestAnimationFrame(() => setReady(true)); return () => cancelAnimationFrame(frame); }, []);

  return <div>
    <div className="space-y-4">{solution.steps.map((step, index) => <section key={step.title} className="card overflow-hidden">
      <button disabled={!ready} onClick={() => setVisible(visible === index + 1 ? index : index + 1)} className="flex min-h-16 w-full items-center gap-4 p-5 text-left disabled:opacity-60"><span className={`grid size-9 shrink-0 place-items-center rounded-xl font-black ${visible > index ? "bg-[var(--violet)] text-white" : "bg-[var(--surface-soft)]"}`}>{index + 1}</span><span className="flex-1 font-black">{step.title}</span>{visible > index ? <ChevronUp size={19} /> : <ChevronDown size={19} />}</button>
      {visible > index ? <div className="border-t px-5 pb-5 pt-4"><p className="leading-7 text-muted">{step.explanation}</p>{step.working ? <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm font-bold text-slate-100"><code>{step.working}</code></pre> : null}</div> : null}
    </section>)}</div>
    <button disabled={!ready} onClick={() => setShowAnswer((value) => !value)} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--violet)] px-5 font-black text-white disabled:opacity-60"><Eye size={18} />{showAnswer ? "Hide model answer" : "Reveal model answer"}</button>
    {showAnswer ? <section className="mt-5 rounded-2xl border-2 border-[var(--teal)] bg-emerald-50 p-6 dark:bg-emerald-500/10">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-xl font-black"><CheckCircle2 className="text-[var(--teal)]" />Model answer</h2><span className="rounded-full bg-emerald-200 px-3 py-1 text-sm font-black text-emerald-950 dark:bg-emerald-400/20 dark:text-emerald-100">{solution.marks} {solution.marks === 1 ? "mark" : "marks"}</span></div>
      <ol className="mt-5 space-y-3">{answerSentences(solution.finalAnswer).map((sentence, index) => <li key={`${index}-${sentence}`} className="flex gap-3 text-[1.04rem] leading-8"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-200 text-sm font-black text-emerald-950 dark:bg-emerald-400/20 dark:text-emerald-100">{index + 1}</span><span>{sentence}</span></li>)}</ol>
    </section> : null}
  </div>;
}

function answerSentences(answer: string) {
  return answer.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [answer];
}
