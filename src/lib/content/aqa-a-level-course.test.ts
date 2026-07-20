import { describe, expect, it } from "vitest";
import { aqaALevelCourse } from "./aqa-a-level-course";

describe("AQA A-level course", () => {
  it("contains all fourteen specification topics", () => { expect(aqaALevelCourse.topics).toHaveLength(14); expect(aqaALevelCourse.topics.at(0)?.code).toBe("4.1"); expect(aqaALevelCourse.topics.at(-1)?.code).toBe("4.14"); });
  it("provides complete revision material", () => { for (const topic of aqaALevelCourse.topics) { expect(topic.lessons).toHaveLength(4); expect(topic.lessons.every((lesson) => lesson.sections.length === 5)).toBe(true); expect(topic.flashcards).toHaveLength(20); expect(topic.workedSolutions).toHaveLength(5); } });
  it("uses unique identifiers and solution slugs", () => { const ids = aqaALevelCourse.topics.flatMap((topic) => [topic.id, ...topic.lessons.map((lesson) => lesson.id), ...topic.flashcards.map((card) => card.id), ...topic.workedSolutions.map((solution) => solution.id)]); const slugs = aqaALevelCourse.topics.flatMap((topic) => topic.workedSolutions.map((solution) => solution.slug)); expect(new Set(ids).size).toBe(ids.length); expect(new Set(slugs).size).toBe(slugs.length); });
});
