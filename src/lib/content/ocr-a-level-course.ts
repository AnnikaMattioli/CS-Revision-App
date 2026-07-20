import { ocrALevelBlueprints } from "@/data/ocr-a-level";
import { buildWorkedSolution } from "@/lib/content/worked-solution-builder";
import type { CourseContent, LessonSection } from "@/types/content";

const colours = ["var(--violet)", "var(--blue)", "var(--teal)", "var(--coral)"];
const blueprints = [...ocrALevelBlueprints].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
const uuid = (group: number, topic: number, item: number) => `${String(group).padStart(8, "0")}-0000-4000-8000-${String(topic * 1000 + item).padStart(12, "0")}`;

function section(topic: number, unit: number, index: number, question: string, answer: string, keywords: string[]): LessonSection {
  return {
    id: uuid(36, topic, unit * 10 + index), heading: question,
    body: [answer, `Build an A-level response using ${keywords.map((keyword) => `“${keyword}”`).join(", ")}, then connect each technical point to its consequence in the context.`],
    callout: index === 1 ? { type: "tip", title: "Active recall", text: "Hide the explanation, answer from memory, then check every technical link." } : index === 5 ? { type: "warning", title: "A-level depth", text: "Use precise terminology, developed reasoning and application to the scenario." } : undefined,
  };
}

export const ocrALevelCourse: CourseContent = {
  id: "10000000-0000-0000-0000-000000000003", slug: "ocr-a-level-computer-science", title: "OCR A-level Computer Science",
  description: "Complete original revision coverage for OCR H446 theory and the programming project.", qualification: "A Level", examBoard: "OCR",
  topics: blueprints.map((topic, offset) => {
    const topicIndex = offset + 1; const facts = topic.units.flatMap((unit) => unit.facts);
    return {
      id: uuid(23, topicIndex, 1), slug: topic.slug, code: topic.code, title: topic.title, description: topic.description, icon: topic.icon,
      colour: colours[offset % colours.length], estimatedMinutes: topic.units.length * 15, learningObjectives: topic.units.map((unit) => unit.summary), mastery: 0, subtopicTitle: topic.units[0].title,
      lessons: topic.units.map((unit, unitOffset) => ({ id: uuid(32, topicIndex, unitOffset + 1), slug: unit.slug, title: unit.title, summary: unit.summary, estimatedMinutes: 15, sections: unit.facts.map((item, factOffset) => section(topicIndex, unitOffset + 1, factOffset + 1, item.question, item.answer, item.keywords)) })),
      flashcards: facts.map((item, index) => ({ id: uuid(42, topicIndex, index + 1), front: item.question, back: item.answer, hint: `Include: ${item.keywords.join(", ")}` })),
      workedSolutions: Array.from({ length: 5 }, (_, solutionIndex) => buildWorkedSolution({ id: uuid(52, topicIndex, solutionIndex + 1), blueprint: topic, topicIndex, solutionIndex, qualification: "A Level" })),
    };
  }),
};
