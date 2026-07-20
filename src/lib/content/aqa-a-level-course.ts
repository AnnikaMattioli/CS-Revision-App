import { aqaALevelBlueprints } from "@/data/aqa-a-level";
import type { CourseContent, LessonSection, WorkedSolution } from "@/types/content";

const colours = ["var(--violet)", "var(--blue)", "var(--teal)", "var(--coral)"];
const blueprints = [...aqaALevelBlueprints].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
const uuid = (group: number, topic: number, item: number) => `${String(group).padStart(8, "0")}-0000-4000-8000-${String(topic * 1000 + item).padStart(12, "0")}`;

function section(topic: number, unit: number, index: number, question: string, answer: string, keywords: string[]): LessonSection {
  return { id: uuid(37, topic, unit * 10 + index), heading: question, body: [answer, `Build an A-level response using ${keywords.map((word) => `“${word}”`).join(", ")}, then develop each technical link in context.`], callout: index === 1 ? { type: "tip", title: "Active recall", text: "Answer from memory before revealing the explanation." } : index === 5 ? { type: "warning", title: "AQA precision", text: "Use exact terminology and apply it to the question's scenario." } : undefined };
}

function solution(topicIndex: number, topicSlug: string, topicTitle: string, factIndex: number): WorkedSolution {
  const item = blueprints[topicIndex - 1].units.flatMap((unit) => unit.facts)[factIndex];
  return { id: uuid(53, topicIndex, factIndex + 1), slug: `${topicSlug}-worked-${factIndex + 1}`, title: `Worked A-level response ${factIndex + 1}`, prompt: `${item.question} Develop and apply your answer. [4 marks]`, topicSlug, topicTitle, steps: [{ title: "Decode the demand", explanation: "Identify the command word and precise subject.", working: item.question }, { title: "Select marking ideas", explanation: `Use ${item.keywords.join(", ")}.` }, { title: "Develop and apply", explanation: "Connect each accurate fact to its consequence and the context." }], finalAnswer: item.answer };
}

export const aqaALevelCourse: CourseContent = {
  id: "10000000-0000-0000-0000-000000000004", slug: "aqa-a-level-computer-science", title: "AQA A-level Computer Science", description: "Complete original revision coverage for AQA 7517 theory, programming and NEA.", qualification: "A Level", examBoard: "AQA",
  topics: blueprints.map((topic, offset) => { const topicIndex = offset + 1; const facts = topic.units.flatMap((unit) => unit.facts); return { id: uuid(24, topicIndex, 1), slug: topic.slug, code: topic.code, title: topic.title, description: topic.description, icon: topic.icon, colour: colours[offset % colours.length], estimatedMinutes: topic.units.length * 15, learningObjectives: topic.units.map((unit) => unit.summary), mastery: 0, subtopicTitle: topic.units[0].title, lessons: topic.units.map((unit, unitOffset) => ({ id: uuid(33, topicIndex, unitOffset + 1), slug: unit.slug, title: unit.title, summary: unit.summary, estimatedMinutes: 15, sections: unit.facts.map((item, factOffset) => section(topicIndex, unitOffset + 1, factOffset + 1, item.question, item.answer, item.keywords)) })), flashcards: facts.map((item, index) => ({ id: uuid(43, topicIndex, index + 1), front: item.question, back: item.answer, hint: `Include: ${item.keywords.join(", ")}` })), workedSolutions: Array.from({ length: 5 }, (_, index) => solution(topicIndex, topic.slug, topic.title, index)) }; }),
};
