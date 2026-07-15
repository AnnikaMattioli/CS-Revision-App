import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/teacher/auth";

export async function DELETE(_: Request, { params }: { params: Promise<{ classId: string; studentId: string }> }) {
  const { classId, studentId } = await params; const actor = await requireTeacher();
  if (!actor) return NextResponse.json({ error: "A teacher account is required." }, { status: 403 });
  if (!actor.demo) {
    const { data: owned } = await actor.supabase.from("classes").select("id").eq("id", classId).eq("teacher_id", actor.userId).maybeSingle();
    if (!owned) return NextResponse.json({ error: "Class not found." }, { status: 404 });
    const { error } = await actor.supabase.from("class_memberships").update({ removed_at: new Date().toISOString() }).eq("class_id", classId).eq("student_id", studentId);
    if (error) return NextResponse.json({ error: "The student could not be removed." }, { status: 500 });
  }
  return NextResponse.json({ removed: true });
}
