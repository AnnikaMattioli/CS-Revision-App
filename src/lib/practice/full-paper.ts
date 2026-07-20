import type { ProtectedQuestion } from "@/types/practice";

export type OcrGcsePaper = "paper1" | "paper2";

const paperTopics: Record<OcrGcsePaper, Set<string>> = {
  paper1: new Set(["systems-architecture", "memory-and-storage", "networks-and-protocols", "network-security", "systems-software", "impacts-of-digital-technology"]),
  paper2: new Set(["algorithms", "programming-fundamentals", "robust-programs", "boolean-logic", "languages-and-ides"]),
};

export function selectOcrGcseFullPaper(bank: ProtectedQuestion[], paper: OcrGcsePaper, targetMarks = 80) {
  const eligible = bank.filter((question) => paperTopics[paper].has(question.topicSlug));
  const slugs = [...paperTopics[paper]];
  const priority = ["short_answer", "multiple_choice", "boolean"];
  const ordered = priority.flatMap((type) => {
    const groups = slugs.map((slug) => eligible.filter((question) => question.topicSlug === slug && question.type === type));
    return Array.from({ length: Math.max(0, ...groups.map((group) => group.length)) }, (_, index) => groups.flatMap((group) => group[index] ? [group[index]] : [])).flat();
  });
  const selected: ProtectedQuestion[] = [];
  let marks = 0;
  for (const question of ordered) {
    if (marks === targetMarks) break;
    if (marks + question.marks <= targetMarks) {
      selected.push(question);
      marks += question.marks;
    }
  }
  return selected;
}
