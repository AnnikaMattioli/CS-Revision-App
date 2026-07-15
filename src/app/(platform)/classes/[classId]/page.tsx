import type { Metadata } from "next";
import { CalendarDays, ChartNoAxesCombined, ClipboardList, ClipboardPlus, KeyRound, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { ClassActions } from "@/components/teacher/class-actions";
import { getCurrentAccount } from "@/lib/auth/account";
import { getStudentClass } from "@/lib/student/classes";
import { getTeacherClass } from "@/lib/teacher/repository";

export const metadata: Metadata = { title: "Class details" };

export default async function ClassPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const account = await getCurrentAccount();
  if (account?.role === "student") {
    const item = await getStudentClass(classId);
    if (!item) notFound();
    return <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10">
      <Breadcrumbs items={[{ label: "My classes", href: "/classes" }, { label: item.name }]} />
      <p className="font-black text-[var(--teal)]">STUDENT CLASS</p><h1 className="mt-2 text-4xl font-black tracking-tight">{item.name}</h1><p className="mt-2 text-muted">{item.courseTitle}</p>
      <section className="mt-8"><div className="flex items-center gap-3"><ClipboardList className="text-[var(--violet)]" /><h2 className="text-2xl font-black">Assignments from your teacher</h2></div><div className="mt-4 space-y-4">{item.assignments.length ? item.assignments.map((assignment) => <article key={assignment.id} className="card p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-xl font-black">{assignment.title}</h3><p className="mt-2 leading-7 text-muted">{assignment.instructions || "No additional instructions."}</p></div><span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-[var(--violet)]">Published</span></div><p className="mt-4 flex items-center gap-2 text-sm font-bold text-muted"><CalendarDays size={17} />{assignment.dueAt ? `Due ${new Date(assignment.dueAt).toLocaleDateString("en-GB")}` : "No deadline"}</p></article>) : <div className="soft-card p-6 text-muted">Your teacher has not published any assignments yet.</div>}</div></section>
    </main>;
  }

  const item = await getTeacherClass(classId);
  if (!item) notFound();
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10">
    <Breadcrumbs items={[{ label: "Classes", href: "/classes" }, { label: item.name }]} />
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-black text-[var(--teal)]">CLASS DETAILS</p><h1 className="mt-2 text-4xl font-black tracking-tight">{item.name}</h1><p className="mt-2 text-muted">{item.courseTitle} · join hint {item.joinCodeHint}</p></div><div className="flex flex-wrap gap-3"><Link href={`/classes/${classId}/analytics`} className="flex min-h-11 items-center gap-2 rounded-xl border bg-[var(--surface)] px-4 font-black"><ChartNoAxesCombined size={18} />Analytics</Link><Link href={`/classes/${classId}/assignments/new`} className="flex min-h-11 items-center gap-2 rounded-xl bg-[var(--violet)] px-4 font-black text-white"><ClipboardPlus size={18} />New assignment</Link></div></div>
    <section className="mt-8 grid gap-4 sm:grid-cols-3"><Stat icon={<Users className="text-[var(--blue)]" />} value={item.students.length} label="active students" /><Stat icon={<CalendarDays className="text-[var(--coral)]" />} value={item.assignments.length} label="assignments" /><Stat icon={<KeyRound className="text-[var(--teal)]" />} value={item.joinCodeHint} label="secure code hint" /></section>
    <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_20rem]"><div className="space-y-8"><section><h2 className="text-2xl font-black">Assignments</h2><div className="mt-4 space-y-3">{item.assignments.map((assignment) => <Link key={assignment.id} href={`/classes/${classId}/assignments/${assignment.id}`} className="card block p-5 transition hover:-translate-y-0.5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-black">{assignment.title}</h3><p className="mt-1 text-sm text-muted">{assignment.targetLabel}{assignment.dueAt ? ` · due ${new Date(assignment.dueAt).toLocaleDateString("en-GB")}` : " · no due date"}</p></div><span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-[var(--violet)]">{assignment.completedCount}/{assignment.studentCount} complete</span></div></Link>)}{!item.assignments.length ? <p className="soft-card p-5 text-muted">No assignments yet.</p> : null}</div></section><section><h2 className="text-2xl font-black">Student progress</h2><div className="mt-4 overflow-hidden rounded-2xl border bg-[var(--surface)]"><div className="hidden grid-cols-[1fr_7rem_7rem] gap-4 border-b bg-[var(--surface-soft)] px-5 py-3 text-xs font-black uppercase text-muted sm:grid"><span>Student</span><span>Completion</span><span>Mastery</span></div>{item.students.map((student) => <Link key={student.id} href={`/classes/${classId}/students/${student.id}`} className="grid gap-1 border-b px-5 py-4 last:border-0 hover:bg-[var(--surface-soft)] sm:grid-cols-[1fr_7rem_7rem] sm:gap-4"><span className="font-black">{student.displayName}</span><span className="text-sm font-bold">{student.assignmentCompletion}%</span><span className="text-sm font-bold">{student.averageMastery}%</span></Link>)}</div></section></div><ClassActions classId={classId} students={item.students} /></div>
  </main>;
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return <div className="card p-5">{icon}<p className="mt-3 text-3xl font-black">{value}</p><p className="text-sm font-bold text-muted">{label}</p></div>;
}
