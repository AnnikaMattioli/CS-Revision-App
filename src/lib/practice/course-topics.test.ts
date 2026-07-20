import { describe, expect, it } from "vitest";
import { demoCourse } from "@/lib/content/demo-content";
import { aqaGcseCourse } from "@/lib/content/aqa-gcse-course";
import { ocrALevelCourse } from "@/lib/content/ocr-a-level-course";
import { getPracticeTopicOptions } from "./course-topics";

describe("course-aligned practice topics", () => {
  it("keeps every learning topic visible in practice", () => {
    const options = getPracticeTopicOptions(demoCourse);
    expect(options.map((topic) => topic.slug)).toEqual(demoCourse.topics.map((topic) => topic.slug));
  });

  it("marks only topics backed by the current question bank as available", () => {
    const options = getPracticeTopicOptions(demoCourse);
    expect(options.every((topic) => topic.practiceAvailable)).toBe(true);

    expect(getPracticeTopicOptions(aqaGcseCourse).every((topic) => topic.practiceAvailable)).toBe(true);
    expect(getPracticeTopicOptions(ocrALevelCourse).every((topic) => topic.practiceAvailable)).toBe(true);

    const unsupportedCourse = { ...demoCourse, slug: "aqa-a-level-computer-science" };
    expect(getPracticeTopicOptions(unsupportedCourse).every((topic) => !topic.practiceAvailable)).toBe(true);
  });

  it("preserves the labels and icons shown by Learn", () => {
    const options = getPracticeTopicOptions(demoCourse);
    expect(options).toEqual(demoCourse.topics.map((topic) => ({
      slug: topic.slug,
      title: topic.title,
      icon: topic.icon,
      practiceAvailable: true,
    })));
  });
});
