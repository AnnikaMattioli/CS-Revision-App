import type { Metadata } from "next";
import { ExamSetup } from "@/components/exam/exam-setup";
import { getActiveCourseContent } from "@/lib/content/repository";
import { hasPracticeQuestions } from "@/lib/practice/topic-availability";

export const metadata: Metadata = { title: "Exam practice" };

export default async function ExamPracticePage() {
  const course = await getActiveCourseContent();
  const supportsCurrentQuestionBank = course.slug === "ocr-gcse-computer-science";
  const topics = course.topics.map((topic) => ({ slug: topic.slug, title: topic.title, icon: topic.icon, practiceAvailable: supportsCurrentQuestionBank && hasPracticeQuestions(topic.slug) }));
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10"><div className="mb-8"><p className="font-black text-[var(--coral)]">TIMED EXAM PRACTICE</p><h1 className="mt-2 text-4xl font-black tracking-tight">Ready when you are</h1><p className="mt-3 max-w-3xl text-lg leading-8 text-muted">Build a paper for {course.title}, then work in a focused exam interface with autosave, a clear timer and no hints.</p></div><ExamSetup qualification={course.qualification} examBoard={course.examBoard} topics={topics} /></main>;
}
