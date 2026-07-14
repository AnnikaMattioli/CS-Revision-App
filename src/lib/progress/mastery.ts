import type { MasteryAttempt, MasteryCalculation, MasteryLabel } from "@/types/progress";

const difficultyWeight: Record<string, number> = { foundation: 0.85, developing: 1, standard: 1, secure: 1.15, advanced: 1.3, stretch: 1.3, exam_challenge: 1.4 };

export function masteryLabel(score: number, questionsSeen = 1): MasteryLabel {
  if (!questionsSeen) return "Not started";
  if (score < 35) return "Beginning";
  if (score < 55) return "Developing";
  if (score < 75) return "Secure";
  return "Mastered";
}

export function calculateMastery(previousScore: number, previousQuestionsSeen: number, attempts: MasteryAttempt[]): MasteryCalculation {
  if (!attempts.length) return { score: previousScore, label: masteryLabel(previousScore, previousQuestionsSeen), questionsSeen: previousQuestionsSeen, accuracy: 0, trend: "steady", explanation: previousQuestionsSeen ? "No new marked answers yet, so your mastery is unchanged." : "Answer a few questions to establish your starting point." };

  const available = attempts.reduce((sum, item) => sum + item.marksAvailable, 0);
  const earned = attempts.reduce((sum, item) => sum + item.marksAwarded, 0);
  const accuracy = available ? earned / available : 0;
  const weightedAvailable = attempts.reduce((sum, item) => sum + item.marksAvailable * (difficultyWeight[item.difficulty] ?? 1), 0);
  const weightedEarned = attempts.reduce((sum, item) => sum + item.marksAwarded * (difficultyWeight[item.difficulty] ?? 1), 0);
  const weightedAccuracy = weightedAvailable ? weightedEarned / weightedAvailable : 0;
  const firstAttemptRate = attempts.filter((item) => item.firstAttempt !== false).length / attempts.length;
  const independence = attempts.filter((item) => !item.hintUsed).length / attempts.length;
  const difficultyBonus = Math.min(1, attempts.reduce((sum, item) => sum + (difficultyWeight[item.difficulty] ?? 1), 0) / attempts.length / 1.3);
  const performance = Math.min(100, weightedAccuracy * 70 + firstAttemptRate * 10 + independence * 5 + difficultyBonus * 15);

  const evidence = Math.min(0.35, 0.12 + attempts.length * 0.03);
  const proposed = previousQuestionsSeen ? previousScore * (1 - evidence) + performance * evidence : performance * Math.min(1, 0.45 + attempts.length * 0.08);
  const bounded = previousQuestionsSeen ? Math.max(previousScore - 8, Math.min(previousScore + 15, proposed)) : proposed;
  const score = Math.round(Math.max(0, Math.min(100, bounded)));
  const change = score - previousScore;
  const trend = change > 2 ? "up" : change < -2 ? "down" : "steady";
  const questionsSeen = previousQuestionsSeen + attempts.length;
  const accuracyPercent = Math.round(accuracy * 100);
  const explanation = `${accuracyPercent}% of available marks in this update, adjusted for question difficulty and independent first attempts. ${previousQuestionsSeen ? "Recent evidence is blended with your longer-term record, so one answer cannot cause a large swing." : "More answers will make this estimate more confident."}`;
  return { score, label: masteryLabel(score, questionsSeen), questionsSeen, accuracy: accuracyPercent, trend, explanation };
}
