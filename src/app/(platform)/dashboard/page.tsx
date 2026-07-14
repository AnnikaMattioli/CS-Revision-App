import type { Metadata } from "next";
import { ArrowRight, BookOpen, CircleHelp, Flame, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/stat-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { demoStudent } from "@/lib/demo-data";
import { hasSupabaseConfig } from "@/lib/env";
import { getProgressSnapshot } from "@/lib/progress/repository";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

async function getStudent() {
  if (!hasSupabaseConfig()) return demoStudent;
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return demoStudent;
  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();
  return { ...demoStudent, name: profile?.display_name ?? "Student" };
}

export default async function DashboardPage() {
  const [student, progress] = await Promise.all([getStudent(), getProgressSnapshot()]);
  const isDemo = !hasSupabaseConfig(); const weakest = [...progress.topics].sort((a, b) => a.score - b.score)[0];
  const completion = Math.round(progress.topics.reduce((sum, topic) => sum + topic.score, 0) / progress.topics.length);
  const today = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  return <main id="main-content" className="mx-auto max-w-[1500px] px-4 pb-12 pt-20 sm:px-7 lg:px-9 lg:pt-7">
    <header className="mb-7 flex items-start justify-between gap-4"><div><p className="font-extrabold text-[var(--violet)]">{today}</p><h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Ready to make progress, {student.name}? 👋</h1><p className="mt-2 text-muted">Small steps, sharp thinking. Let&apos;s keep your momentum going.</p></div><ThemeToggle /></header>
    {isDemo && <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"><span>Demo mode — progress is kept on this device until Supabase is connected.</span><a href="/sign-up" className="font-black underline">Set up an account</a></div>}
    <section className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(120deg,#6847e8,#4977ed)] p-6 text-white shadow-xl shadow-violet-500/15 sm:p-8"><div className="absolute -right-10 -top-24 size-72 rounded-full border-[40px] border-white/10" /><div className="relative max-w-2xl"><span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-black tracking-wide">RECOMMENDED NEXT</span><h2 className="mt-4 text-2xl font-black sm:text-3xl">Strengthen {weakest.title}</h2><p className="mt-2 text-violet-100">{weakest.explanation}</p><div className="mt-5 flex items-center gap-3"><div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{ width: `${weakest.score}%` }} /></div><span className="text-sm font-black">{weakest.score}%</span></div><Link href={`/practise?topic=${weakest.slug}&mode=adaptive`} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 font-black text-violet-700">Start adaptive set <ArrowRight size={18} /></Link></div></section>
    <section aria-label="Learning statistics" className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Course mastery" value={`${completion}%`} note="Explainable topic evidence" icon={BookOpen} colour="var(--blue)" /><StatCard label="Revision streak" value={`${progress.currentStreak} days`} note={`Best: ${progress.bestStreak} days`} icon={Flame} colour="var(--coral)" /><StatCard label="Questions answered" value={String(progress.totalQuestions)} note="Across marked practice" icon={CircleHelp} colour="var(--violet)" /><StatCard label="Recent accuracy" value={`${progress.recentAccuracy}%`} note="Across recent marked sets" icon={Target} colour="var(--teal)" /></section>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_.75fr]"><section className="card p-6"><div className="flex items-end justify-between"><div><p className="text-sm font-black text-muted">YOUR COURSE</p><h2 className="mt-1 text-xl font-black">Topic mastery</h2></div><Link href="/progress" className="font-black text-[var(--violet)]">Full progress</Link></div><div className="mt-6 space-y-5">{progress.topics.map((topic) => <div key={topic.slug}><div className="mb-2 flex justify-between text-sm font-black"><span>{topic.icon} {topic.title}</span><span className="text-muted">{topic.score}% · {topic.label}</span></div><div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-soft)]"><div className="h-full rounded-full" style={{ width: `${topic.score}%`, background: topic.colour }} /></div></div>)}</div></section><section className="card p-6"><div className="flex items-center justify-between"><h2 className="text-xl font-black">Latest badge</h2><Trophy className="text-[var(--yellow)]" /></div>{progress.achievements.find((item) => item.earnedAt) ? <div className="mt-5 flex items-center gap-4"><span className="grid size-16 place-items-center rounded-full bg-amber-100 text-3xl dark:bg-amber-500/15">{progress.achievements.find((item) => item.earnedAt)!.icon}</span><div><p className="font-black">{progress.achievements.find((item) => item.earnedAt)!.title}</p><p className="mt-1 text-sm text-muted">{progress.achievements.find((item) => item.earnedAt)!.description}</p></div></div> : <p className="mt-5 text-muted">Your first useful learning milestone is waiting.</p>}<Link href="/achievements" className="mt-5 inline-flex items-center gap-2 font-black text-[var(--violet)]">View achievements <ArrowRight size={17} /></Link></section></div>
  </main>;
}
