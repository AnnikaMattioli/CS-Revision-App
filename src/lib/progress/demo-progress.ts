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

export function createEmptyProgress(): ProgressSnapshot {
  const today = new Date();
  return {
    topics: topics.map((topic) => ({ ...topic, score: 0, label: "Not started", questionsSeen: 0, accuracy: 0, trend: "steady", explanation: "Complete some practice to establish your starting point.", lastPractised: undefined })),
    currentStreak: 0,
    bestStreak: 0,
    totalQuestions: 0,
    recentAccuracy: 0,
    activity: Array.from({ length: 7 }, (_, offset) => { const date = new Date(today); date.setDate(today.getDate() - (6 - offset)); return { date: date.toISOString().slice(0, 10), questions: 0, lessons: 0, flashcards: 0 }; }),
    achievements: demoProgress.achievements.map((item) => ({ ...item, earnedAt: undefined, progress: 0 })),
  };
}

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
  const activeDates = new Set(history.map((item) => item.submittedAt.slice(0, 10)));
  let currentStreak = 0; const cursor = new Date();
  while (activeDates.has(cursor.toISOString().slice(0, 10))) { currentStreak += 1; cursor.setDate(cursor.getDate() - 1); }
  const activity = snapshot.activity.map((day) => ({ ...day, questions: history.filter((item) => item.submittedAt.slice(0, 10) === day.date).reduce((sum, item) => sum + item.results.length, 0) }));
  const secureTopics = topicsWithHistory.filter((topic) => topic.score >= 55).length;
  const masteredTopics = topicsWithHistory.filter((topic) => topic.score >= 75).length;
  const achievementProgress: Record<string, number> = { "first-set": history.length, "week-streak": currentStreak, "fifty-questions": answered, "topic-secure": secureTopics, mastery: masteredTopics, "ten-sets": history.length };
  return {
    ...snapshot,
    topics: topicsWithHistory,
    totalQuestions: snapshot.totalQuestions + answered,
    recentAccuracy: available ? Math.round((earned / available) * 100) : snapshot.recentAccuracy,
    activity,
    currentStreak,
    bestStreak: Math.max(snapshot.bestStreak, currentStreak),
    achievements: snapshot.achievements.map((item) => { const progress = achievementProgress[item.code] ?? item.progress; return { ...item, progress: Math.min(item.target, progress), earnedAt: progress >= item.target ? history[0].submittedAt : item.earnedAt }; }),
  };
}
