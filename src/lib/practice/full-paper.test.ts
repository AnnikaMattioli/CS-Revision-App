import { describe, expect, it } from "vitest";
import { ocrGcseQuestionBank } from "./ocr-gcse-question-bank";
import { selectOcrGcseFullPaper } from "./full-paper";

describe("OCR GCSE full papers", () => {
  it.each(["paper1", "paper2"] as const)("builds an 80-mark %s with every component topic", (paper) => {
    const questions = selectOcrGcseFullPaper(ocrGcseQuestionBank, paper);
    expect(questions.reduce((total, question) => total + question.marks, 0)).toBe(80);
    expect(new Set(questions.map((question) => question.topicSlug)).size).toBe(paper === "paper1" ? 6 : 5);
    expect(questions.some((question) => question.type === "short_answer")).toBe(true);
  });
});
