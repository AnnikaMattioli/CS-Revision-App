import { aqaGcseBlueprints } from "@/data/aqa-gcse";
import type { PracticeDifficulty, ProtectedQuestion } from "@/types/practice";

const blueprints = [...aqaGcseBlueprints].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
const difficulties: PracticeDifficulty[] = ["foundation", "developing", "secure", "advanced", "exam_challenge"];
const id = (topic: number, question: number) => `70000000-0000-4000-8000-${String(topic * 1000 + question).padStart(12, "0")}`;

export const aqaGcseQuestionBank: ProtectedQuestion[] = blueprints.flatMap((topic, topicOffset) => {
  const topicIndex = topicOffset + 1;
  const facts = topic.units.flatMap((unit) => unit.facts.map((item) => ({ ...item, lessonSlug: unit.slug })));
  const choices: ProtectedQuestion[] = facts.map((item, index) => ({
    id: id(topicIndex, index + 1), topicSlug: topic.slug, topicTitle: topic.title, type: "multiple_choice", difficulty: difficulties[index % 5], marks: 1, estimatedSeconds: 50, prompt: item.question,
    options: [{ id: "correct", label: item.answer }, ...[1, 2, 3].map((offset, optionIndex) => ({ id: `distractor-${optionIndex + 1}`, label: facts[(index + offset) % facts.length].answer }))],
    rule: { kind: "exact", acceptable: ["correct"] }, correctAnswer: item.answer, explanation: item.answer,
    commonMistake: "Choose the option that answers the exact command rather than one that merely uses familiar terminology.", lessonHref: `/learn/${topic.slug}/${item.lessonSlug}`,
  }));
  const booleans: ProtectedQuestion[] = facts.map((item, index) => {
    const correct = index % 2 === 0; const statement = correct ? item.answer : facts[(index + 1) % facts.length].answer;
    return { id: id(topicIndex, 21 + index), topicSlug: topic.slug, topicTitle: topic.title, type: "boolean", difficulty: difficulties[(index + 1) % 5], marks: 1, estimatedSeconds: 40, prompt: `True or false — for “${item.question}”, this is accurate: ${statement}`, options: [{ id: "true", label: "True" }, { id: "false", label: "False" }], rule: { kind: "boolean", correct }, correctAnswer: correct ? "True" : "False", explanation: item.answer, commonMistake: "Judge the complete statement, not a single correct word.", lessonHref: `/learn/${topic.slug}/${item.lessonSlug}` };
  });
  const written: ProtectedQuestion[] = facts.slice(0, 10).map((item, index) => {
    const points = item.keywords.slice(0, 3).map((keyword, pointIndex) => ({ id: `point-${pointIndex + 1}`, description: `Uses “${keyword}” accurately`, patterns: [keyword.toLowerCase()] }));
    return { id: id(topicIndex, 41 + index), topicSlug: topic.slug, topicTitle: topic.title, type: "short_answer", difficulty: difficulties[(index + 2) % 5], marks: points.length, estimatedSeconds: 120, prompt: `${item.question} Give a developed exam-style answer. [${points.length} marks]`, rule: { kind: "rubric", points }, correctAnswer: item.answer, modelAnswer: item.answer, explanation: `A complete answer uses ${item.keywords.join(", ")}.`, commonMistake: "Link technical ideas in complete sentences rather than listing terms.", lessonHref: `/learn/${topic.slug}/${item.lessonSlug}` };
  });
  return [...choices, ...booleans, ...written];
});
