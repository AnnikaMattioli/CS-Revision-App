import { NextResponse } from "next/server";
import { z } from "zod";
import { questionBank } from "@/lib/practice/question-bank";
import { markQuestion } from "@/lib/practice/marking";
import { calculateMastery } from "@/lib/progress/mastery";
import type { PracticeAnswer, PracticeResult } from "@/types/practice";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/security/rate-limit";
import { hasSupabaseConfig } from "@/lib/env";
import { demoAttemptAllowed, hasDemoAttemptPrefix } from "@/lib/security/boundaries";

const answerSchema = z.union([z.string(), z.array(z.string()), z.record(z.string(), z.string()), z.null()]);
const databaseId = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
const submissionSchema = z.object({ attemptId: z.string().min(1).max(100), questionIds: z.array(databaseId).min(1).max(10), answers: z.record(z.string(), answerSchema), durationSeconds: z.number().int().min(0).max(86400) });

export async function POST(request: Request) {
  const limited = rateLimit(request, "practice-submit", { limit: 40, windowMs: 60_000 }); if (limited) return limited;
  const parsed = submissionSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  const configured = hasSupabaseConfig();
  if (hasDemoAttemptPrefix(parsed.data.attemptId) && !demoAttemptAllowed(parsed.data.attemptId, configured)) return NextResponse.json({ error: "Demo attempts are disabled in this deployment." }, { status: 403 });
  const selected = parsed.data.questionIds.map((id) => questionBank.find((question) => question.id === id)).filter((question) => question !== undefined);
  if (selected.length !== parsed.data.questionIds.length) return NextResponse.json({ error: "Question set is invalid." }, { status: 400 });
  const results = selected.map((question) => markQuestion(question, (parsed.data.answers[question.id] ?? null) as PracticeAnswer));
  const score = results.reduce((total, result) => total + result.marksAwarded, 0); const availableMarks = results.reduce((total, result) => total + result.marksAvailable, 0);
  const topicGroups = new Map<string, typeof results>();
  results.forEach((result) => topicGroups.set(result.question.topicSlug, [...(topicGroups.get(result.question.topicSlug) ?? []), result]));
  const demoScores: Record<string, number> = { "systems-architecture": 0, "memory-and-storage": 0, "networks-and-protocols": 0 };
  const masteryUpdates = [...topicGroups.entries()].map(([topicSlug, items]) => {
    const previousScore = demoScores[topicSlug] ?? 0;
    const calculation = calculateMastery(previousScore, previousScore ? 12 : 0, items.map((item) => ({ marksAwarded: item.marksAwarded, marksAvailable: item.marksAvailable, difficulty: item.question.difficulty })));
    return { topicSlug, topicTitle: items[0].question.topicTitle, previousScore, score: calculation.score, label: calculation.label, change: calculation.score - previousScore };
  });
  const response: PracticeResult = { attemptId: parsed.data.attemptId, submittedAt: new Date().toISOString(), durationSeconds: parsed.data.durationSeconds, score, availableMarks, percentage: availableMarks ? Math.round((score / availableMarks) * 100) : 0, results, masteryUpdates };
  if (!demoAttemptAllowed(parsed.data.attemptId, configured)) {
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
      const { data: practiceSet } = await admin.from("practice_sets").select("course_id").eq("id", attempt.practice_set_id).single();
      const { data: sectionRows } = practiceSet ? await admin.from("specification_sections").select("id").eq("course_id", practiceSet.course_id) : { data: [] };
      const { data: topicRows } = sectionRows?.length ? await admin.from("topics").select("id,slug").in("specification_section_id", sectionRows.map((section) => section.id)) : { data: [] };
      const topicIds: Record<string, string> = Object.fromEntries((topicRows ?? []).map((topic) => [topic.slug, topic.id]));
      if ([...topicGroups.keys()].some((slug) => !topicIds[slug])) return NextResponse.json({ error: "Course topics could not be matched to this attempt." }, { status: 500 });
      const { data: existingMastery } = await admin.from("topic_mastery").select("topic_id,mastery_score,questions_seen").eq("user_id", user.id);
      const existingByTopic = new Map((existingMastery ?? []).map((item) => [item.topic_id, item]));
      response.masteryUpdates = [...topicGroups.entries()].map(([topicSlug, items]) => {
        const topicId = topicIds[topicSlug]; const existing = existingByTopic.get(topicId); const previousScore = Number(existing?.mastery_score ?? 0);
        const calculation = calculateMastery(previousScore, existing?.questions_seen ?? 0, items.map((item) => ({ marksAwarded: item.marksAwarded, marksAvailable: item.marksAvailable, difficulty: item.question.difficulty })));
        return { topicSlug, topicTitle: items[0].question.topicTitle, previousScore, score: calculation.score, label: calculation.label, change: calculation.score - previousScore };
      });
      const masteryRows = response.masteryUpdates.map((update) => {
        const calculation = calculateMastery(update.previousScore, existingByTopic.get(topicIds[update.topicSlug])?.questions_seen ?? 0, topicGroups.get(update.topicSlug)!.map((item) => ({ marksAwarded: item.marksAwarded, marksAvailable: item.marksAvailable, difficulty: item.question.difficulty })));
        const confidence = (calculation.label === "Not started" ? "new" : calculation.label.toLowerCase()) as "new" | "beginning" | "developing" | "secure" | "mastered";
        return { user_id: user.id, topic_id: topicIds[update.topicSlug], mastery_score: calculation.score, confidence, questions_seen: calculation.questionsSeen, accuracy_score: calculation.accuracy, trend: calculation.trend, explanation: calculation.explanation, updated_at: response.submittedAt };
      });
      const { error: masteryError } = await admin.from("topic_mastery").upsert(masteryRows, { onConflict: "user_id,topic_id" }); if (masteryError) return NextResponse.json({ error: "Mastery could not be updated." }, { status: 500 });
      const activityDate = response.submittedAt.slice(0, 10); const { data: activity } = await admin.from("study_activity_days").select("questions_answered,active_minutes").eq("user_id", user.id).eq("activity_date", activityDate).maybeSingle();
      await admin.from("study_activity_days").upsert({ user_id: user.id, activity_date: activityDate, questions_answered: (activity?.questions_answered ?? 0) + results.length, active_minutes: (activity?.active_minutes ?? 0) + Math.max(1, Math.round(parsed.data.durationSeconds / 60)) }, { onConflict: "user_id,activity_date" });
      const { data: completedAttempts } = await admin.from("attempts").select("id").eq("user_id", user.id).eq("status", "marked");
      const completedIds = (completedAttempts ?? []).map((item) => item.id); const { data: completedAnswers } = completedIds.length ? await admin.from("attempt_answers").select("id").in("attempt_id", completedIds) : { data: [] };
      const { data: activityDays } = await admin.from("study_activity_days").select("activity_date").eq("user_id", user.id).order("activity_date", { ascending: false }).limit(14);
      const daySet = new Set((activityDays ?? []).map((item) => item.activity_date)); let streak = 0; const cursor = new Date(`${activityDate}T12:00:00Z`); while (daySet.has(cursor.toISOString().slice(0, 10))) { streak += 1; cursor.setUTCDate(cursor.getUTCDate() - 1); }
      const earnedCodes = ["first-set", completedIds.length >= 10 && "ten-sets", (completedAnswers?.length ?? 0) >= 50 && "fifty-questions", masteryRows.some((item) => item.mastery_score >= 55) && "topic-secure", masteryRows.some((item) => item.mastery_score >= 75) && "mastery", streak >= 7 && "week-streak"].filter((item): item is string => Boolean(item));
      const { data: achievements } = await admin.from("achievements").select("id,code").in("code", earnedCodes); if (achievements?.length) await admin.from("user_achievements").upsert(achievements.map((item) => ({ user_id: user.id, achievement_id: item.id })), { onConflict: "user_id,achievement_id", ignoreDuplicates: true });
    } catch { return NextResponse.json({ error: "Trusted marking is not configured." }, { status: 503 }); }
  }
  return NextResponse.json(response, { headers: { "cache-control": "private, no-store" } });
}
