import { describe, expect, it } from "vitest";
import { ocrGcseQuestionBank } from "./ocr-gcse-question-bank";

describe("OCR GCSE question bank", () => {
  it("contains 50 valid questions for every specification topic", () => {
    const byTopic = Map.groupBy(ocrGcseQuestionBank, (question) => question.topicSlug);
    expect(byTopic.size).toBe(11);
    for (const questions of byTopic.values()) {
      expect(questions).toHaveLength(50);
      expect(questions.every((question) => question.marks > 0 && question.lessonHref.startsWith("/learn/"))).toBe(true);
    }
  });

  it("uses unique database-safe identifiers", () => {
    const ids = ocrGcseQuestionBank.map((question) => question.id);
    expect(new Set(ids).size).toBe(550);
    expect(ids.every((id) => /^[0-9a-f-]{36}$/.test(id))).toBe(true);
  });

  it("includes recall, checking and written exam questions", () => {
    const types = new Set(ocrGcseQuestionBank.map((question) => question.type));
    expect(types).toEqual(new Set(["multiple_choice", "boolean", "short_answer"]));
  });

  it("provides twenty written questions and developed models per topic", () => {
    const byTopic = Map.groupBy(ocrGcseQuestionBank, (question) => question.topicSlug);
    for (const questions of byTopic.values()) {
      const written = questions.filter((question) => question.type === "short_answer");
      expect(written).toHaveLength(20);
      expect(written.every((question) => (question.modelAnswer?.split(/(?<=[.!?])\s+/).length ?? 0) >= 2)).toBe(true);
    }
  });
});
