import { ocrGcseCourse } from "@/lib/content/ocr-gcse-course";

export const demoCourse = ocrGcseCourse;

export function findTopic(slug: string) {
  return demoCourse.topics.find((topic) => topic.slug === slug);
}

export function findLesson(topicSlug: string, lessonSlug: string) {
  return findTopic(topicSlug)?.lessons.find((lesson) => lesson.slug === lessonSlug);
}

export function allWorkedSolutions() {
  return demoCourse.topics.flatMap((topic) => topic.workedSolutions);
}
