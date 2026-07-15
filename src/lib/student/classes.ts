import "server-only";
import { hasSupabaseConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type StudentClass = {
  id: string;
  name: string;
  courseTitle: string;
  assignments: Array<{ id: string; title: string; instructions: string; dueAt?: string; status: string }>;
};

export async function getStudentClasses(): Promise<StudentClass[]> {
  if (!hasSupabaseConfig()) return [];
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: memberships } = await supabase.from("class_memberships").select("class_id").eq("student_id", user.id).is("removed_at", null);
  const ids = (memberships ?? []).map((item) => item.class_id);
  if (!ids.length) return [];
  const { data: classes } = await supabase.from("classes").select("id,name,course_id").in("id", ids).is("archived_at", null);
  if (!classes?.length) return [];
  const courseIds = classes.flatMap((item) => item.course_id ? [item.course_id] : []);
  const [{ data: courses }, { data: assignments }] = await Promise.all([
    courseIds.length ? supabase.from("courses").select("id,title").in("id", courseIds) : Promise.resolve({ data: [] }),
    supabase.from("assignments").select("id,class_id,title,instructions,due_at,status").in("class_id", ids).eq("status", "published").order("due_at", { ascending: true }),
  ]);
  return classes.map((item) => ({
    id: item.id,
    name: item.name,
    courseTitle: courses?.find((course) => course.id === item.course_id)?.title ?? "Computer Science",
    assignments: (assignments ?? []).filter((assignment) => assignment.class_id === item.id).map((assignment) => ({ id: assignment.id, title: assignment.title, instructions: assignment.instructions, dueAt: assignment.due_at ?? undefined, status: assignment.status })),
  }));
}

export async function getStudentClass(classId: string) {
  return (await getStudentClasses()).find((item) => item.id === classId) ?? null;
}
