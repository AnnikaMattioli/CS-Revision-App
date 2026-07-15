import { questionBank } from "@/lib/practice/question-bank";
import type { AdminContentItem, AdminQuestion, AdminReport, AdminUser, AuditEntry } from "@/types/admin";

export const demoAdminQuestions: AdminQuestion[] = questionBank.map((q, index) => ({ id: q.id, prompt: q.prompt, type: q.type, difficulty: q.difficulty, marks: q.marks, topic: q.topicTitle, status: index < 8 ? "published" : "draft", attempts: [42,35,28,51,24,18,31,26,22,39][index], averagePercent: [78,62,84,71,49,55,76,68,44,59][index], reportCount: index === 4 ? 2 : index === 9 ? 1 : 0 }));
export const demoAdminReports: AdminReport[] = [
  { id: "report-1", questionId: questionBank[4].id, category: "marking_error", details: "A correct explanation using the phrase storage drive was not recognised.", status: "open", createdAt: "2026-07-15T08:20:00Z", questionPrompt: questionBank[4].prompt },
  { id: "report-2", questionId: questionBank[9].id, category: "unclear_wording", details: "Please clarify whether each protocol should be used exactly once.", status: "reviewing", internalNotes: "Checking wording against the matching renderer.", createdAt: "2026-07-14T14:10:00Z", questionPrompt: questionBank[9].prompt },
];
export const demoAdminUsers: AdminUser[] = [
  { id: "demo-admin", displayName: "Alex Admin", role: "admin" }, { id: "demo-teacher", displayName: "Taylor Teacher", role: "teacher" }, { id: "demo-student", displayName: "Maya Student", role: "student" },
];
export const demoAudit: AuditEntry[] = [
  { id: "audit-1", action: "question.published", entityType: "question", entityId: questionBank[0].id, actorLabel: "Alex Admin", metadata: { from: "draft", to: "published" }, createdAt: "2026-07-15T08:10:00Z" },
  { id: "audit-2", action: "report.reviewed", entityType: "question_report", entityId: "report-2", actorLabel: "Alex Admin", metadata: { status: "reviewing" }, createdAt: "2026-07-14T14:15:00Z" },
];
export const demoContent: AdminContentItem[] = [
  { id: "course-1", kind: "course", title: "OCR GCSE Computer Science", detail: "3 representative topics", status: "published" },
  { id: "topic-1", kind: "topic", title: "Systems architecture", detail: "2 lessons · 3 flashcards", status: "published" },
  { id: "topic-2", kind: "topic", title: "Memory and storage", detail: "2 lessons · 3 flashcards", status: "published" },
  { id: "topic-3", kind: "topic", title: "Networks and protocols", detail: "2 lessons · 3 flashcards", status: "published" },
  { id: "lesson-1", kind: "lesson", title: "Inside the CPU", detail: "Systems architecture", status: "published" },
  { id: "flashcard-1", kind: "flashcard", title: "What does the control unit do?", detail: "Systems architecture", status: "published" },
  { id: "solution-1", kind: "worked_solution", title: "Comparing CPU performance", detail: "4-mark worked solution", status: "published" },
];
