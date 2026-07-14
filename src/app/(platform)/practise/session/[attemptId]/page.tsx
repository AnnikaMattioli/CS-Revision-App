import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PracticeSession } from "@/components/practice/practice-session";
import { publicQuestions } from "@/lib/practice/question-bank";
import { createClient } from "@/lib/supabase/server";
import type { PublicQuestion } from "@/types/practice";

export const metadata: Metadata = { title: "Practice set" };
export default async function PracticeSessionPage({ params, searchParams }: { params: Promise<{ attemptId: string }>; searchParams: Promise<{ topic?: string; difficulty?: string; timer?: string; ids?: string }> }) {
  const { attemptId } = await params; const query = await searchParams; let questions: PublicQuestion[] = publicQuestions(); const persistent = !attemptId.startsWith("demo-") && !attemptId.startsWith("retry-");
  if (persistent) {
    const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
    if (user) { const { data: attempt } = await supabase.from("attempts").select("practice_set_id").eq("id", attemptId).eq("user_id", user.id).eq("status", "in_progress").maybeSingle(); if (attempt) { const { data: links } = await supabase.from("practice_set_questions").select("question_id,sort_order").eq("practice_set_id", attempt.practice_set_id).order("sort_order"); const ids = (links ?? []).map((link) => link.question_id); const { data: rows } = ids.length ? await supabase.from("questions").select("id,prompt").in("id", ids).eq("status", "published") : { data: [] }; const map = new Map((rows ?? []).map((row) => [row.id, row.prompt])); questions = ids.map((id) => map.get(id)).filter((item): item is PublicQuestion => Boolean(item)); } }
  }
  if (query.ids) { const byId = new Map(questions.map((question) => [question.id, question])); questions = query.ids.split(",").map((id) => byId.get(id)).filter((question): question is PublicQuestion => Boolean(question)); }
  else if (query.topic && query.topic !== "mixed") questions = [...questions].sort((a, b) => Number(b.topicSlug === query.topic) - Number(a.topicSlug === query.topic));
  if (query.difficulty && query.difficulty !== "mixed") questions = [...questions].sort((a, b) => Number(b.difficulty === query.difficulty) - Number(a.difficulty === query.difficulty));
  if (!questions.length) redirect("/practise");
  return <PracticeSession attemptId={attemptId} questions={questions.slice(0, 10)} timerMinutes={query.timer && query.timer !== "untimed" ? Number(query.timer) : undefined} persistToDatabase={persistent} />;
}
