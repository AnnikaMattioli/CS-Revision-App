"use client";

import { CheckCircle2, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { applyLocalHistory } from "@/lib/progress/demo-progress";
import type { PracticeResult } from "@/types/practice";
import type { ProgressSnapshot } from "@/types/progress";

export function AchievementsGallery({ initial }: { initial: ProgressSnapshot }) {
  const [snapshot, setSnapshot] = useState(initial);
  useEffect(() => { const timer = window.setTimeout(() => { const history = JSON.parse(window.localStorage.getItem("bytewise:attempt-history") ?? "[]") as PracticeResult[]; setSnapshot(applyLocalHistory(initial, history)); }, 0); return () => clearTimeout(timer); }, [initial]);
  const earned = snapshot.achievements.filter((item) => item.earnedAt).length;
  return <><section className="rounded-[1.75rem] bg-[linear-gradient(120deg,#ff8a62,#ffbd4a)] p-7 text-slate-950 sm:p-9"><p className="font-black">YOUR TROPHY CABINET</p><h1 className="mt-2 text-4xl font-black tracking-tight">{earned} of {snapshot.achievements.length} achievements unlocked</h1><p className="mt-3 max-w-2xl text-lg font-bold text-slate-800">Celebrate useful learning habits—not leaderboards or comparisons with other students.</p></section><div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{snapshot.achievements.map((item) => { const unlocked = Boolean(item.earnedAt); const progress = Math.min(100, Math.round(item.progress / item.target * 100)); return <article key={item.code} className={`card relative overflow-hidden p-6 ${unlocked ? "" : "opacity-75"}`}><div className="flex items-start justify-between"><span className={`grid size-16 place-items-center rounded-full text-3xl ${unlocked ? "bg-amber-100 dark:bg-amber-500/15" : "bg-[var(--surface-soft)] grayscale"}`}>{item.icon}</span>{unlocked ? <CheckCircle2 className="text-emerald-600" aria-label="Unlocked" /> : <LockKeyhole className="text-muted" aria-label="Locked" />}</div><h2 className="mt-5 text-xl font-black">{item.title}</h2><p className="mt-2 leading-6 text-muted">{item.description}</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]"><div className="h-full rounded-full bg-[var(--coral)]" style={{ width: `${progress}%` }} /></div><p className="mt-2 text-xs font-black text-muted">{unlocked ? `Unlocked ${new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(`${item.earnedAt!.slice(0, 10)}T12:00:00`))}` : `${item.progress} of ${item.target}`}</p></article>; })}</div></>;
}
