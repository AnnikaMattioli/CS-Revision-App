import { describe, expect, it } from "vitest";
import { demoCourse } from "@/lib/content/demo-content";
import { getPracticeTopicOptions } from "./course-topics";

describe("course-aligned practice topics", () => {
  it("keeps every learning topic visible in practice", () => {
    const options = getPracticeTopicOptions(demoCourse);
    expect(options.map((topic) => topic.slug)).toEqual(demoCourse.topics.map((topic) => topic.slug));
  });

  it("marks only topics backed by the current question bank as available", () => {
    const options = getPracticeTopicOptions(demoCourse);
    expect(options.every((topic) => topic.practiceAvailable)).toBe(true);

    const aqaCourse = { ...demoCourse, slug: "aqa-gcse-computer-science" };
    expect(getPracticeTopicOptions(aqaCourse).every((topic) => !topic.practiceAvailable)).toBe(true);
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
