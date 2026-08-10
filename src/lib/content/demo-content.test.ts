import { describe, expect, it } from "vitest";
import { allWorkedSolutions, demoCourse, findLesson, findTopic } from "./demo-content";

describe("complete OCR GCSE course content", () => {
  it("contains every topic and a complete activity path", () => {
    expect(demoCourse.topics).toHaveLength(11);
    for (const topic of demoCourse.topics) {
      expect(topic.lessons.length).toBeGreaterThanOrEqual(4);
      expect(topic.flashcards.length).toBeGreaterThanOrEqual(20);
      expect(topic.workedSolutions.length).toBeGreaterThanOrEqual(5);
      expect(topic.learningObjectives.length).toBeGreaterThanOrEqual(4);
      expect(topic.lessons.every((lesson) => lesson.sections.length >= 5)).toBe(true);
      expect(topic.lessons.every((lesson) => lesson.sections.every((section) => section.body.length >= 3))).toBe(true);
    }
  });

  it("uses unique route slugs", () => {
    const topicSlugs = demoCourse.topics.map((topic) => topic.slug);
    expect(new Set(topicSlugs).size).toBe(topicSlugs.length);
    for (const topic of demoCourse.topics) {
      const lessonSlugs = topic.lessons.map((lesson) => lesson.slug);
      expect(new Set(lessonSlugs).size).toBe(lessonSlugs.length);
    }
  });

  it("finds topics, lessons and worked solutions", () => {
    expect(findTopic("memory-and-storage")?.title).toBe("Memory and storage");
    expect(findLesson("memory-and-storage", "secondary-storage")?.estimatedMinutes).toBe(12);
    expect(allWorkedSolutions()).toHaveLength(55);
  });
});
