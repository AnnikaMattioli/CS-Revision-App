import { NextResponse } from "next/server";
import { z } from "zod";
import { questionBank } from "@/lib/practice/question-bank";
import { markQuestion } from "@/lib/practice/marking";
import type { PracticeAnswer, PracticeResult } from "@/types/practice";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const answerSchema = z.union([z.string(), z.array(z.string()), z.record(z.string(), z.string()), z.null()]);
const databaseId = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
const submissionSchema = z.object({ attemptId: z.string().min(1).max(100), questionIds: z.array(databaseId).min(1).max(10), answers: z.record(z.string(), answerSchema), durationSeconds: z.number().int().min(0).max(86400) });

export async function POST(request: Request) {
  const parsed = submissionSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  const selected = parsed.data.questionIds.map((id) => questionBank.find((question) => question.id === id)).filter((question) => question !== undefined);
  if (selected.length !== parsed.data.questionIds.length) return NextResponse.json({ error: "Question set is invalid." }, { status: 400 });
  const results = selected.map((question) => markQuestion(question, (parsed.data.answers[question.id] ?? null) as PracticeAnswer));
  const score = results.reduce((total, result) => total + result.marksAwarded, 0); const availableMarks = results.reduce((total, result) => total + result.marksAvailable, 0);
  const response: PracticeResult = { attemptId: parsed.data.attemptId, submittedAt: new Date().toISOString(), durationSeconds: parsed.data.durationSeconds, score, availableMarks, percentage: availableMarks ? Math.round((score / availableMarks) * 100) : 0, results };
  if (!parsed.data.attemptId.startsWith("demo-") && !parsed.data.attemptId.startsWith("retry-")) {
    try {
      const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
      const { data: attempt } = await supabase.from("attempts").select("id,practice_set_id").eq("id", parsed.data.attemptId).eq("user_id", user.id).eq("status", "in_progress").maybeSingle(); if (!attempt) return NextResponse.json({ error: "Attempt is no longer open." }, { status: 409 });
      const { data: setQuestions } = await supabase.from("practice_set_questions").select("question_id").eq("practice_set_id", attempt.practice_set_id);
      const allowed = new Set((setQuestions ?? []).map((item) => item.question_id));
      if (parsed.data.questionIds.some((id) => !allowed.has(id))) return NextResponse.json({ error: "Questions do not belong to this attempt." }, { status: 403 });
      const rows = parsed.data.questionIds.map((questionId) => ({ attempt_id: parsed.data.attemptId, question_id: questionId, answer: parsed.data.answers[questionId] ?? null, flagged: false }));
      const { data: saved, error: saveError } = await supabase.from("attempt_answers").upsert(rows, { onConflict: "attempt_id,question_id" }).select("id,question_id"); if (saveError || !saved) return NextResponse.json({ error: "Answers could not be saved." }, { status: 500 });
      const answerIds = new Map(saved.map((row) => [row.question_id, row.id])); const admin = createAdminClient();
      const { error: markError } = await admin.from("marking_results").insert(results.map((item) => ({ attempt_answer_id: answerIds.get(item.question.id)!, marks_awarded: item.marksAwarded, feedback: item, rubric_evidence: item.earnedConcepts, marked_by: "deterministic" }))); if (markError) return NextResponse.json({ error: "Marking results could not be stored." }, { status: 500 });
      const { error: attemptError } = await admin.from("attempts").update({ status: "marked", submitted_at: response.submittedAt, marked_at: response.submittedAt, score, available_marks: availableMarks, duration_seconds: parsed.data.durationSeconds }).eq("id", parsed.data.attemptId).eq("user_id", user.id); if (attemptError) return NextResponse.json({ error: "Attempt could not be finalised." }, { status: 500 });
    } catch { return NextResponse.json({ error: "Trusted marking is not configured." }, { status: 503 }); }
  }
  return NextResponse.json(response, { headers: { "cache-control": "private, no-store" } });
}
