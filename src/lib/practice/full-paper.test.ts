import { describe, expect, it } from "vitest";
import { ocrGcseQuestionBank } from "./ocr-gcse-question-bank";
import { selectOcrGcseFullPaper } from "./full-paper";
import { aqaGcseQuestionBank } from "./aqa-gcse-question-bank";
import { selectAqaGcseFullPaper } from "./full-paper";
import { ocrALevelQuestionBank } from "./ocr-a-level-question-bank";
import { selectOcrALevelFullPaper } from "./full-paper";

describe("OCR GCSE full papers", () => {
  it.each(["paper1", "paper2"] as const)("builds an 80-mark %s with every component topic", (paper) => {
    const questions = selectOcrGcseFullPaper(ocrGcseQuestionBank, paper);
    expect(questions.reduce((total, question) => total + question.marks, 0)).toBe(80);
    expect(new Set(questions.map((question) => question.topicSlug)).size).toBe(paper === "paper1" ? 6 : 5);
    expect(questions.some((question) => question.type === "short_answer")).toBe(true);
  });
});

describe("AQA GCSE full papers", () => {
  it.each(["paper1", "paper2"] as const)("builds a 90-mark %s with every component topic", (paper) => {
    const questions = selectAqaGcseFullPaper(aqaGcseQuestionBank, paper);
    expect(questions.reduce((total, question) => total + question.marks, 0)).toBe(90);
    expect(new Set(questions.map((question) => question.topicSlug)).size).toBe(paper === "paper1" ? 2 : 6);
  });
});

describe("OCR A-level full papers", () => {
  it.each(["paper1", "paper2"] as const)("builds a 140-mark %s with every written component topic", (paper) => {
    const questions = selectOcrALevelFullPaper(ocrALevelQuestionBank, paper);
    expect(questions.reduce((total, question) => total + question.marks, 0)).toBe(140);
    expect(new Set(questions.map((question) => question.topicSlug)).size).toBe(paper === "paper1" ? 5 : 3);
    expect(questions.every((question) => question.topicSlug !== "programming-project")).toBe(true);
  });
});
