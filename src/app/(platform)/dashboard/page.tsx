import type { Metadata } from "next";
import { ArrowRight, BookOpen, CircleHelp, Flame, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { ActivityChart } from "@/components/dashboard/dashboard-chart";
import { CourseProgress } from "@/components/dashboard/course-progress";
import { StatCard } from "@/components/dashboard/stat-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { demoStudent } from "@/lib/demo-data";
import { hasSupabaseConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

async function getStudent() {
  if (!hasSupabaseConfig()) return demoStudent;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return demoStudent;
  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();
  return { ...demoStudent, name: profile?.display_name ?? "Student" };
}

export default async function DashboardPage() {
  const student = await getStudent();
  const isDemo = !hasSupabaseConfig();
  const today = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  return <main id="main-content" className="mx-auto max-w-[1500px] px-4 pb-12 pt-20 sm:px-7 lg:px-9 lg:pt-7">
    <header className="mb-7 flex items-start justify-between gap-4"><div><p className="font-extrabold text-[var(--violet)]">{today}</p><h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Ready to make progress, {student.name}? 👋</h1><p className="mt-2 text-muted">Small steps, sharp thinking. Let&apos;s keep your momentum going.</p></div><ThemeToggle /></header>
    {isDemo && <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"><span>Demo mode — connect Supabase to save real student progress.</span><a href="/sign-up" className="font-black underline">Set up an account</a></div>}

    <section className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(120deg,#6847e8,#4977ed)] p-6 text-white shadow-xl shadow-violet-500/15 sm:p-8">
      <div className="absolute -right-10 -top-24 size-72 rounded-full border-[40px] border-white/10" />
      <div className="relative max-w-2xl"><span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-black tracking-wide">CONTINUE LEARNING</span><h2 className="mt-4 text-2xl font-black sm:text-3xl">Memory and storage</h2><p className="mt-2 text-violet-100">Next up: secondary storage technologies</p><div className="mt-5 flex items-center gap-3"><div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/20"><div className="h-full w-[54%] rounded-full bg-white" /></div><span className="text-sm font-black">54%</span></div><Link href="/learn/memory-and-storage/secondary-storage" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 font-black text-violet-700 transition hover:-translate-y-0.5">Continue learning <ArrowRight size={18} /></Link></div>
    </section>

    <section aria-label="Learning statistics" className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Course complete" value={`${student.completion}%`} note="6% up this month" icon={BookOpen} colour="var(--blue)" />
      <StatCard label="Revision streak" value={`${student.streak} days`} note="Your best is 12 days" icon={Flame} colour="var(--coral)" />
      <StatCard label="Questions answered" value={String(student.questionsAnswered)} note="42 this week" icon={CircleHelp} colour="var(--violet)" />
      <StatCard label="Recent accuracy" value={`${student.recentAccuracy}%`} note="4% above last week" icon={Target} colour="var(--teal)" />
    </section>

    <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_.85fr]"><CourseProgress /><section className="card p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="text-sm font-extrabold text-muted">LAST 7 DAYS</p><h2 className="mt-1 text-xl font-black">Questions answered</h2></div><span className="rounded-xl bg-violet-100 px-3 py-1 text-sm font-black text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">170 total</span></div><ActivityChart /></section></div>

    <div className="mt-6 grid gap-6 lg:grid-cols-3"><section className="card p-6 lg:col-span-2"><div className="flex gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-100 text-2xl dark:bg-amber-500/15">💡</span><div><p className="text-sm font-extrabold text-[var(--coral)]">RECOMMENDED NEXT</p><h2 className="mt-1 text-xl font-black">Strengthen your network protocols</h2><p className="mt-2 leading-7 text-muted">Your recent answers show that TCP/IP and packet switching could use a quick refresh.</p><button disabled className="mt-4 font-black text-muted opacity-60" title="Adaptive practice arrives in Phase 4">Recommendation preview</button></div></div></section><section className="card p-6"><div className="flex items-center justify-between"><h2 className="text-xl font-black">Latest badge</h2><Trophy className="text-[var(--yellow)]" /></div><div className="mt-5 flex items-center gap-4"><span className="grid size-16 place-items-center rounded-full bg-amber-100 text-3xl dark:bg-amber-500/15">🚀</span><div><p className="font-black">Quick starter</p><p className="mt-1 text-sm text-muted">Completed 3 sessions</p></div></div></section></div>
  </main>;
}
