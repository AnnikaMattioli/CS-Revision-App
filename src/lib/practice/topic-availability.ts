export const PRACTICE_TOPIC_SLUGS = new Set([
  "systems-architecture",
  "memory-and-storage",
  "networks-and-protocols",
  "network-security",
  "systems-software",
  "impacts-of-digital-technology",
  "algorithms",
  "programming-fundamentals",
  "robust-programs",
  "boolean-logic",
  "languages-and-ides",
]);

export function hasPracticeQuestions(topicSlug: string) {
  return PRACTICE_TOPIC_SLUGS.has(topicSlug);
}
