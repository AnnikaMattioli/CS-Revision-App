import { ocrGcseBlueprints, type OcrFact } from "@/data/ocr-gcse";
import type { PracticeDifficulty, ProtectedQuestion } from "@/types/practice";

const difficulties: PracticeDifficulty[] = ["foundation", "developing", "secure", "advanced", "exam_challenge"];

function questionId(topicIndex: number, questionIndex: number) {
  return `60000000-0000-4000-8000-${String(topicIndex * 1000 + questionIndex).padStart(12, "0")}`;
}

function lessonHref(topicSlug: string, lessonSlug: string) {
  return `/learn/${topicSlug}/${lessonSlug}`;
}

function distractors(facts: OcrFact[], index: number) {
  return [1, 2, 3].map((offset) => facts[(index + offset) % facts.length].answer);
}

export const ocrGcseQuestionBank: ProtectedQuestion[] = ocrGcseBlueprints.flatMap((topic, topicOffset) => {
  const topicIndex = topicOffset + 1;
  const facts = topic.units.flatMap((unit) => unit.facts.map((item) => ({ ...item, lessonSlug: unit.slug })));
  const multipleChoice: ProtectedQuestion[] = facts.map((item, index) => ({
    id: questionId(topicIndex, index + 1), topicSlug: topic.slug, topicTitle: topic.title,
    type: "multiple_choice", difficulty: difficulties[index % difficulties.length], marks: 1, estimatedSeconds: 50,
    prompt: item.question,
    options: [
      { id: "correct", label: item.answer },
      ...distractors(facts, index).map((label, optionIndex) => ({ id: `distractor-${optionIndex + 1}`, label })),
    ],
    rule: { kind: "exact", acceptable: ["correct"] }, correctAnswer: item.answer,
    explanation: item.answer, commonMistake: "Check that the option answers the exact command word and does not merely mention the same topic.",
    lessonHref: lessonHref(topic.slug, item.lessonSlug),
  }));
  const booleans: ProtectedQuestion[] = facts.map((item, index) => {
    const correct = index % 2 === 0;
    const statement = correct ? item.answer : facts[(index + 1) % facts.length].answer;
    return {
      id: questionId(topicIndex, 21 + index), topicSlug: topic.slug, topicTitle: topic.title,
      type: "boolean", difficulty: difficulties[(index + 1) % difficulties.length], marks: 1, estimatedSeconds: 40,
      prompt: `True or false — for “${item.question}”, this is an accurate answer: ${statement}`,
      options: [{ id: "true", label: "True" }, { id: "false", label: "False" }],
      rule: { kind: "boolean", correct }, correctAnswer: correct ? "True" : "False",
      explanation: item.answer, commonMistake: "Judge the whole statement; one correct technical word does not make an inaccurate explanation true.",
      lessonHref: lessonHref(topic.slug, item.lessonSlug),
    };
  });
  const shortAnswers: ProtectedQuestion[] = facts.slice(0, 10).map((item, index) => {
    const points = item.keywords.slice(0, 3).map((keyword, pointIndex) => ({
      id: `point-${pointIndex + 1}`, description: `Uses the idea “${keyword}” accurately`, patterns: [keyword.toLowerCase()],
    }));
    return {
      id: questionId(topicIndex, 41 + index), topicSlug: topic.slug, topicTitle: topic.title,
      type: "short_answer", difficulty: difficulties[(index + 2) % difficulties.length], marks: points.length, estimatedSeconds: 120,
      prompt: `${item.question} Give a developed exam-style answer. [${points.length} marks]`,
      rule: { kind: "rubric", points }, correctAnswer: item.answer, modelAnswer: item.answer,
      explanation: `A complete response uses the key ideas ${item.keywords.join(", ")}.`,
      commonMistake: "Do not list disconnected terms: make each technical idea part of a clear answer.",
      lessonHref: lessonHref(topic.slug, item.lessonSlug),
    };
  });
  return [...multipleChoice, ...booleans, ...shortAnswers];
});
