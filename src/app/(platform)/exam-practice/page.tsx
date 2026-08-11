import type { Metadata } from "next";
import { ExamSetup } from "@/components/exam/exam-setup";
import { getActiveCourseContent } from "@/lib/content/repository";
import { getPracticeTopicOptions } from "@/lib/practice/course-topics";
import { getCurrentAccount } from "@/lib/auth/account";
import { getRemainingUsage, hasEntitlement } from "@/lib/billing/server";

export const metadata: Metadata = { title: "Exam practice" };

export default async function ExamPracticePage() {
  const [course, account] = await Promise.all([getActiveCourseContent(), getCurrentAccount()]);
  const topics = getPracticeTopicOptions(course);
  const demo = Boolean(account?.userId.startsWith("demo-"));
  const [unlimitedCustom, customRemaining, mockRemaining] = account && !demo ? await Promise.all([hasEntitlement(account.userId, "student.unlimited_custom_sets"), getRemainingUsage(account.userId, "student.max_custom_sets_per_period"), getRemainingUsage(account.userId, "student.max_generated_papers_per_period")]) : [demo, demo ? null : 0, demo ? null : 0];
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10"><div className="mb-8"><p className="font-black text-[var(--coral)]">TIMED EXAM PRACTICE</p><h1 className="mt-2 text-4xl font-black tracking-tight">Ready when you are</h1><p className="mt-3 max-w-3xl text-lg leading-8 text-muted">Build a paper for {course.title}, then work in a focused exam interface with autosave, a clear timer and no hints.</p></div><ExamSetup qualification={course.qualification} examBoard={course.examBoard} topics={topics} unlimitedCustom={unlimitedCustom} customRemaining={customRemaining} mockRemaining={mockRemaining} demo={demo} /></main>;
}
