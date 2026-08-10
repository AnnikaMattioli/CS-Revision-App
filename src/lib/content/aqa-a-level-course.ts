import { aqaALevelBlueprints } from "@/data/aqa-a-level";
import { getAqaALevelEnrichment } from "@/data/aqa-a-level-enrichment";
import { buildWorkedSolution } from "@/lib/content/worked-solution-builder";
import type { CourseContent, LessonSection } from "@/types/content";

const colours = ["var(--violet)", "var(--blue)", "var(--teal)", "var(--coral)"];
const blueprints = [...aqaALevelBlueprints].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
const uuid = (group: number, topic: number, item: number) => `${String(group).padStart(8, "0")}-0000-4000-8000-${String(topic * 1000 + item).padStart(12, "0")}`;

function section(topic: number, unit: number, index: number, question: string, answer: string, keywords: string[], unitSlug: string, unitSummary: string): LessonSection {
  const enrichment = getAqaALevelEnrichment(unitSlug);
  const focus = question.replace(/\?$/, "").replace(/^(What|Why|How|When|Which|Give|State|Compare)\s+/i, "").toLowerCase();
  const enrichmentText = [
    `Big picture: ${unitSummary}`,
    `Worked example: ${enrichment.workedExample}`,
    `Common misconception: ${enrichment.misconception}`,
    `AQA exam technique: ${enrichment.examTip}`,
    `Retrieval challenge: explain ${focus} without looking, then apply it to an unfamiliar context.`,
  ][index - 1];
  return {
    id: uuid(37, topic, unit * 10 + index), heading: question,
    body: [answer, enrichmentText, `Build an A-level response using ${keywords.map((word) => `“${word}”`).join(", ")}, then develop each technical link in context.`],
    callout: index === 3 ? { type: "warning", title: "Correct it", text: "Rewrite the misconception above as a precise true statement from memory." }
      : index === 4 ? { type: "tip", title: "Mark your answer", text: `Award one mark for each accurate use of ${keywords.join(", ")}, then check that every point is developed.` }
        : index === 5 ? { type: "definition", title: "Active recall", text: "Close the lesson and teach the whole idea aloud before checking the terms or links you missed." } : undefined,
    code: index === 2 ? enrichment.code : undefined,
  };
}

export const aqaALevelCourse: CourseContent = {
  id: "10000000-0000-0000-0000-000000000004", slug: "aqa-a-level-computer-science", title: "AQA A-level Computer Science", description: "Complete original revision coverage for AQA 7517 theory, programming and NEA.", qualification: "A Level", examBoard: "AQA",
  topics: blueprints.map((topic, offset) => { const topicIndex = offset + 1; const facts = topic.units.flatMap((unit) => unit.facts); return { id: uuid(24, topicIndex, 1), slug: topic.slug, code: topic.code, title: topic.title, description: topic.description, icon: topic.icon, colour: colours[offset % colours.length], estimatedMinutes: topic.units.length * 15, learningObjectives: topic.units.map((unit) => unit.summary), mastery: 0, subtopicTitle: topic.units[0].title, lessons: topic.units.map((unit, unitOffset) => ({ id: uuid(33, topicIndex, unitOffset + 1), slug: unit.slug, title: unit.title, summary: unit.summary, estimatedMinutes: 15, sections: unit.facts.map((item, factOffset) => section(topicIndex, unitOffset + 1, factOffset + 1, item.question, item.answer, item.keywords, unit.slug, unit.summary)) })), flashcards: facts.map((item, index) => ({ id: uuid(43, topicIndex, index + 1), front: item.question, back: item.answer, hint: `Include: ${item.keywords.join(", ")}` })), workedSolutions: Array.from({ length: 5 }, (_, solutionIndex) => buildWorkedSolution({ id: uuid(53, topicIndex, solutionIndex + 1), blueprint: topic, topicIndex, solutionIndex, qualification: "A Level", developAnswer: (answer, factIndex) => factIndex % 5 === 0 ? `${answer.replace(/[.!?]+$/, "")}; for example, ${getAqaALevelEnrichment(topic.units[Math.floor(factIndex / 5)].slug).workedExample.charAt(0).toLowerCase()}${getAqaALevelEnrichment(topic.units[Math.floor(factIndex / 5)].slug).workedExample.slice(1).replace(/[.!?]+$/, "")}` : answer })) }; }),
};
