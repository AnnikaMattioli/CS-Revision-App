import { describe, expect, it } from "vitest";
import { ocrALevelCourse } from "@/lib/content/ocr-a-level-course";
import { ocrALevelQuestionBank } from "./ocr-a-level-question-bank";

describe("OCR A-level question bank", () => {
  it("has exactly 50 original questions for every topic", () => {
    expect(ocrALevelQuestionBank).toHaveLength(450);
    for (const topic of ocrALevelCourse.topics) expect(ocrALevelQuestionBank.filter((question) => question.topicSlug === topic.slug)).toHaveLength(50);
  });
  it("uses unique ids, supported rules and Learn links", () => {
    expect(new Set(ocrALevelQuestionBank.map((question) => question.id)).size).toBe(450);
    expect(ocrALevelQuestionBank.every((question) => ["exact", "boolean", "rubric"].includes(question.rule.kind))).toBe(true);
    expect(ocrALevelQuestionBank.every((question) => question.lessonHref?.startsWith(`/learn/${question.topicSlug}/`))).toBe(true);
  });
  it("balances objective questions with 20 written questions and developed models per topic", () => {
    for (const topic of ocrALevelCourse.topics) {
      const questions = ocrALevelQuestionBank.filter((question) => question.topicSlug === topic.slug);
      expect(questions.filter((question) => question.type === "multiple_choice")).toHaveLength(20);
      expect(questions.filter((question) => question.type === "boolean")).toHaveLength(10);
      const written = questions.filter((question) => question.type === "short_answer");
      expect(written).toHaveLength(20);
      expect(written.every((question) => (question.modelAnswer?.length ?? 0) > (question.correctAnswer?.length ?? 0))).toBe(true);
    }
  });
});
