import { NextResponse } from "next/server";
import { classCodeHint, generateClassCode, hashClassCode } from "@/lib/teacher/class-codes";
import { requireTeacher } from "@/lib/teacher/auth";

export async function POST(_: Request, { params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params; const actor = await requireTeacher();
  if (!actor) return NextResponse.json({ error: "A teacher account is required." }, { status: 403 });
  const code = actor.demo ? "FRESH7" : generateClassCode();
  if (!actor.demo) {
    const { data, error } = await actor.supabase.from("classes").update({ join_code_hash: hashClassCode(code), join_code_hint: classCodeHint(code), join_code_rotated_at: new Date().toISOString() }).eq("id", classId).eq("teacher_id", actor.userId).select("id").maybeSingle();
    if (error || !data) return NextResponse.json({ error: "The joining code could not be rotated." }, { status: 404 });
  }
  return NextResponse.json({ joinCode: code }, { headers: { "cache-control": "private, no-store" } });
}
