import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/teacher/auth";
import { assignmentSchema } from "@/lib/teacher/validation";
import { questionBank } from "@/lib/practice/question-bank";

export async function POST(request: Request, { params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params; const parsed = assignmentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Check the assignment title, content and due date." }, { status: 400 });
  const actor = await requireTeacher(); if (!actor) return NextResponse.json({ error: "A teacher account is required." }, { status: 403 });
  if (actor.demo) return NextResponse.json({ assignmentId: `demo-assignment-${Date.now()}` }, { status: 201 });
  const { data: owned } = await actor.supabase.from("classes").select("id,course_id").eq("id", classId).eq("teacher_id", actor.userId).maybeSingle();
  if (!owned) return NextResponse.json({ error: "Class not found." }, { status: 404 });
  let practiceSetId = parsed.data.practiceSetId;
  if (parsed.data.targetType === "practice_set" && !practiceSetId) {
    if (!owned.course_id) return NextResponse.json({ error: "Choose a course for this class before assigning a timed test." }, { status: 400 });
    const { data: available } = await actor.supabase.from("questions").select("id").in("id", questionBank.slice(0, 5).map((q) => q.id)).eq("status", "published");
    if (!available?.length) return NextResponse.json({ error: "No published questions are available for a timed test." }, { status: 409 });
    const { data: paper, error: paperError } = await actor.supabase.from("practice_sets").insert({ owner_id: actor.userId, course_id: owned.course_id, title: parsed.data.title, mode: "exam", exam_kind: "teacher_assignment", time_limit_seconds: (parsed.data.timeLimitMinutes ?? 15) * 60, configuration: { source: "teacher_assignment", questionCount: available.length } }).select("id").single();
    if (paperError || !paper) return NextResponse.json({ error: "The timed test could not be prepared." }, { status: 500 });
    const { error: questionsError } = await actor.supabase.from("practice_set_questions").insert(available.map((q, index) => ({ practice_set_id: paper.id, question_id: q.id, sort_order: index + 1 })));
    if (questionsError) return NextResponse.json({ error: "The timed test questions could not be linked." }, { status: 500 });
    practiceSetId = paper.id;
  }
  const { data: assignment, error } = await actor.supabase.from("assignments").insert({ class_id: classId, title: parsed.data.title, instructions: parsed.data.instructions, due_at: parsed.data.dueAt, status: parsed.data.status }).select("id").single();
  if (error || !assignment) return NextResponse.json({ error: "The assignment could not be created." }, { status: 500 });
  const target: { assignment_id: string; target_type: "topic" | "practice_set"; topic_id?: string | null; practice_set_id?: string | null } = parsed.data.targetType === "topic" ? { assignment_id: assignment.id, target_type: "topic", topic_id: parsed.data.topicId ?? null } : { assignment_id: assignment.id, target_type: "practice_set", practice_set_id: practiceSetId ?? null };
  const { error: targetError } = await actor.supabase.from("assignment_targets").insert(target);
  if (targetError) { await actor.supabase.from("assignments").delete().eq("id", assignment.id); return NextResponse.json({ error: "The assignment content could not be linked." }, { status: 500 }); }
  return NextResponse.json({ assignmentId: assignment.id }, { status: 201 });
}
