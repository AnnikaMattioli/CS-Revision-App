import "server-only";
import { demoClass, demoClasses, demoClassInsights } from "./demo-teacher";
import { demoCourse } from "@/lib/content/demo-content";
import { requireTeacher } from "./auth";
import type { ClassAssignment, ClassStudent, TeacherClass, TopicClassInsight } from "@/types/teacher";

const topicMap = new Map(demoCourse.topics.map((topic) => [topic.id, topic]));

export async function getTeacherClasses(): Promise<TeacherClass[]> {
  const actor = await requireTeacher(); if (!actor) return []; if (actor.demo) return demoClasses;
  const { data: rows } = await actor.supabase.from("classes").select("id,name,course_id,join_code_hint,archived_at").eq("teacher_id", actor.userId).order("created_at", { ascending: false });
  if (!rows?.length) return [];
  const result = await Promise.all(rows.map(async (row) => {
    const [{ count: studentCount }, { data: assignmentRows }, { data: course }] = await Promise.all([
      actor.supabase.from("class_memberships").select("student_id", { count: "exact", head: true }).eq("class_id", row.id).is("removed_at", null),
      actor.supabase.from("assignments").select("id,title,instructions,due_at,status").eq("class_id", row.id),
      row.course_id ? actor.supabase.from("courses").select("title").eq("id", row.course_id).maybeSingle() : Promise.resolve({ data: null }),
    ]);
    return { id: row.id, name: row.name, courseTitle: course?.title ?? "Computer Science", joinCodeHint: row.join_code_hint, archived: Boolean(row.archived_at), students: Array.from({ length: studentCount ?? 0 }, (_, i) => ({ id: `private-${i}`, displayName: "Class member", joinedAt: "", assignmentCompletion: 0, averageMastery: 0 })), assignments: (assignmentRows ?? []).map((a) => ({ id: a.id, title: a.title, instructions: a.instructions, targetType: "topic" as const, targetLabel: "Assigned content", dueAt: a.due_at ?? undefined, status: a.status, completedCount: 0, studentCount: studentCount ?? 0 })) };
  }));
  return result;
}

export async function getTeacherClass(classId: string): Promise<TeacherClass | null> {
  if (classId.startsWith("demo-")) return demoClass;
  const actor = await requireTeacher(); if (!actor || actor.demo) return null;
  const { data: row } = await actor.supabase.from("classes").select("id,name,course_id,join_code_hint,archived_at").eq("id", classId).eq("teacher_id", actor.userId).maybeSingle();
  if (!row) return null;
  const [{ data: people }, { data: assignmentRows }, { data: submissionRows }, { data: targetRows }, { data: course }] = await Promise.all([
    actor.supabase.rpc("teacher_class_students", { requested_class: classId }),
    actor.supabase.from("assignments").select("id,title,instructions,due_at,status").eq("class_id", classId).order("created_at", { ascending: false }),
    actor.supabase.from("assignment_submissions").select("assignment_id,student_id,submitted_at"),
    actor.supabase.from("assignment_targets").select("assignment_id,target_type,topic_id,practice_set_id"),
    row.course_id ? actor.supabase.from("courses").select("title").eq("id", row.course_id).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  const students: ClassStudent[] = (people ?? []).map((person) => ({ id: person.student_id, displayName: person.display_name, joinedAt: person.joined_at, assignmentCompletion: assignmentRows?.length ? Math.round((submissionRows ?? []).filter((s) => s.student_id === person.student_id).length / assignmentRows.length * 100) : 0, averageMastery: 0 }));
  const assignments: ClassAssignment[] = (assignmentRows ?? []).map((item) => { const target = (targetRows ?? []).find((t) => t.assignment_id === item.id); const topic = target?.topic_id ? topicMap.get(target.topic_id) : undefined; return { id: item.id, title: item.title, instructions: item.instructions, dueAt: item.due_at ?? undefined, status: item.status, targetType: target?.target_type ?? "topic", targetLabel: topic?.title ?? (target?.target_type === "practice_set" ? "Timed practice set" : "Course topic"), completedCount: (submissionRows ?? []).filter((s) => s.assignment_id === item.id).length, studentCount: students.length }; });
  return { id: row.id, name: row.name, courseTitle: course?.title ?? "Computer Science", joinCodeHint: row.join_code_hint, archived: Boolean(row.archived_at), students, assignments };
}

export async function getClassInsights(classId: string): Promise<TopicClassInsight[]> {
  if (classId.startsWith("demo-")) return demoClassInsights;
  const actor = await requireTeacher(); if (!actor || actor.demo) return [];
  const { data } = await actor.supabase.rpc("teacher_class_mastery", { requested_class: classId });
  return (data ?? []).map((row) => ({ topicId: row.topic_id, title: topicMap.get(row.topic_id)?.title ?? "Course topic", averageMastery: Math.round(Number(row.average_mastery)), secureStudents: Number(row.secure_students), studentCount: Number(row.student_count) }));
}

export async function getStudentMastery(classId: string, studentId: string) {
  if (classId.startsWith("demo-") && studentId.startsWith("demo-")) return demoClassInsights.map((topic, index) => ({ ...topic, averageMastery: [78, 61, 46][index], secureStudents: 0, studentCount: 1 }));
  const actor = await requireTeacher(); if (!actor || actor.demo) return [];
  const { data } = await actor.supabase.rpc("teacher_student_mastery", { requested_class: classId, requested_student: studentId });
  return (data ?? []).map((row) => ({ topicId: row.topic_id, title: topicMap.get(row.topic_id)?.title ?? "Course topic", averageMastery: Math.round(Number(row.mastery_score)), secureStudents: Number(row.mastery_score) >= 55 ? 1 : 0, studentCount: 1 }));
}
