import { describe, expect, it } from "vitest";
import { aqaALevelQuestionBank } from "./aqa-a-level-question-bank";
import { aqaGcseQuestionBank } from "./aqa-gcse-question-bank";
import { ocrALevelQuestionBank } from "./ocr-a-level-question-bank";
import { ocrGcseQuestionBank } from "./ocr-gcse-question-bank";
import { isObjectiveQuestion, objectiveQuestionLimit, selectPracticeQuestionMix } from "./practice-selection";

describe("practice question composition", () => {
  it("caps objective questions according to the set size", () => {
    expect(objectiveQuestionLimit(5)).toBe(1);
    expect(objectiveQuestionLimit(10)).toBe(2);
    expect(objectiveQuestionLimit(20)).toBe(3);
  });

  it.each([
    ["OCR GCSE", ocrGcseQuestionBank],
    ["AQA GCSE", aqaGcseQuestionBank],
    ["OCR A-level", ocrALevelQuestionBank],
    ["AQA A-level", aqaALevelQuestionBank],
  ] as const)("builds ten-question written-majority sets for every %s topic", (_course, bank) => {
    for (const topic of new Set(bank.map((question) => question.topicSlug))) {
      const selected = selectPracticeQuestionMix(bank.filter((question) => question.topicSlug === topic), 10);
      expect(selected).toHaveLength(10);
      expect(selected.filter((question) => isObjectiveQuestion(question.type))).toHaveLength(2);
      expect(selected.filter((question) => !isObjectiveQuestion(question.type))).toHaveLength(8);
    }
  });
});
