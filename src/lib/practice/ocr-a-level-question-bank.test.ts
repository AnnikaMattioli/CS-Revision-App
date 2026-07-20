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
});
