import { describe, expect, it } from "vitest";
import { aqaALevelCourse } from "./aqa-a-level-course";
import { aqaGcseCourse } from "./aqa-gcse-course";
import { ocrALevelCourse } from "./ocr-a-level-course";
import { ocrGcseCourse } from "./ocr-gcse-course";

describe("worked solution depth", () => {
  it("uses five varied 1–8 mark responses per GCSE topic", () => {
    const solutions = [ocrGcseCourse, aqaGcseCourse].flatMap((course) => course.topics.flatMap((topic) => topic.workedSolutions));
    expect(new Set(solutions.map((solution) => solution.marks))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8]));
    verify(solutions, 8);
  });

  it("uses five varied 1–12 mark responses per A-level topic", () => {
    const solutions = [ocrALevelCourse, aqaALevelCourse].flatMap((course) => course.topics.flatMap((topic) => topic.workedSolutions));
    expect(new Set(solutions.map((solution) => solution.marks))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
    verify(solutions, 12);
  });
});

function verify(solutions: Array<{ marks: number; prompt: string; finalAnswer: string }>, maximum: number) {
  for (const solution of solutions) {
    expect(solution.marks).toBeGreaterThanOrEqual(1);
    expect(solution.marks).toBeLessThanOrEqual(maximum);
    expect(solution.prompt).toMatch(new RegExp(`\\[${solution.marks} marks?\\]$`));
    expect(solution.finalAnswer.match(/[.!?](?=\s|$)/g)).toHaveLength(solution.marks);
  }
}
