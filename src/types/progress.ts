export type MasteryLabel = "Not started" | "Beginning" | "Developing" | "Secure" | "Mastered";

export type MasteryAttempt = {
  marksAwarded: number;
  marksAvailable: number;
  difficulty: string;
  occurredAt?: string;
  firstAttempt?: boolean;
  hintUsed?: boolean;
};

export type MasteryCalculation = {
  score: number;
  label: MasteryLabel;
  questionsSeen: number;
  accuracy: number;
  trend: "up" | "steady" | "down";
  explanation: string;
};

export type TopicMasteryInsight = {
  topicId: string;
  slug: string;
  title: string;
  icon: string;
  colour: string;
  score: number;
  label: MasteryLabel;
  questionsSeen: number;
  accuracy: number;
  trend: "up" | "steady" | "down";
  explanation: string;
  lastPractised?: string;
  practiceAvailable: boolean;
};

export type ActivityDay = { date: string; questions: number; lessons: number; flashcards: number };
export type AchievementView = { code: string; title: string; description: string; icon: string; earnedAt?: string; progress: number; target: number };

export type ProgressSnapshot = {
  topics: TopicMasteryInsight[];
  activity: ActivityDay[];
  achievements: AchievementView[];
  currentStreak: number;
  bestStreak: number;
  totalQuestions: number;
  recentAccuracy: number;
};
