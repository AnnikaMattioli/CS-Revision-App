import type { ProtectedQuestion } from "@/types/practice";

export type OcrGcsePaper = "paper1" | "paper2";
export type AqaGcsePaper = OcrGcsePaper;
export type OcrALevelPaper = OcrGcsePaper;
export type AqaALevelPaper = OcrGcsePaper;

const paperTopics: Record<OcrGcsePaper, Set<string>> = {
  paper1: new Set(["systems-architecture", "memory-and-storage", "networks-and-protocols", "network-security", "systems-software", "impacts-of-digital-technology"]),
  paper2: new Set(["algorithms", "programming-fundamentals", "robust-programs", "boolean-logic", "languages-and-ides"]),
};

const aqaPaperTopics: Record<AqaGcsePaper, Set<string>> = {
  paper1: new Set(["fundamentals-of-algorithms", "programming"]),
  paper2: new Set(["data-representation", "computer-systems", "computer-networks", "cyber-security", "relational-databases-and-sql", "ethical-legal-environmental-impacts"]),
};

const ocrALevelPaperTopics: Record<OcrALevelPaper, Set<string>> = {
  paper1: new Set(["processors-io-and-storage", "software-development", "exchanging-data", "data-types-structures-and-algorithms", "legal-moral-cultural-ethical-issues"]),
  paper2: new Set(["computational-thinking", "problem-solving-and-programming", "advanced-algorithms"]),
};

const aqaALevelPaperTopics: Record<AqaALevelPaper, Set<string>> = {
  paper1: new Set(["fundamentals-of-programming", "fundamentals-of-data-structures", "fundamentals-of-advanced-algorithms", "theory-of-computation", "systematic-problem-solving"]),
  paper2: new Set(["advanced-data-representation", "fundamentals-of-computer-systems", "computer-organisation-and-architecture", "consequences-of-computing", "communication-and-networking", "fundamentals-of-databases", "big-data", "functional-programming"]),
};

export function selectOcrGcseFullPaper(bank: ProtectedQuestion[], paper: OcrGcsePaper, targetMarks = 80) {
  return selectFullPaper(bank, paperTopics[paper], targetMarks);
}

export function selectAqaGcseFullPaper(bank: ProtectedQuestion[], paper: AqaGcsePaper, targetMarks = 90) {
  return selectFullPaper(bank, aqaPaperTopics[paper], targetMarks);
}

export function selectOcrALevelFullPaper(bank: ProtectedQuestion[], paper: OcrALevelPaper, targetMarks = 140) {
  return selectFullPaper(bank, ocrALevelPaperTopics[paper], targetMarks);
}

export function selectAqaALevelFullPaper(bank: ProtectedQuestion[], paper: AqaALevelPaper, targetMarks = 100) {
  return selectFullPaper(bank, aqaALevelPaperTopics[paper], targetMarks);
}

function selectFullPaper(bank: ProtectedQuestion[], topics: Set<string>, targetMarks: number) {
  const eligible = bank.filter((question) => topics.has(question.topicSlug));
  const slugs = [...topics];
  const types = ["short_answer", "multiple_choice", "boolean"];
  const groups = types.map((type) => slugs.map((slug) => eligible.filter((question) => question.topicSlug === slug && question.type === type)));
  const longest = Math.max(0, ...groups.flat().map((group) => group.length));
  const ordered: ProtectedQuestion[] = [];
  for (let index = 0; index < longest; index += 1) {
    for (const typeGroups of groups) {
      for (const group of typeGroups) if (group[index]) ordered.push(group[index]);
    }
  }
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
