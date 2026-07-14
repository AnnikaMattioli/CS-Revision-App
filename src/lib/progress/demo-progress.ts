import type { PracticeResult } from "@/types/practice";
import type { ProgressSnapshot, TopicMasteryInsight } from "@/types/progress";
import { calculateMastery } from "./mastery";

const topics: TopicMasteryInsight[] = [
  { topicId: "20000000-0000-0000-0000-000000000001", slug: "systems-architecture", title: "Systems architecture", icon: "🧩", colour: "var(--violet)", score: 72, label: "Secure", questionsSeen: 34, accuracy: 78, trend: "up", explanation: "Strong CPU recall and improving explanations. One more secure set could move this topic towards Mastered.", lastPractised: "2026-07-13" },
  { topicId: "20000000-0000-0000-0000-000000000002", slug: "memory-and-storage", title: "Memory and storage", icon: "💾", colour: "var(--blue)", score: 54, label: "Developing", questionsSeen: 27, accuracy: 64, trend: "steady", explanation: "Storage choices are sound, but virtual memory and unit conversions need more consistent marks.", lastPractised: "2026-07-12" },
  { topicId: "20000000-0000-0000-0000-000000000003", slug: "networks-and-protocols", title: "Networks and protocols", icon: "🌐", colour: "var(--teal)", score: 34, label: "Beginning", questionsSeen: 18, accuracy: 48, trend: "down", explanation: "Protocol roles are the clearest next step. Retrieval practice will rebuild this gradually without erasing earlier progress.", lastPractised: "2026-07-10" },
];

export const demoProgress: ProgressSnapshot = {
  topics,
  currentStreak: 7,
  bestStreak: 12,
  totalQuestions: 184,
  recentAccuracy: 76,
  activity: [
    { date: "2026-07-08", questions: 12, lessons: 1, flashcards: 8 },
    { date: "2026-07-09", questions: 18, lessons: 0, flashcards: 12 },
    { date: "2026-07-10", questions: 10, lessons: 1, flashcards: 6 },
    { date: "2026-07-11", questions: 22, lessons: 0, flashcards: 10 },
    { date: "2026-07-12", questions: 16, lessons: 1, flashcards: 9 },
    { date: "2026-07-13", questions: 28, lessons: 1, flashcards: 14 },
    { date: "2026-07-14", questions: 10, lessons: 0, flashcards: 4 },
  ],
  achievements: [
    { code: "first-set", title: "First steps", description: "Complete your first practice set", icon: "🚀", earnedAt: "2026-07-08", progress: 1, target: 1 },
    { code: "week-streak", title: "Seven-day spark", description: "Revise on seven consecutive days", icon: "🔥", earnedAt: "2026-07-14", progress: 7, target: 7 },
    { code: "fifty-questions", title: "Question explorer", description: "Answer 50 practice questions", icon: "🧭", earnedAt: "2026-07-10", progress: 184, target: 50 },
    { code: "topic-secure", title: "Secure foundations", description: "Reach Secure mastery in one topic", icon: "🛡️", earnedAt: "2026-07-13", progress: 1, target: 1 },
    { code: "mastery", title: "Topic master", description: "Reach Mastered in one topic", icon: "🏆", progress: 0, target: 1 },
    { code: "ten-sets", title: "Consistent practice", description: "Complete 10 practice sets", icon: "🎯", progress: 6, target: 10 },
    { code: "first-exam", title: "Under exam conditions", description: "Complete your first timed test", icon: "⏱️", progress: 0, target: 1 },
  ],
};

export function applyLocalHistory(snapshot: ProgressSnapshot, history: PracticeResult[]): ProgressSnapshot {
  if (!history.length) return snapshot;
  const topicsWithHistory = snapshot.topics.map((topic) => {
    const attempts = history.flatMap((set) => set.results.filter((result) => result.question.topicSlug === topic.slug).map((result) => ({ marksAwarded: result.marksAwarded, marksAvailable: result.marksAvailable, difficulty: result.question.difficulty, occurredAt: set.submittedAt })));
    if (!attempts.length) return topic;
    const calculated = calculateMastery(topic.score, topic.questionsSeen, attempts);
    return { ...topic, ...calculated, lastPractised: attempts[0].occurredAt };
  });
  const answered = history.reduce((sum, item) => sum + item.results.length, 0);
  const earned = history.reduce((sum, item) => sum + item.score, 0);
  const available = history.reduce((sum, item) => sum + item.availableMarks, 0);
  return {
    ...snapshot,
    topics: topicsWithHistory,
    totalQuestions: snapshot.totalQuestions + answered,
    recentAccuracy: available ? Math.round((earned / available) * 100) : snapshot.recentAccuracy,
    achievements: snapshot.achievements.map((item) => item.code === "ten-sets" ? { ...item, progress: Math.min(item.target, Math.max(item.progress, history.length)), earnedAt: history.length >= item.target ? history[0].submittedAt : item.earnedAt } : item),
  };
}
