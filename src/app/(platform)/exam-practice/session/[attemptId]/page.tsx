import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ExamSession } from "@/components/exam/exam-session";
import { publicQuestions } from "@/lib/practice/question-bank";
import { createClient } from "@/lib/supabase/server";
import type { ExamConfig } from "@/types/exam";
import type { PublicQuestion } from "@/types/practice";

export const metadata: Metadata = { title: "Timed exam" };
export default async function ExamSessionPage({ params, searchParams }: { params: Promise<{ attemptId: string }>; searchParams: Promise<{ ids?: string; time?: string; back?: string; warn?: string; release?: string; kind?: string; board?: string; paper?: string }> }) {
  const { attemptId } = await params; const query = await searchParams; const persistent = !attemptId.startsWith("exam-demo-"); let questions: PublicQuestion[] = publicQuestions(); let deadlineAt: string | undefined;
  let config: ExamConfig = { kind: (query.kind as ExamConfig["kind"]) ?? "mixed", qualification: "GCSE", examBoard: query.board === "AQA" ? "AQA" : "OCR", topic: "mixed", paper: query.paper === "paper2" ? "paper2" : query.paper === "paper1" ? "paper1" : undefined, questionCount: query.ids?.split(",").length ?? 10, difficulty: "mixed", timeLimitMinutes: Number(query.time ?? 15), allowBackwards: query.back !== "0", warnUnanswered: query.warn !== "0", resultsRelease: query.release === "later" ? "later" : "immediate" };
  if (persistent) {
    const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: attempt } = await supabase.from("attempts").select("practice_set_id,deadline_at").eq("id", attemptId).eq("user_id", user.id).eq("status", "in_progress").maybeSingle();
      if (attempt) {
        deadlineAt = attempt.deadline_at ?? undefined;
        const { data: paper } = await supabase.from("practice_sets").select("configuration").eq("id", attempt.practice_set_id).eq("mode", "exam").single(); if (paper) config = paper.configuration as ExamConfig;
        const { data: links } = await supabase.from("practice_set_questions").select("question_id,sort_order").eq("practice_set_id", attempt.practice_set_id).order("sort_order"); const ids = (links ?? []).map((item) => item.question_id);
        const { data: rows } = ids.length ? await supabase.from("questions").select("id,prompt").in("id", ids).eq("status", "published") : { data: [] }; const byId = new Map((rows ?? []).map((row) => [row.id, row.prompt])); questions = ids.map((id) => byId.get(id)).filter((item): item is PublicQuestion => Boolean(item));
      }
    }
  } else if (query.ids) { const byId = new Map(questions.map((item) => [item.id, item])); questions = query.ids.split(",").map((id) => byId.get(id)).filter((item): item is PublicQuestion => Boolean(item)); }
  if (!questions.length) redirect("/exam-practice");
  return <ExamSession attemptId={attemptId} questions={questions} config={config} persistToDatabase={persistent} deadlineAt={deadlineAt} />;
}
