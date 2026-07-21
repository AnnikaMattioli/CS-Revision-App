import type { PracticeAnswer } from "@/types/practice";

export function answerForPersistence(answer: PracticeAnswer) {
  return answer ?? "";
}

export function answerRowsForSubmission(attemptId: string, questionIds: string[], answers: Record<string, PracticeAnswer>) {
  return questionIds.map((questionId) => ({
    attempt_id: attemptId,
    question_id: questionId,
    answer: answerForPersistence(answers[questionId] ?? null),
    flagged: false,
  }));
}
