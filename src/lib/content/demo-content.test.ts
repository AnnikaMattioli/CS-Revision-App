import { describe, expect, it } from "vitest";
import { allWorkedSolutions, demoCourse, findLesson, findTopic } from "./demo-content";

describe("representative course content", () => {
  it("contains a complete topic activity path", () => {
    expect(demoCourse.topics.length).toBeGreaterThanOrEqual(3);
    for (const topic of demoCourse.topics) {
      expect(topic.lessons.length).toBeGreaterThan(0);
      expect(topic.flashcards.length).toBeGreaterThan(0);
      expect(topic.workedSolutions.length).toBeGreaterThan(0);
      expect(topic.learningObjectives.length).toBeGreaterThanOrEqual(3);
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
    expect(findLesson("memory-and-storage", "secondary-storage")?.estimatedMinutes).toBe(13);
    expect(allWorkedSolutions()).toHaveLength(3);
  });
});
