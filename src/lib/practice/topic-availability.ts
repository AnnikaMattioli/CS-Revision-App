export const PRACTICE_TOPIC_SLUGS = new Set([
  "systems-architecture",
  "memory-and-storage",
  "networks-and-protocols",
]);

export function hasPracticeQuestions(topicSlug: string) {
  return PRACTICE_TOPIC_SLUGS.has(topicSlug);
}
