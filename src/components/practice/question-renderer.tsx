"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import type { PracticeAnswer, PublicQuestion } from "@/types/practice";

export function QuestionRenderer({ question, answer, onChange }: { question: PublicQuestion; answer: PracticeAnswer; onChange: (answer: PracticeAnswer) => void }) {
  if (question.type === "multiple_choice" || question.type === "boolean") return <Choice question={question} answer={answer} onChange={onChange} multiple={false} />;
  if (question.type === "multiple_select") return <Choice question={question} answer={answer} onChange={onChange} multiple />;
  if (question.type === "ordering") return <Ordering question={question} answer={answer} onChange={onChange} />;
  if (question.type === "matching") return <Matching question={question} answer={answer} onChange={onChange} />;
  const long = question.type === "short_answer" || question.type === "extended_answer";
  return <div><label className="block font-extrabold" htmlFor={`answer-${question.id}`}>{question.type === "numerical" ? "Your calculation" : question.type === "code_trace" ? "Program output" : "Your answer"}</label>{long ? <textarea id={`answer-${question.id}`} rows={question.type === "extended_answer" ? 8 : 4} value={typeof answer === "string" ? answer : ""} onChange={(event) => onChange(event.target.value)} className="mt-3 w-full rounded-2xl border bg-[var(--surface)] p-4 text-base leading-7" placeholder={question.type === "extended_answer" ? "Build a clear, linked explanation…" : "Write your answer…"} /> : <input id={`answer-${question.id}`} inputMode={question.type === "numerical" ? "decimal" : "text"} value={typeof answer === "string" ? answer : ""} onChange={(event) => onChange(event.target.value)} className="mt-3 h-13 w-full rounded-xl border bg-[var(--surface)] px-4 text-base" placeholder={question.type === "fill_blank" ? "Complete the gap" : "Enter your answer"} />}{question.hint && <p className="mt-3 text-sm font-bold text-muted">Hint: {question.hint}</p>}</div>;
}

function Choice({ question, answer, onChange, multiple }: { question: PublicQuestion; answer: PracticeAnswer; onChange: (value: PracticeAnswer) => void; multiple: boolean }) {
  const selected = Array.isArray(answer) ? answer : typeof answer === "string" ? [answer] : [];
  function toggle(id: string) { if (!multiple) onChange(id); else onChange(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]); }
  return <fieldset><legend className="sr-only">Answer choices</legend><div className="space-y-3">{question.options?.map((option) => <label key={option.id} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-2 p-4 font-bold transition ${selected.includes(option.id) ? "border-[var(--violet)] bg-violet-50 dark:bg-violet-500/10" : "hover:border-violet-200"}`}><input type={multiple ? "checkbox" : "radio"} name={`question-${question.id}`} checked={selected.includes(option.id)} onChange={() => toggle(option.id)} value={option.id} /><span>{option.label}</span></label>)}</div></fieldset>;
}

function Ordering({ question, answer, onChange }: { question: PublicQuestion; answer: PracticeAnswer; onChange: (value: PracticeAnswer) => void }) {
  const order = Array.isArray(answer) && answer.length ? answer : question.items?.map((item) => item.id) ?? [];
  function move(index: number, direction: -1 | 1) { const next = [...order]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; onChange(next); }
  return <div className="space-y-3">{order.map((id, index) => { const item = question.items?.find((entry) => entry.id === id); return <div key={id} className="flex min-h-14 items-center gap-3 rounded-xl border bg-[var(--surface)] p-3"><span className="grid size-8 place-items-center rounded-lg bg-[var(--surface-soft)] font-black">{index + 1}</span><span className="flex-1 font-bold">{item?.label}</span><button onClick={() => move(index, -1)} disabled={index === 0} className="grid size-9 place-items-center rounded-lg border disabled:opacity-30" aria-label={`Move ${item?.label} up`}><ArrowUp size={17} /></button><button onClick={() => move(index, 1)} disabled={index === order.length - 1} className="grid size-9 place-items-center rounded-lg border disabled:opacity-30" aria-label={`Move ${item?.label} down`}><ArrowDown size={17} /></button></div>; })}</div>;
}

function Matching({ question, answer, onChange }: { question: PublicQuestion; answer: PracticeAnswer; onChange: (value: PracticeAnswer) => void }) {
  const matches = answer && typeof answer === "object" && !Array.isArray(answer) ? answer : {};
  return <div className="space-y-3">{question.items?.map((item) => <label key={item.id} className="grid gap-2 rounded-xl border bg-[var(--surface)] p-4 sm:grid-cols-[10rem_1fr] sm:items-center"><span className="font-black">{item.label}</span><select value={matches[item.id] ?? ""} onChange={(event) => onChange({ ...matches, [item.id]: event.target.value })} className="h-11 rounded-lg border bg-[var(--surface)] px-3 font-bold"><option value="">Choose a role…</option>{question.targets?.map((target) => <option key={target.id} value={target.id}>{target.label}</option>)}</select></label>)}</div>;
}
