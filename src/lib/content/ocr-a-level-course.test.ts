import { describe, expect, it } from "vitest";
import { ocrALevelCourse } from "./ocr-a-level-course";

describe("OCR A-level course", () => {
  it("contains every theory topic and the programming project in order", () => {
    expect(ocrALevelCourse.topics).toHaveLength(9);
    expect(ocrALevelCourse.topics.map((topic) => topic.code)).toEqual(["1.1", "1.2", "1.3", "1.4", "1.5", "2.1", "2.2", "2.3", "3"]);
  });
  it("provides complete revision material for every topic", () => {
    for (const topic of ocrALevelCourse.topics) {
      expect(topic.lessons).toHaveLength(4);
      expect(topic.lessons.every((lesson) => lesson.sections.length === 5)).toBe(true);
      expect(topic.flashcards).toHaveLength(20);
      expect(topic.workedSolutions).toHaveLength(5);
      expect(topic.lessons.every((lesson) => lesson.sections.every((section) => section.body.length === 3))).toBe(true);
    }
  });
  it("adds an OCR-focused worked example, misconception, exam technique and retrieval task to every lesson", () => {
    for (const topic of ocrALevelCourse.topics) for (const lesson of topic.lessons) {
      const text = lesson.sections.flatMap((section) => section.body).join(" ");
      expect(text).toContain("Worked example:");
      expect(text).toContain("Common misconception:");
      expect(text).toContain("OCR exam technique:");
      expect(text).toContain("Retrieval challenge:");
    }
  });
  it("uses unique identifiers and solution slugs", () => {
    const ids = ocrALevelCourse.topics.flatMap((topic) => [topic.id, ...topic.lessons.map((lesson) => lesson.id), ...topic.flashcards.map((card) => card.id), ...topic.workedSolutions.map((solution) => solution.id)]);
    const slugs = ocrALevelCourse.topics.flatMap((topic) => topic.workedSolutions.map((solution) => solution.slug));
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
