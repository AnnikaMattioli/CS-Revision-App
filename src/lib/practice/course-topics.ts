import { hasPracticeQuestions } from "./topic-availability";
import type { CourseContent } from "@/types/content";

export type PracticeTopicOption = {
  slug: string;
  title: string;
  icon: string;
  practiceAvailable: boolean;
};

export function getPracticeTopicOptions(course: CourseContent): PracticeTopicOption[] {
  const supportsCurrentQuestionBank = course.slug === "ocr-gcse-computer-science";
  return course.topics.map((topic) => ({
    slug: topic.slug,
    title: topic.title,
    icon: topic.icon,
    practiceAvailable: supportsCurrentQuestionBank && hasPracticeQuestions(topic.slug),
  }));
}
