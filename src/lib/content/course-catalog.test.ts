import { describe, expect, it } from "vitest";
import { aqaALevelCourse } from "./aqa-a-level-course";
import { aqaGcseCourse } from "./aqa-gcse-course";
import { courseChoices, findCourseChoice } from "./course-catalog";
import { ocrALevelCourse } from "./ocr-a-level-course";
import { ocrGcseCourse } from "./ocr-gcse-course";

const publishedCourses = [ocrGcseCourse, aqaGcseCourse, ocrALevelCourse, aqaALevelCourse];

describe("onboarding course catalogue", () => {
  it("maps every board and qualification choice to exactly one published course", () => {
    expect(courseChoices).toHaveLength(4);
    expect(new Set(courseChoices.map((course) => `${course.qualification}:${course.board}`)).size).toBe(4);
    expect(new Set(courseChoices.map((course) => course.id)).size).toBe(4);
    expect(courseChoices.map((choice) => choice.id)).toEqual(publishedCourses.map((course) => course.id));
  });

  it.each(courseChoices)("resolves $board $qualification consistently", (choice) => {
    expect(findCourseChoice(choice.qualification, choice.board)).toEqual(choice);
    const course = publishedCourses.find((candidate) => candidate.id === choice.id);
    expect(course?.examBoard).toBe(choice.board);
    expect(course?.qualification.toLowerCase().replace(" ", "-")).toBe(choice.qualification.toLowerCase());
    expect(course?.topics.every((topic) => topic.lessons.length > 0 && topic.flashcards.length >= 20)).toBe(true);
  });
});
