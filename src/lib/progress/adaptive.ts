export type AdaptiveCandidate = { id: string; topicSlug: string; difficulty: string };
export type QuestionHistory = { questionId: string; seenCount: number; lastSeenDaysAgo?: number; recentlyIncorrect?: boolean };
export type AdaptiveWeights = { weakTopic: number; recentIncorrect: number; suitableDifficulty: number; spacedRetrieval: number; unseen: number };
export type AdaptiveSelection<T extends AdaptiveCandidate = AdaptiveCandidate> = T & { adaptiveScore: number; reason: string };

export const defaultAdaptiveWeights: AdaptiveWeights = { weakTopic: 0.4, recentIncorrect: 0.2, suitableDifficulty: 0.2, spacedRetrieval: 0.1, unseen: 0.1 };
const difficultyTarget: Record<string, number> = { foundation: 25, developing: 45, standard: 50, secure: 65, advanced: 82, stretch: 82, exam_challenge: 95 };

export function selectAdaptiveQuestions<T extends AdaptiveCandidate>({ candidates, topicMastery, history = [], count = 10, weights = defaultAdaptiveWeights, currentTopic }: { candidates: T[]; topicMastery: Record<string, number>; history?: QuestionHistory[]; count?: number; weights?: AdaptiveWeights; currentTopic?: string }): AdaptiveSelection<T>[] {
  const historyMap = new Map(history.map((item) => [item.questionId, item]));
  return candidates.map((candidate) => {
    const mastery = topicMastery[candidate.topicSlug] ?? 0;
    const past = historyMap.get(candidate.id);
    const weak = 1 - mastery / 100;
    const incorrect = past?.recentlyIncorrect ? 1 : 0;
    const suitable = Math.max(0, 1 - Math.abs((difficultyTarget[candidate.difficulty] ?? 50) - mastery) / 70);
    const spaced = past?.seenCount ? Math.min(1, (past.lastSeenDaysAgo ?? 0) / 21) : 0;
    const unseen = past?.seenCount ? 1 / (past.seenCount + 1) : 1;
    const topicBoost = currentTopic === candidate.topicSlug ? 0.08 : 0;
    const repeatPenalty = past?.lastSeenDaysAgo !== undefined && past.lastSeenDaysAgo < 2 ? 0.25 : 1;
    const raw = weak * weights.weakTopic + incorrect * weights.recentIncorrect + suitable * weights.suitableDifficulty + spaced * weights.spacedRetrieval + unseen * weights.unseen + topicBoost;
    const components = [
      [weak * weights.weakTopic, `Build ${candidate.topicSlug.replaceAll("-", " ")}`],
      [incorrect * weights.recentIncorrect, "Revisit a recent mistake"],
      [suitable * weights.suitableDifficulty, "Right level of challenge"],
      [spaced * weights.spacedRetrieval, "Spaced retrieval"],
      [unseen * weights.unseen, "Fresh question"],
    ] as const;
    const reason = [...components].sort((a, b) => b[0] - a[0])[0][1];
    return { ...candidate, adaptiveScore: Number((raw * repeatPenalty).toFixed(4)), reason };
  }).sort((a, b) => b.adaptiveScore - a.adaptiveScore || a.id.localeCompare(b.id)).slice(0, Math.min(count, candidates.length));
}
