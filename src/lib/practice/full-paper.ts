import type { ProtectedQuestion } from "@/types/practice";

export type OcrGcsePaper = "paper1" | "paper2";
export type AqaGcsePaper = OcrGcsePaper;

const paperTopics: Record<OcrGcsePaper, Set<string>> = {
  paper1: new Set(["systems-architecture", "memory-and-storage", "networks-and-protocols", "network-security", "systems-software", "impacts-of-digital-technology"]),
  paper2: new Set(["algorithms", "programming-fundamentals", "robust-programs", "boolean-logic", "languages-and-ides"]),
};

const aqaPaperTopics: Record<AqaGcsePaper, Set<string>> = {
  paper1: new Set(["fundamentals-of-algorithms", "programming"]),
  paper2: new Set(["data-representation", "computer-systems", "computer-networks", "cyber-security", "relational-databases-and-sql", "ethical-legal-environmental-impacts"]),
};

export function selectOcrGcseFullPaper(bank: ProtectedQuestion[], paper: OcrGcsePaper, targetMarks = 80) {
  return selectFullPaper(bank, paperTopics[paper], targetMarks);
}

export function selectAqaGcseFullPaper(bank: ProtectedQuestion[], paper: AqaGcsePaper, targetMarks = 90) {
  return selectFullPaper(bank, aqaPaperTopics[paper], targetMarks);
}

function selectFullPaper(bank: ProtectedQuestion[], topics: Set<string>, targetMarks: number) {
  const eligible = bank.filter((question) => topics.has(question.topicSlug));
  const slugs = [...topics];
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
