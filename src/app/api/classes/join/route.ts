import { NextResponse } from "next/server";
import { hasSupabaseConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { hashClassCode, normalizeClassCode } from "@/lib/teacher/class-codes";
import { joinClassSchema } from "@/lib/teacher/validation";
import { rateLimit } from "@/lib/security/rate-limit";

const genericError = "That joining code is invalid or no longer active.";
export async function POST(request: Request) {
  const limited = rateLimit(request, "class-join", { limit: 12, windowMs: 10 * 60_000 }); if (limited) return limited;
  const parsed = joinClassSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: genericError }, { status: 400 });
  if (!hasSupabaseConfig()) return normalizeClassCode(parsed.data.code) === "DEMO42" ? NextResponse.json({ classId: "demo-class-1", className: "Year 10 Computer Science" }) : NextResponse.json({ error: genericError }, { status: 404 });
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in before joining a class." }, { status: 401 });
  const { data: studentRole } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "student").maybeSingle();
  if (!studentRole) return NextResponse.json({ error: "Only student accounts can join a class." }, { status: 403 });
  const { data: matches } = await supabase.rpc("join_class_by_hash", { requested_hash: hashClassCode(parsed.data.code) });
  const found = matches?.[0];
  if (!found) return NextResponse.json({ error: genericError }, { status: 404 });
  return NextResponse.json({ classId: found.class_id, className: found.class_name }, { headers: { "cache-control": "private, no-store" } });
}
