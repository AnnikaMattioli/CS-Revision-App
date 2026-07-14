import "server-only";
import { demoProgress } from "./demo-progress";
import { masteryLabel } from "./mastery";
import { hasSupabaseConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { ProgressSnapshot } from "@/types/progress";

export async function getProgressSnapshot(): Promise<ProgressSnapshot> {
  if (!hasSupabaseConfig()) return demoProgress;
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return demoProgress;
  const [{ data: mastery }, { data: activity }, { data: attempts }, { data: achievementRows }, { data: earnedRows }] = await Promise.all([
    supabase.from("topic_mastery").select("topic_id,mastery_score,confidence,questions_seen,accuracy_score,trend,explanation,updated_at").eq("user_id", user.id),
    supabase.from("study_activity_days").select("activity_date,questions_answered,lessons_completed,flashcards_reviewed").eq("user_id", user.id).order("activity_date", { ascending: false }).limit(30),
    supabase.from("attempts").select("id,score,available_marks,started_at").eq("user_id", user.id).eq("status", "marked").order("started_at", { ascending: false }).limit(25),
    supabase.from("achievements").select("id,code,title,description,icon").eq("published", true),
    supabase.from("user_achievements").select("achievement_id,earned_at").eq("user_id", user.id),
  ]);
  const masteryMap = new Map((mastery ?? []).map((item) => [item.topic_id, item]));
  const topics = demoProgress.topics.map((topic) => { const row = masteryMap.get(topic.topicId); if (!row) return { ...topic, score: 0, label: masteryLabel(0, 0), questionsSeen: 0, accuracy: 0, trend: "steady" as const, explanation: "Answer a few questions to establish your starting point.", lastPractised: undefined }; return { ...topic, score: Math.round(Number(row.mastery_score)), label: masteryLabel(Number(row.mastery_score), row.questions_seen), questionsSeen: row.questions_seen, accuracy: Math.round(Number(row.accuracy_score)), trend: row.trend as "up" | "steady" | "down", explanation: row.explanation, lastPractised: row.updated_at }; });
  const attemptIds = (attempts ?? []).map((item) => item.id); const { data: answers } = attemptIds.length ? await supabase.from("attempt_answers").select("id").in("attempt_id", attemptIds) : { data: [] };
  const earnedMap = new Map((earnedRows ?? []).map((item) => [item.achievement_id, item.earned_at]));
  const totalQuestions = answers?.length ?? 0; const setCount = attempts?.length ?? 0; const secureCount = topics.filter((topic) => topic.score >= 55).length; const masteredCount = topics.filter((topic) => topic.score >= 75).length;
  const progressByCode: Record<string, number> = { "first-set": setCount, "week-streak": 0, "fifty-questions": totalQuestions, "topic-secure": secureCount, mastery: masteredCount, "ten-sets": setCount, "first-exam": earnedRows?.some((item) => achievementRows?.find((achievement) => achievement.id === item.achievement_id)?.code === "first-exam") ? 1 : 0 };
  const targetByCode: Record<string, number> = { "first-set": 1, "week-streak": 7, "fifty-questions": 50, "topic-secure": 1, mastery: 1, "ten-sets": 10, "first-exam": 1 };
  const activityMap = new Map((activity ?? []).map((item) => [item.activity_date, item])); const today = new Date(); const days = Array.from({ length: 7 }, (_, offset) => { const date = new Date(today); date.setDate(today.getDate() - (6 - offset)); const key = date.toISOString().slice(0, 10); const row = activityMap.get(key); return { date: key, questions: row?.questions_answered ?? 0, lessons: row?.lessons_completed ?? 0, flashcards: row?.flashcards_reviewed ?? 0 }; });
  const activeDates = new Set((activity ?? []).map((item) => item.activity_date)); let currentStreak = 0; const cursor = new Date(today); while (activeDates.has(cursor.toISOString().slice(0, 10))) { currentStreak += 1; cursor.setDate(cursor.getDate() - 1); }
  progressByCode["week-streak"] = currentStreak;
  const scored = (attempts ?? []).filter((item) => item.available_marks); const earned = scored.reduce((sum, item) => sum + (item.score ?? 0), 0); const available = scored.reduce((sum, item) => sum + (item.available_marks ?? 0), 0);
  return { topics, activity: days, achievements: (achievementRows ?? []).map((item) => ({ code: item.code, title: item.title, description: item.description, icon: item.icon, earnedAt: earnedMap.get(item.id), progress: progressByCode[item.code] ?? 0, target: targetByCode[item.code] ?? 1 })), currentStreak, bestStreak: currentStreak, totalQuestions, recentAccuracy: available ? Math.round(earned / available * 100) : 0 };
}
