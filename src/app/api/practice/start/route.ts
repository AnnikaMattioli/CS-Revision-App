import { NextResponse } from "next/server";
import { z } from "zod";
import { hasSupabaseConfig } from "@/lib/env";
import { questionBank } from "@/lib/practice/question-bank";
import { selectAdaptiveQuestions, type QuestionHistory } from "@/lib/progress/adaptive";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/security/rate-limit";

const schema = z.object({ topic: z.string().max(80), difficulty: z.string().max(40), timer: z.string().max(20), mode: z.enum(["adaptive", "weak", "unseen", "all"]).default("adaptive") });
export async function POST(request: Request) {
  const limited = rateLimit(request, "practice-start", { limit: 60, windowMs: 60_000 }); if (limited) return limited;
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid settings." }, { status: 400 });
  const candidates = questionBank.map(({ id, topicSlug, difficulty }) => ({ id, topicSlug, difficulty }));
  const demoMastery = Object.fromEntries([...new Set(candidates.map((candidate) => candidate.topicSlug))].map((slug) => [slug, 0]));
  const select = (mastery: Record<string, number>, history: QuestionHistory[] = []) => {
    const scopedCandidates = parsed.data.topic === "mixed" ? candidates : candidates.filter((candidate) => candidate.topicSlug === parsed.data.topic);
    const chosen = selectAdaptiveQuestions({ candidates: scopedCandidates, topicMastery: mastery, history, count: 10, currentTopic: parsed.data.topic === "mixed" ? undefined : parsed.data.topic });
    let ordered: Array<{ id: string; topicSlug: string; difficulty: string }> = parsed.data.mode === "all" ? scopedCandidates.slice(0, 10) : parsed.data.mode === "unseen" ? [...chosen].sort((a, b) => (history.find((item) => item.questionId === a.id)?.seenCount ?? 0) - (history.find((item) => item.questionId === b.id)?.seenCount ?? 0)) : chosen;
    if (parsed.data.difficulty !== "mixed") ordered = [...ordered].sort((a, b) => Number(b.difficulty === parsed.data.difficulty) - Number(a.difficulty === parsed.data.difficulty));
    if (parsed.data.topic !== "mixed") ordered = [...ordered].sort((a, b) => Number(b.topicSlug === parsed.data.topic) - Number(a.topicSlug === parsed.data.topic));
    return ordered.map((item) => item.id);
  };
  if (!hasSupabaseConfig()) return NextResponse.json({ attemptId: `demo-${Date.now()}`, questionIds: select(demoMastery) });
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { data: enrolment } = await supabase.from("user_course_enrolments").select("course_id").eq("user_id", user.id).eq("is_active", true).maybeSingle(); const courseId = enrolment?.course_id ?? "10000000-0000-0000-0000-000000000001";
  const { data: masteryRows } = await supabase.from("topic_mastery").select("topic_id,mastery_score").eq("user_id", user.id);
  const { data: sections } = await supabase.from("specification_sections").select("id").eq("course_id", courseId);
  const { data: topicRows } = sections?.length ? await supabase.from("topics").select("id,slug").in("specification_section_id", sections.map((section) => section.id)) : { data: [] };
  const topicById: Record<string, string> = Object.fromEntries((topicRows ?? []).map((topic) => [topic.id, topic.slug]));
  const mastery = Object.fromEntries((masteryRows ?? []).map((row) => [topicById[row.topic_id], Number(row.mastery_score)]).filter(([slug]) => Boolean(slug)));
  const { data: attempts } = await supabase.from("attempts").select("id").eq("user_id", user.id).order("started_at", { ascending: false }).limit(20);
  const attemptIds = (attempts ?? []).map((item) => item.id);
  const { data: answerRows } = attemptIds.length ? await supabase.from("attempt_answers").select("id,question_id,saved_at").in("attempt_id", attemptIds) : { data: [] };
  const answerIds = (answerRows ?? []).map((item) => item.id);
  const { data: markRows } = answerIds.length ? await supabase.from("marking_results").select("attempt_answer_id,feedback").in("attempt_answer_id", answerIds) : { data: [] };
  const marks = new Map((markRows ?? []).map((item) => [item.attempt_answer_id, item.feedback.status !== "correct"]));
  const now = Date.now(); const historyByQuestion = new Map<string, QuestionHistory>();
  (answerRows ?? []).forEach((item) => { const daysAgo = Math.max(0, Math.floor((now - new Date(item.saved_at).getTime()) / 86400000)); const current = historyByQuestion.get(item.question_id); historyByQuestion.set(item.question_id, { questionId: item.question_id, seenCount: (current?.seenCount ?? 0) + 1, lastSeenDaysAgo: Math.min(current?.lastSeenDaysAgo ?? Number.POSITIVE_INFINITY, daysAgo), recentlyIncorrect: Boolean(current?.recentlyIncorrect || marks.get(item.id)) }); });
  const history = [...historyByQuestion.values()];
  const questionIds = select({ ...demoMastery, ...mastery }, history);
  const { data: questions } = await supabase.from("questions").select("id").in("id", questionIds).eq("status", "published").is("archived_at", null); if (!questions?.length) return NextResponse.json({ error: "No questions are published." }, { status: 409 });
  const seconds = parsed.data.timer === "untimed" ? null : Number(parsed.data.timer) * 60;
  const { data: set, error: setError } = await supabase.from("practice_sets").insert({ owner_id: user.id, course_id: courseId, title: "Student practice set", mode: "practice", time_limit_seconds: seconds }).select("id").single(); if (setError || !set) return NextResponse.json({ error: "Set could not be created." }, { status: 500 });
  const orderedIds = questionIds.filter((id) => questions.some((question) => question.id === id));
  const { error: linkError } = await supabase.from("practice_set_questions").insert(orderedIds.map((questionId, index) => ({ practice_set_id: set.id, question_id: questionId, sort_order: index + 1 }))); if (linkError) return NextResponse.json({ error: "Questions could not be selected." }, { status: 500 });
  const { data: attempt, error: attemptError } = await supabase.from("attempts").insert({ user_id: user.id, practice_set_id: set.id }).select("id").single(); if (attemptError || !attempt) return NextResponse.json({ error: "Attempt could not be created." }, { status: 500 });
  return NextResponse.json({ attemptId: attempt.id, questionIds: orderedIds });
}
