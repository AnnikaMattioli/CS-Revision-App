import { NextResponse } from "next/server";
import { z } from "zod";
import { hasSupabaseConfig } from "@/lib/env";
import { questionBank } from "@/lib/practice/question-bank";
import { selectOcrGcseFullPaper } from "@/lib/practice/full-paper";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/security/rate-limit";

const schema = z.object({ kind: z.enum(["topic", "mixed", "custom", "full_mock", "assignment"]), qualification: z.literal("GCSE"), examBoard: z.literal("OCR"), topic: z.string().max(80), paper: z.enum(["paper1", "paper2"]).optional(), questionCount: z.number().int().min(1).max(20), difficulty: z.string().max(30), timeLimitMinutes: z.number().int().min(1).max(180), allowBackwards: z.boolean(), warnUnanswered: z.boolean(), resultsRelease: z.enum(["immediate", "later"]) });
export async function POST(request: Request) {
  const limited = rateLimit(request, "exam-start", { limit: 20, windowMs: 60_000 }); if (limited) return limited;
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid exam configuration." }, { status: 400 }); let config = parsed.data;
  if (config.kind === "full_mock") config = { ...config, paper: config.paper ?? "paper1", timeLimitMinutes: 90 };
  if (config.kind === "full_mock") {
    const paperQuestions = selectOcrGcseFullPaper(questionBank, config.paper ?? "paper1");
    const questionIds = paperQuestions.map((question) => question.id);
    config = { ...config, questionCount: questionIds.length };
    return startAttempt(config, questionIds);
  }
  let ordered = questionBank.map((question) => ({ id: question.id, topic: question.topicSlug, difficulty: question.difficulty }));
  if (config.difficulty !== "mixed") ordered = [...ordered].sort((a, b) => Number(b.difficulty === config.difficulty) - Number(a.difficulty === config.difficulty));
  if (config.kind === "topic" && config.topic !== "mixed") ordered = ordered.filter((question) => question.topic === config.topic);
  const questionIds = ordered.slice(0, config.questionCount).map((item) => item.id);
  return startAttempt(config, questionIds);
}

async function startAttempt(config: z.infer<typeof schema>, questionIds: string[]) {
  if (!hasSupabaseConfig()) return NextResponse.json({ attemptId: `exam-demo-${Date.now()}`, questionIds, config });
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { data: enrolment } = await supabase.from("user_course_enrolments").select("course_id").eq("user_id", user.id).eq("is_active", true).maybeSingle(); const courseId = enrolment?.course_id ?? "10000000-0000-0000-0000-000000000001";
  const { data: paper, error: paperError } = await supabase.from("practice_sets").insert({ owner_id: user.id, course_id: courseId, title: config.kind === "full_mock" ? `OCR GCSE ${config.paper === "paper2" ? "Paper 2" : "Paper 1"}` : "Timed exam practice", mode: "exam", time_limit_seconds: config.timeLimitMinutes * 60, exam_kind: config.kind, allow_backwards: config.allowBackwards, warn_unanswered: config.warnUnanswered, results_release: config.resultsRelease, configuration: config }).select("id").single(); if (paperError || !paper) return NextResponse.json({ error: "Exam paper could not be created." }, { status: 500 });
  const { error: linksError } = await supabase.from("practice_set_questions").insert(questionIds.map((questionId, index) => ({ practice_set_id: paper.id, question_id: questionId, sort_order: index + 1 }))); if (linksError) return NextResponse.json({ error: "Exam questions could not be selected." }, { status: 500 });
  const deadline = new Date(Date.now() + config.timeLimitMinutes * 60000).toISOString(); const { data: attempt, error: attemptError } = await supabase.from("attempts").insert({ user_id: user.id, practice_set_id: paper.id, deadline_at: deadline }).select("id").single(); if (attemptError || !attempt) return NextResponse.json({ error: "Exam attempt could not be started." }, { status: 500 });
  return NextResponse.json({ attemptId: attempt.id, questionIds, config });
}
