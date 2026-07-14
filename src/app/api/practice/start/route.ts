import { NextResponse } from "next/server";
import { z } from "zod";
import { hasSupabaseConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({ topic: z.string().max(80), difficulty: z.string().max(40), timer: z.string().max(20) });
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid settings." }, { status: 400 });
  if (!hasSupabaseConfig()) return NextResponse.json({ attemptId: `demo-${Date.now()}` });
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { data: enrolment } = await supabase.from("user_course_enrolments").select("course_id").eq("user_id", user.id).eq("is_active", true).maybeSingle(); const courseId = enrolment?.course_id ?? "10000000-0000-0000-0000-000000000001";
  const { data: questions } = await supabase.from("questions").select("id").eq("status", "published").is("archived_at", null).limit(10); if (!questions?.length) return NextResponse.json({ error: "No questions are published." }, { status: 409 });
  const seconds = parsed.data.timer === "untimed" ? null : Number(parsed.data.timer) * 60;
  const { data: set, error: setError } = await supabase.from("practice_sets").insert({ owner_id: user.id, course_id: courseId, title: "Student practice set", mode: "practice", time_limit_seconds: seconds }).select("id").single(); if (setError || !set) return NextResponse.json({ error: "Set could not be created." }, { status: 500 });
  const { error: linkError } = await supabase.from("practice_set_questions").insert(questions.map((question, index) => ({ practice_set_id: set.id, question_id: question.id, sort_order: index + 1 }))); if (linkError) return NextResponse.json({ error: "Questions could not be selected." }, { status: 500 });
  const { data: attempt, error: attemptError } = await supabase.from("attempts").insert({ user_id: user.id, practice_set_id: set.id }).select("id").single(); if (attemptError || !attempt) return NextResponse.json({ error: "Attempt could not be created." }, { status: 500 });
  return NextResponse.json({ attemptId: attempt.id });
}
