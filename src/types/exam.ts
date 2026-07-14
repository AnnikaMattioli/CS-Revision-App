import type { PracticeAnswer, PracticeResult, PublicQuestion } from "./practice";

export type ExamKind = "topic" | "mixed" | "custom" | "full_mock" | "assignment";
export type ExamConfig = {
  kind: ExamKind;
  qualification: string;
  examBoard: string;
  topic: string;
  questionCount: number;
  difficulty: string;
  timeLimitMinutes: number;
  allowBackwards: boolean;
  warnUnanswered: boolean;
  resultsRelease: "immediate" | "later";
};
export type ExamSubmission = { attemptId: string; questionIds: string[]; answers: Record<string, PracticeAnswer>; durationSeconds: number; autoSubmitted: boolean; questionTimings: Record<string, number>; resultsRelease?: "immediate" | "later" };
export type ExamResult = PracticeResult & { exam: true; autoSubmitted: boolean; questionTimings: Record<string, number>; config: ExamConfig };
export type PendingExamResult = { attemptId: string; pending: true; submittedAt: string; message: string };
export type ExamQuestionBundle = { questions: PublicQuestion[]; config: ExamConfig };
