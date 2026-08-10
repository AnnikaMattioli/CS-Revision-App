import { ocrGcseBlueprints } from "@/data/ocr-gcse";
import { getOcrGcseEnrichment } from "@/data/ocr-gcse-enrichment";
import { buildWorkedSolution } from "@/lib/content/worked-solution-builder";
import type { CourseContent, LessonSection } from "@/types/content";

const colours = ["var(--violet)", "var(--blue)", "var(--teal)", "var(--coral)"];

function uuid(group: number, topic: number, item: number) {
  return `${group.toString().padStart(8, "0")}-0000-4000-8000-${String(topic * 1000 + item).padStart(12, "0")}`;
}

function lessonSection(topicIndex: number, unitIndex: number, factIndex: number, question: string, answer: string, keywords: string[], unitSlug: string, unitSummary: string): LessonSection {
  const focus = question.replace(/\?$/, "").replace(/^(What|Why|How|When|Which|Give|State|Compare)\s+/i, "");
  const enrichment = getOcrGcseEnrichment(unitSlug);
  const enrichmentText = [
    `Big picture: ${unitSummary}`,
    `Worked example: ${enrichment.workedExample}`,
    `Common misconception: ${enrichment.misconception}`,
    `Exam technique: ${enrichment.examTip}`,
    `Retrieval challenge: explain ${focus.toLowerCase()} without looking, then add a specific example or consequence.`,
  ][factIndex - 1];
  return {
    id: uuid(34, topicIndex, unitIndex * 10 + factIndex),
    heading: question,
    body: [answer, enrichmentText, `For an exam answer about ${focus.toLowerCase()}, use ${keywords.map((keyword) => `“${keyword}”`).join(", ")} accurately and connect each point to its effect.`],
    callout: factIndex === 3
      ? { type: "warning", title: "Correct it", text: "Before moving on, rewrite the misconception above as a precise true statement from memory." }
      : factIndex === 4
        ? { type: "tip", title: "Mark your answer", text: `Answer the heading now and award yourself one mark for each accurate use of ${keywords.join(", ")}.` }
        : factIndex === 5
          ? { type: "definition", title: "Active recall", text: "Close the lesson and teach this idea aloud. Reopen it only to identify the exact missing term or link." }
          : undefined,
    code: factIndex === 2 ? enrichment.code : undefined,
  };
}

export const ocrGcseCourse: CourseContent = {
  id: "10000000-0000-0000-0000-000000000001", slug: "ocr-gcse-computer-science", title: "OCR GCSE Computer Science",
  description: "Complete original revision coverage for OCR J277, organised across both assessed components.", qualification: "GCSE", examBoard: "OCR",
  topics: ocrGcseBlueprints.map((topic, topicOffset) => {
    const topicIndex = topicOffset + 1;
    const facts = topic.units.flatMap((unit) => unit.facts);
    return {
      id: uuid(20, topicIndex, 1), slug: topic.slug, code: topic.code, title: topic.title, description: topic.description, icon: topic.icon,
      colour: colours[topicOffset % colours.length], estimatedMinutes: topic.units.length * 12, learningObjectives: topic.units.map((unit) => unit.summary), mastery: 0,
      subtopicTitle: topic.units[0].title,
      lessons: topic.units.map((unit, unitOffset) => ({
        id: uuid(30, topicIndex, unitOffset + 1), slug: unit.slug, title: unit.title, summary: unit.summary, estimatedMinutes: 12,
        sections: unit.facts.map((item, factOffset) => lessonSection(topicIndex, unitOffset + 1, factOffset + 1, item.question, item.answer, item.keywords, unit.slug, unit.summary)),
      })),
      flashcards: facts.map((item, factOffset) => ({ id: uuid(40, topicIndex, factOffset + 1), front: item.question, back: item.answer, hint: `Include: ${item.keywords.join(", ")}` })),
      workedSolutions: Array.from({ length: 5 }, (_, solutionIndex) => buildWorkedSolution({
        id: uuid(50, topicIndex, solutionIndex + 1), blueprint: topic, topicIndex, solutionIndex, qualification: "GCSE",
        developAnswer: (answer, factIndex) => {
          if (factIndex % 5 !== 0) return answer;
          const unit = topic.units[Math.floor(factIndex / 5)];
          const detail = getOcrGcseEnrichment(unit.slug).workedExample.replace(/[.!?]+$/, "");
          return `${answer.replace(/[.!?]+$/, "")}; for example, ${detail.charAt(0).toLowerCase()}${detail.slice(1)}`;
        },
      })),
    };
  }),
};
