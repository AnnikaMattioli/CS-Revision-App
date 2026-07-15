import type { Metadata } from "next";
import { ArrowRight, BookOpenCheck, ChartNoAxesCombined, ClipboardList, Users } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { CreateClassForm } from "@/components/teacher/create-class-form";
import { JoinClassForm } from "@/components/teacher/join-class-form";
import { getCurrentAccount } from "@/lib/auth/account";
import { getStudentClasses } from "@/lib/student/classes";
import { getTeacherClasses } from "@/lib/teacher/repository";

export const metadata: Metadata = { title: "Classes" };

export default async function ClassesPage() {
  const account = await getCurrentAccount();
  const teacher = account?.role === "teacher" || account?.role === "admin";
  if (!teacher) {
    const classes = await getStudentClasses();
    return <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10">
      <Breadcrumbs items={[{ label: "My classes" }]} />
      <div><p className="font-black text-[var(--teal)]">MY CLASSES</p><h1 className="mt-2 text-4xl font-black tracking-tight">Learn with your teacher</h1><p className="mt-3 max-w-2xl text-lg leading-8 text-muted">You only join a class when you enter a joining code from your teacher.</p></div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_21rem]"><section><h2 className="text-2xl font-black">Joined classes</h2><div className="mt-4 grid gap-4">{classes.length ? classes.map((item) => <Link key={item.id} href={`/classes/${item.id}`} className="card group p-6 transition hover:-translate-y-0.5"><div className="flex items-start justify-between"><BookOpenCheck className="text-[var(--violet)]" /><ArrowRight className="text-muted transition group-hover:translate-x-1" /></div><h3 className="mt-4 text-xl font-black">{item.name}</h3><p className="mt-1 text-sm text-muted">{item.courseTitle}</p><p className="mt-4 flex items-center gap-2 text-sm font-bold"><ClipboardList size={17} />{item.assignments.length} active {item.assignments.length === 1 ? "assignment" : "assignments"}</p></Link>) : <div className="soft-card p-7"><Users className="text-[var(--blue)]" /><h3 className="mt-4 text-xl font-black">You haven’t joined a class</h3><p className="mt-2 leading-7 text-muted">That’s completely fine. Your personal revision works without a class, and nothing is joined automatically.</p></div>}</div></section><JoinClassForm /></div>
    </main>;
  }

  const classes = await getTeacherClasses();
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10">
    <Breadcrumbs items={[{ label: "Classes" }]} />
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-black text-[var(--teal)]">CLASSES & ASSIGNMENTS</p><h1 className="mt-2 text-4xl font-black tracking-tight">Teach with useful signals</h1><p className="mt-3 max-w-3xl text-lg leading-8 text-muted">Create classes, publish focused work and see the learning evidence that helps you plan next steps.</p></div><Link href="/teacher" className="flex min-h-11 items-center gap-2 rounded-xl border bg-[var(--surface)] px-4 font-black"><ChartNoAxesCombined size={18} />Teacher dashboard</Link></div>
    <div className="mt-8 space-y-7"><CreateClassForm /><section><div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-black">Your classes</h2><span className="text-sm font-bold text-muted">{classes.filter((item) => !item.archived).length} active</span></div><div className="grid gap-4 md:grid-cols-2">{classes.length ? classes.map((item) => <Link key={item.id} href={`/classes/${item.id}`} className="card group p-6 transition hover:-translate-y-1"><div className="flex items-start justify-between gap-3"><span className="grid size-11 place-items-center rounded-xl bg-violet-100 text-[var(--violet)] dark:bg-violet-500/15"><BookOpenCheck /></span>{item.archived ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">Archived</span> : <ArrowRight className="text-muted transition group-hover:translate-x-1" />}</div><h3 className="mt-5 text-xl font-black">{item.name}</h3><p className="mt-1 text-sm text-muted">{item.courseTitle}</p><div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-muted"><span className="flex items-center gap-1"><Users size={16} />{item.students.length} students</span><span>{item.assignments.length} assignments</span></div></Link>) : <div className="soft-card p-6 text-muted md:col-span-2">No classes yet. Create your first class above; students only join when you share its code.</div>}</div></section></div>
  </main>;
}
