import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { AssignmentForm } from "@/components/teacher/assignment-form";
import { getTeacherClass } from "@/lib/teacher/repository";

export const metadata: Metadata = { title: "Create assignment" };
export default async function NewAssignmentPage({ params }: { params: Promise<{ classId: string }> }) { const { classId } = await params; const item = await getTeacherClass(classId); if (!item) notFound(); return <main id="main-content" className="mx-auto max-w-4xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10"><Breadcrumbs items={[{ label: "Classes", href: "/classes" }, { label: item.name, href: `/classes/${classId}` }, { label: "New assignment" }]} /><div className="mb-8"><p className="font-black text-[var(--coral)]">ASSIGNMENT CREATOR</p><h1 className="mt-2 text-4xl font-black tracking-tight">Set the next useful task</h1><p className="mt-3 text-lg leading-8 text-muted">Assign a topic or build a five-question timed test, with an optional due date.</p></div><AssignmentForm classId={classId} /></main>; }
