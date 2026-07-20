import { ocrGcseBlueprints } from "@/data/ocr-gcse";
import { buildWorkedSolution } from "@/lib/content/worked-solution-builder";
import type { CourseContent, LessonSection } from "@/types/content";

const colours = ["var(--violet)", "var(--blue)", "var(--teal)", "var(--coral)"];

function uuid(group: number, topic: number, item: number) {
  return `${group.toString().padStart(8, "0")}-0000-4000-8000-${String(topic * 1000 + item).padStart(12, "0")}`;
}

function lessonSection(topicIndex: number, unitIndex: number, factIndex: number, question: string, answer: string, keywords: string[]): LessonSection {
  const focus = question.replace(/\?$/, "").replace(/^(What|Why|How|When|Which|Give|State|Compare)\s+/i, "");
  return {
    id: uuid(34, topicIndex, unitIndex * 10 + factIndex),
    heading: question,
    body: [answer, `For an exam answer about ${focus.toLowerCase()}, use precise subject vocabulary and connect each point to its effect. A strong response should include ${keywords.map((keyword) => `“${keyword}”`).join(", ")}.`],
    callout: factIndex === 0
      ? { type: "tip", title: "Active recall", text: "Hide the explanation, answer the heading aloud, then check every highlighted idea." }
      : factIndex === 4
        ? { type: "warning", title: "Exam check", text: "Avoid a one-word answer when the command word asks you to explain or compare." }
        : undefined,
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
        sections: unit.facts.map((item, factOffset) => lessonSection(topicIndex, unitOffset + 1, factOffset + 1, item.question, item.answer, item.keywords)),
      })),
      flashcards: facts.map((item, factOffset) => ({ id: uuid(40, topicIndex, factOffset + 1), front: item.question, back: item.answer, hint: `Include: ${item.keywords.join(", ")}` })),
      workedSolutions: Array.from({ length: 5 }, (_, solutionIndex) => buildWorkedSolution({ id: uuid(50, topicIndex, solutionIndex + 1), blueprint: topic, topicIndex, solutionIndex, qualification: "GCSE" })),
    };
  }),
};
