export const courseChoices = [
  { id: "10000000-0000-0000-0000-000000000001", qualification: "GCSE", board: "OCR" },
  { id: "10000000-0000-0000-0000-000000000002", qualification: "GCSE", board: "AQA" },
  { id: "10000000-0000-0000-0000-000000000003", qualification: "A-level", board: "OCR" },
  { id: "10000000-0000-0000-0000-000000000004", qualification: "A-level", board: "AQA" },
] as const;

export type CourseQualification = typeof courseChoices[number]["qualification"];
export type CourseBoard = typeof courseChoices[number]["board"];

export function findCourseChoice(qualification: CourseQualification, board: CourseBoard) {
  return courseChoices.find((course) => course.qualification === qualification && course.board === board);
}
