import { NextResponse } from "next/server";
import { requireTeacher } from "@/lib/teacher/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params; const actor = await requireTeacher(); const body = await request.json() as { archived?: boolean };
  if (!actor) return NextResponse.json({ error: "A teacher account is required." }, { status: 403 });
  if (!actor.demo) {
    const { data, error } = await actor.supabase.from("classes").update({ archived_at: body.archived ? new Date().toISOString() : null }).eq("id", classId).eq("teacher_id", actor.userId).select("id").maybeSingle();
    if (error || !data) return NextResponse.json({ error: "The class could not be updated." }, { status: 404 });
  }
  return NextResponse.json({ archived: Boolean(body.archived) });
}
