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
  "fundamentals-of-algorithms",
  "programming",
  "data-representation",
  "computer-systems",
  "computer-networks",
  "cyber-security",
  "relational-databases-and-sql",
  "ethical-legal-environmental-impacts",
  "processors-io-and-storage",
  "software-development",
  "exchanging-data",
  "data-types-structures-and-algorithms",
  "legal-moral-cultural-ethical-issues",
  "computational-thinking",
  "problem-solving-and-programming",
  "advanced-algorithms",
  "programming-project",
]);

export function hasPracticeQuestions(topicSlug: string) {
  return PRACTICE_TOPIC_SLUGS.has(topicSlug);
}
