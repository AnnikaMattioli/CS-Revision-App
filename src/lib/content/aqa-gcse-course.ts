import { aqaGcseBlueprints } from "@/data/aqa-gcse";
import { buildWorkedSolution } from "@/lib/content/worked-solution-builder";
import type { CourseContent, LessonSection } from "@/types/content";

const colours = ["var(--violet)", "var(--blue)", "var(--teal)", "var(--coral)"];
const blueprints = [...aqaGcseBlueprints].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
const uuid = (group: number, topic: number, item: number) => `${String(group).padStart(8, "0")}-0000-4000-8000-${String(topic * 1000 + item).padStart(12, "0")}`;

function section(topic: number, unit: number, index: number, question: string, answer: string, keywords: string[]): LessonSection {
  return {
    id: uuid(35, topic, unit * 10 + index), heading: question,
    body: [answer, `Build an exam response using ${keywords.map((keyword) => `“${keyword}”`).join(", ")}, then connect each technical point to what it means in the scenario.`],
    callout: index === 1 ? { type: "tip", title: "Active recall", text: "Cover the explanation, answer the heading aloud, then check every key idea." } : index === 5 ? { type: "warning", title: "Exam check", text: "Match the depth of your response to the command word and number of marks." } : undefined,
  };
}

export const aqaGcseCourse: CourseContent = {
  id: "10000000-0000-0000-0000-000000000002", slug: "aqa-gcse-computer-science", title: "AQA GCSE Computer Science",
  description: "Original revision coverage for the content shared across the AQA 8525 specifications.", qualification: "GCSE", examBoard: "AQA",
  topics: blueprints.map((topic, offset) => {
    const topicIndex = offset + 1; const facts = topic.units.flatMap((unit) => unit.facts);
    return {
      id: uuid(22, topicIndex, 1), slug: topic.slug, code: topic.code, title: topic.title, description: topic.description, icon: topic.icon,
      colour: colours[offset % colours.length], estimatedMinutes: topic.units.length * 12, learningObjectives: topic.units.map((unit) => unit.summary), mastery: 0, subtopicTitle: topic.units[0].title,
      lessons: topic.units.map((unit, unitOffset) => ({ id: uuid(31, topicIndex, unitOffset + 1), slug: unit.slug, title: unit.title, summary: unit.summary, estimatedMinutes: 12, sections: unit.facts.map((item, factOffset) => section(topicIndex, unitOffset + 1, factOffset + 1, item.question, item.answer, item.keywords)) })),
      flashcards: facts.map((item, index) => ({ id: uuid(41, topicIndex, index + 1), front: item.question, back: item.answer, hint: `Include: ${item.keywords.join(", ")}` })),
      workedSolutions: Array.from({ length: 5 }, (_, solutionIndex) => buildWorkedSolution({ id: uuid(51, topicIndex, solutionIndex + 1), blueprint: topic, topicIndex, solutionIndex, qualification: "GCSE" })),
    };
  }),
};
