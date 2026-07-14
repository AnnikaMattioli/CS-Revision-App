import type { PracticeAnswer, ProtectedQuestion, PublicQuestion, QuestionResult } from "@/types/practice";

const normalise = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");
const empty = (answer: PracticeAnswer) => answer === null || answer === "" || (Array.isArray(answer) && answer.length === 0) || (typeof answer === "object" && !Array.isArray(answer) && Object.keys(answer).length === 0);

export function markQuestion(question: ProtectedQuestion, answer: PracticeAnswer): QuestionResult {
  if (empty(answer)) return result(question, answer, 0, [], rubricDescriptions(question), [], "Answer this question before submitting next time.", "unanswered");
  const rule = question.rule; let marks = 0; const earned: string[] = []; const missing: string[] = []; const contradictions: string[] = [];

  if (rule.kind === "exact" && typeof answer === "string") marks = rule.acceptable.some((item) => (rule.caseSensitive ? answer.trim() === item.trim() : normalise(answer) === normalise(item))) ? question.marks : 0;
  if (rule.kind === "boolean" && typeof answer === "string") marks = (normalise(answer) === String(rule.correct)) ? question.marks : 0;
  if (rule.kind === "numeric" && typeof answer === "string") { const numeric = Number(answer.replace(/,/g, "").replace(/[a-zA-Z]+/g, "").trim()); marks = Number.isFinite(numeric) && Math.abs(numeric - rule.correct) <= rule.tolerance ? question.marks : 0; }
  if (rule.kind === "set" && Array.isArray(answer)) {
    const correct = new Set(rule.correct); const selectedCorrect = answer.filter((item) => correct.has(item)).length; const incorrect = answer.filter((item) => !correct.has(item)).length;
    marks = rule.partialCredit ? Math.max(0, Math.min(question.marks, selectedCorrect - incorrect)) : (selectedCorrect === correct.size && incorrect === 0 ? question.marks : 0);
  }
  if (rule.kind === "ordering" && Array.isArray(answer)) { const correctPositions = answer.filter((item, index) => item === rule.correct[index]).length; marks = Math.floor((correctPositions / rule.correct.length) * question.marks); }
  if (rule.kind === "matching" && answer && typeof answer === "object" && !Array.isArray(answer)) { const correctPairs = Object.entries(rule.correct).filter(([key, value]) => answer[key] === value).length; marks = Math.min(question.marks, correctPairs); }
  if (rule.kind === "rubric" && typeof answer === "string") {
    const text = normalise(answer);
    for (const point of rule.points) {
      const groups = [point.patterns, ...(point.alternatives ?? [])]; const found = groups.some((group) => group.some((pattern) => text.includes(normalise(pattern))));
      if (found) { marks += 1; earned.push(point.description); } else missing.push(point.description);
    }
    for (const contradiction of rule.contradictions ?? []) if (contradiction.patterns.some((pattern) => text.includes(normalise(pattern)))) contradictions.push(contradiction.feedback);
    marks = Math.min(question.marks, Math.max(0, marks - contradictions.length));
  }
  const status = marks === question.marks ? "correct" : marks > 0 ? "partially_correct" : "incorrect";
  if (rule.kind !== "rubric") { if (marks > 0) earned.push("Correct response"); else missing.push(question.correctAnswer); }
  const improvement = marks === question.marks ? "Well done—your answer demonstrates the required knowledge." : missing.length ? `Include: ${missing.join("; ")}.` : `Review ${question.topicTitle} and try a similar question.`;
  return result(question, answer, marks, earned, missing, contradictions, improvement, status);
}

function rubricDescriptions(question: ProtectedQuestion) { return question.rule.kind === "rubric" ? question.rule.points.map((point) => point.description) : [question.correctAnswer]; }
function result(question: ProtectedQuestion, answer: PracticeAnswer, marksAwarded: number, earnedConcepts: string[], missingConcepts: string[], contradictions: string[], improvement: string, status: QuestionResult["status"]): QuestionResult {
  const publicQuestion: PublicQuestion = { id: question.id, topicSlug: question.topicSlug, topicTitle: question.topicTitle, type: question.type, difficulty: question.difficulty, prompt: question.prompt, marks: question.marks, estimatedSeconds: question.estimatedSeconds, options: question.options, items: question.items, targets: question.targets, code: question.code, hint: question.hint, lessonHref: question.lessonHref };
  return { question: publicQuestion, answer, marksAwarded, marksAvailable: question.marks, status, correctAnswer: question.correctAnswer, explanation: question.explanation, commonMistake: question.commonMistake, modelAnswer: question.modelAnswer, earnedConcepts, missingConcepts, contradictions, improvement };
}
