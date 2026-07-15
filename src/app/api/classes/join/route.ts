import { NextResponse } from "next/server";
import { hasSupabaseConfig } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { hashClassCode, normalizeClassCode } from "@/lib/teacher/class-codes";
import { joinClassSchema } from "@/lib/teacher/validation";

const genericError = "That joining code is invalid or no longer active.";
export async function POST(request: Request) {
  const parsed = joinClassSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: genericError }, { status: 400 });
  if (!hasSupabaseConfig()) return normalizeClassCode(parsed.data.code) === "DEMO42" ? NextResponse.json({ classId: "demo-class-1", className: "Year 10 Computer Science" }) : NextResponse.json({ error: genericError }, { status: 404 });
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in before joining a class." }, { status: 401 });
  const admin = createAdminClient();
  const { data: found } = await admin.from("classes").select("id,name").eq("join_code_hash", hashClassCode(parsed.data.code)).is("archived_at", null).maybeSingle();
  if (!found) return NextResponse.json({ error: genericError }, { status: 404 });
  const { error } = await admin.from("class_memberships").upsert({ class_id: found.id, student_id: user.id, removed_at: null }, { onConflict: "class_id,student_id" });
  if (error) return NextResponse.json({ error: "The class could not be joined." }, { status: 500 });
  return NextResponse.json({ classId: found.id, className: found.name }, { headers: { "cache-control": "private, no-store" } });
}
