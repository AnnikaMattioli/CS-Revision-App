import { describe, expect, it } from "vitest";
import { aqaALevelCourse } from "@/lib/content/aqa-a-level-course";
import { aqaALevelQuestionBank } from "./aqa-a-level-question-bank";

describe("AQA A-level question bank", () => {
  it("has exactly 50 original questions for every topic", () => { expect(aqaALevelQuestionBank).toHaveLength(700); for (const topic of aqaALevelCourse.topics) expect(aqaALevelQuestionBank.filter((question) => question.topicSlug === topic.slug)).toHaveLength(50); });
  it("uses unique ids, supported rules and Learn links", () => { expect(new Set(aqaALevelQuestionBank.map((question) => question.id)).size).toBe(700); expect(aqaALevelQuestionBank.every((question) => ["exact", "boolean", "rubric"].includes(question.rule.kind))).toBe(true); expect(aqaALevelQuestionBank.every((question) => question.lessonHref?.startsWith(`/learn/${question.topicSlug}/`))).toBe(true); });
});
