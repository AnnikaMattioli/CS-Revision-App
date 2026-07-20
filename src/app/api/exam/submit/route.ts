import { NextResponse } from "next/server";
import { z } from "zod";
import { POST as submitPractice } from "@/app/api/practice/submit/route";
import { hasSupabaseConfig } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ExamConfig, ExamResult } from "@/types/exam";
import type { PracticeResult } from "@/types/practice";
import { rateLimit } from "@/lib/security/rate-limit";
import { demoAttemptAllowed, hasDemoAttemptPrefix } from "@/lib/security/boundaries";

const databaseId = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i); const answer = z.union([z.string(), z.array(z.string()), z.record(z.string(), z.string()), z.null()]);
const configSchema = z.object({ kind: z.enum(["topic", "mixed", "custom", "full_mock", "assignment"]), qualification: z.string(), examBoard: z.string(), topic: z.string(), paper: z.enum(["paper1", "paper2"]).optional(), questionCount: z.number(), difficulty: z.string(), timeLimitMinutes: z.number(), allowBackwards: z.boolean(), warnUnanswered: z.boolean(), resultsRelease: z.enum(["immediate", "later"]) });
const schema = z.object({ attemptId: z.string().min(1).max(100), questionIds: z.array(databaseId).min(1).max(10), answers: z.record(z.string(), answer), durationSeconds: z.number().int().min(0).max(86400), autoSubmitted: z.boolean(), questionTimings: z.record(z.string(), z.number().int().min(0).max(86400)), resultsRelease: z.enum(["immediate", "later"]), config: configSchema });

export async function POST(request: Request) {
  const limited = rateLimit(request, "exam-submit", { limit: 20, windowMs: 60_000 }); if (limited) return limited;
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid exam submission." }, { status: 400 });
  const data = parsed.data; const configured = hasSupabaseConfig(); const demo = demoAttemptAllowed(data.attemptId, configured); if(hasDemoAttemptPrefix(data.attemptId)&&!demo)return NextResponse.json({error:"Demo attempts are disabled in this deployment."},{status:403}); let release = data.resultsRelease; let trustedConfig: ExamConfig = data.config; let autoSubmitted = data.autoSubmitted;
  if (!demo && hasSupabaseConfig()) {
    const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    const { data: attempt } = await supabase.from("attempts").select("practice_set_id,deadline_at").eq("id", data.attemptId).eq("user_id", user.id).eq("status", "in_progress").maybeSingle(); if (!attempt) return NextResponse.json({ error: "Exam is no longer open." }, { status: 409 });
    const { data: paper } = await supabase.from("practice_sets").select("results_release,configuration").eq("id", attempt.practice_set_id).eq("mode", "exam").single(); if (!paper) return NextResponse.json({ error: "Exam configuration was not found." }, { status: 404 });
    release = paper.results_release as "immediate" | "later"; trustedConfig = paper.configuration as ExamConfig; autoSubmitted = autoSubmitted || Boolean(attempt.deadline_at && new Date(attempt.deadline_at).getTime() <= Date.now());
  }
  const boundedDuration = Math.min(data.durationSeconds, trustedConfig.timeLimitMinutes * 60);
  const markingRequest = new Request(request.url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ attemptId: data.attemptId, questionIds: data.questionIds, answers: data.answers, durationSeconds: boundedDuration }) });
  const markedResponse = await submitPractice(markingRequest); if (!markedResponse.ok) return markedResponse; const marked = await markedResponse.json() as PracticeResult;
  if (!demo) {
    const admin = createAdminClient(); const timingRows = data.questionIds.map((questionId) => ({ attempt_id: data.attemptId, question_id: questionId, seconds_spent: data.questionTimings[questionId] ?? 0 })); await admin.from("exam_question_timings").upsert(timingRows, { onConflict: "attempt_id,question_id" }); await admin.from("attempts").update({ auto_submitted: autoSubmitted }).eq("id", data.attemptId);
    const { data: badge } = await admin.from("achievements").select("id").eq("code", "first-exam").maybeSingle(); const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (badge && user) await admin.from("user_achievements").upsert({ user_id: user.id, achievement_id: badge.id }, { onConflict: "user_id,achievement_id", ignoreDuplicates: true });
  }
  if (release === "later") return NextResponse.json({ attemptId: data.attemptId, pending: true, submittedAt: marked.submittedAt, message: "Your answers were saved and marked. Results will appear when they are released." }, { headers: { "cache-control": "private, no-store" } });
  const result: ExamResult = { ...marked, durationSeconds: boundedDuration, exam: true, autoSubmitted, questionTimings: data.questionTimings, config: trustedConfig }; return NextResponse.json(result, { headers: { "cache-control": "private, no-store" } });
}
