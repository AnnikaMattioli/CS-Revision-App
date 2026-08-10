import { describe, expect, it } from "vitest";
import { aqaGcseCourse } from "@/lib/content/aqa-gcse-course";
import { aqaGcseQuestionBank } from "./aqa-gcse-question-bank";

describe("AQA GCSE question bank", () => {
  it("has exactly 50 original questions for every topic", () => {
    expect(aqaGcseQuestionBank).toHaveLength(400);
    for (const topic of aqaGcseCourse.topics) expect(aqaGcseQuestionBank.filter((question) => question.topicSlug === topic.slug)).toHaveLength(50);
  });
  it("has unique ids and supported answer rules", () => {
    expect(new Set(aqaGcseQuestionBank.map((question) => question.id)).size).toBe(400);
    expect(aqaGcseQuestionBank.every((question) => ["exact", "boolean", "rubric"].includes(question.rule.kind))).toBe(true);
  });
  it("links every question back to its Learn lesson", () => {
    expect(aqaGcseQuestionBank.every((question) => question.lessonHref?.startsWith(`/learn/${question.topicSlug}/`))).toBe(true);
  });
  it("provides twenty written questions with developed model answers per topic", () => {
    for (const topic of aqaGcseCourse.topics) {
      const written = aqaGcseQuestionBank.filter((question) => question.topicSlug === topic.slug && question.type === "short_answer");
      expect(written).toHaveLength(20);
      expect(written.every((question) => (question.modelAnswer?.split(/(?<=[.!?])\s+/).length ?? 0) >= 2)).toBe(true);
    }
  });
});
