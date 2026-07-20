import { describe, expect, it } from "vitest";
import { aqaGcseCourse } from "./aqa-gcse-course";

describe("AQA GCSE course", () => {
  it("contains the eight shared specification topics in order", () => {
    expect(aqaGcseCourse.topics).toHaveLength(8);
    expect(aqaGcseCourse.topics.map((topic) => topic.code)).toEqual(["3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8"]);
  });
  it("provides complete revision material for every topic", () => {
    for (const topic of aqaGcseCourse.topics) {
      expect(topic.lessons).toHaveLength(4);
      expect(topic.lessons.every((lesson) => lesson.sections.length === 5)).toBe(true);
      expect(topic.flashcards).toHaveLength(20);
      expect(topic.workedSolutions).toHaveLength(5);
    }
  });
  it("uses unique identifiers and solution slugs", () => {
    const ids = aqaGcseCourse.topics.flatMap((topic) => [topic.id, ...topic.lessons.map((lesson) => lesson.id), ...topic.flashcards.map((card) => card.id), ...topic.workedSolutions.map((solution) => solution.id)]);
    const slugs = aqaGcseCourse.topics.flatMap((topic) => topic.workedSolutions.map((solution) => solution.slug));
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
