import type { Metadata } from "next";
import { BookOpenCheck, ChartNoAxesCombined, CircleCheckBig, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { getCurrentAccount } from "@/lib/auth/account";
import { getTeacherClasses } from "@/lib/teacher/repository";

export const metadata: Metadata = { title: "Teacher dashboard" };

export default async function TeacherDashboardPage() {
  const account = await getCurrentAccount();
  if (account?.role !== "teacher" && account?.role !== "admin") redirect("/dashboard");
  const classes = await getTeacherClasses();
  const active = classes.filter((item) => !item.archived);
  const students = active.reduce((sum, item) => sum + item.students.length, 0);
  const assignments = active.flatMap((item) => item.assignments);
  const published = assignments.filter((item) => item.status === "published");
  const completion = assignments.length ? `${Math.round(assignments.reduce((sum, item) => sum + (item.studentCount ? item.completedCount / item.studentCount * 100 : 0), 0) / assignments.length)}%` : "—";
  const stats = [
    ["Active classes", active.length, BookOpenCheck, "var(--violet)"],
    ["Students", students, Users, "var(--blue)"],
    ["Published", published.length, CircleCheckBig, "var(--teal)"],
    ["Completion", completion, ChartNoAxesCombined, "var(--coral)"],
  ] as const;

  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10">
    <Breadcrumbs items={[{ label: "Teacher dashboard" }]} />
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-black text-[var(--teal)]">TEACHER DASHBOARD</p><h1 className="mt-2 text-4xl font-black tracking-tight">Welcome, {account.displayName}</h1><p className="mt-3 max-w-2xl text-lg leading-8 text-muted">Monitor class completion and learning evidence, then set the next useful task.</p></div><Link href="/classes" className="rounded-xl bg-[var(--violet)] px-5 py-3 font-black text-white">Manage classes</Link></div>
    <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(([label, value, Icon, colour]) => <article key={label} className="card p-5"><Icon style={{ color: colour }} /><p className="mt-4 text-3xl font-black">{value}</p><p className="text-sm font-bold text-muted">{label}</p></article>)}</section>
    <section className="mt-8 card p-6"><h2 className="text-2xl font-black">Needs attention</h2><div className="mt-4 grid gap-3">{assignments.length ? assignments.map((assignment) => <div key={assignment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"><div><p className="font-black">{assignment.title}</p><p className="text-sm text-muted">{assignment.completedCount} of {assignment.studentCount} complete</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-900">{assignment.studentCount ? Math.round(assignment.completedCount / assignment.studentCount * 100) : 0}%</span></div>) : <p className="text-muted">Create a class and assignment to see class signals here. No demo class is added automatically.</p>}</div></section>
  </main>;
}
