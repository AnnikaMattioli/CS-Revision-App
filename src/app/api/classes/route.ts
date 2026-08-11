import { NextResponse } from "next/server";
import { classCodeHint, generateClassCode, hashClassCode } from "@/lib/teacher/class-codes";
import { requireTeacher } from "@/lib/teacher/auth";
import { classSchema } from "@/lib/teacher/validation";
import { FeatureAccessError, requireEntitlement, requireResourceCapacity } from "@/lib/billing/server";

export async function POST(request: Request) {
  const parsed = classSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Enter a class name between 2 and 80 characters." }, { status: 400 });
  const actor = await requireTeacher();
  if (!actor) return NextResponse.json({ error: "A teacher account is required." }, { status: 403 });
  try {
    await requireEntitlement(actor.userId, "teacher.create_classes");
    if (!actor.demo) {
      const { count } = await actor.supabase.from("classes").select("id", { count: "exact", head: true }).eq("teacher_id", actor.userId).is("archived_at", null);
      await requireResourceCapacity(actor.userId, "teacher.max_active_classes", count ?? 0);
    }
  } catch (error) {
    if (error instanceof FeatureAccessError) return NextResponse.json({ error: error.message, code: error.code, upgradePlan: "teacher_pro" }, { status: 403 });
    throw error;
  }
  const code = actor.demo ? "DEMO42" : generateClassCode();
  if (actor.demo) return NextResponse.json({ class: { id: `demo-class-${Date.now()}`, name: parsed.data.name, courseTitle: "OCR GCSE Computer Science", studentCount: 0 }, joinCode: code });
  const { data: enrolment } = await actor.supabase.from("user_course_enrolments").select("course_id").eq("user_id", actor.userId).eq("is_active", true).maybeSingle();
  if (!enrolment) return NextResponse.json({ error: "Choose the course you teach in account setup before creating a class." }, { status: 400 });
  const { data, error } = await actor.supabase.from("classes").insert({ teacher_id: actor.userId, course_id: enrolment.course_id, name: parsed.data.name, join_code_hash: hashClassCode(code), join_code_hint: classCodeHint(code) }).select("id,name,join_code_hint").single();
  if (error || !data) return NextResponse.json({ error: "The class could not be created." }, { status: 500 });
  return NextResponse.json({ class: data, joinCode: code }, { status: 201, headers: { "cache-control": "private, no-store" } });
}
