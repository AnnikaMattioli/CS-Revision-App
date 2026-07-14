export type PracticeQuestionType = "multiple_choice" | "multiple_select" | "boolean" | "fill_blank" | "short_answer" | "extended_answer" | "numerical" | "ordering" | "matching" | "code_trace";
export type PracticeDifficulty = "foundation" | "developing" | "secure" | "advanced" | "exam_challenge";
export type PracticeAnswer = string | string[] | Record<string, string> | null;

export type PublicQuestion = {
  id: string;
  topicSlug: string;
  topicTitle: string;
  type: PracticeQuestionType;
  difficulty: PracticeDifficulty;
  prompt: string;
  marks: number;
  estimatedSeconds: number;
  options?: Array<{ id: string; label: string }>;
  items?: Array<{ id: string; label: string }>;
  targets?: Array<{ id: string; label: string }>;
  code?: string;
  hint?: string;
  lessonHref: string;
};

export type AnswerRule =
  | { kind: "exact"; acceptable: string[]; caseSensitive?: boolean }
  | { kind: "set"; correct: string[]; partialCredit?: boolean }
  | { kind: "boolean"; correct: boolean }
  | { kind: "numeric"; correct: number; tolerance: number; unit?: string }
  | { kind: "ordering"; correct: string[] }
  | { kind: "matching"; correct: Record<string, string> }
  | { kind: "rubric"; points: Array<{ id: string; description: string; patterns: string[]; alternatives?: string[][] }>; contradictions?: Array<{ patterns: string[]; feedback: string }> };

export type ProtectedQuestion = PublicQuestion & {
  rule: AnswerRule;
  correctAnswer: string;
  explanation: string;
  commonMistake: string;
  modelAnswer?: string;
};

export type QuestionResult = {
  question: PublicQuestion;
  answer: PracticeAnswer;
  marksAwarded: number;
  marksAvailable: number;
  status: "correct" | "partially_correct" | "incorrect" | "unanswered";
  correctAnswer: string;
  explanation: string;
  commonMistake: string;
  modelAnswer?: string;
  earnedConcepts: string[];
  missingConcepts: string[];
  contradictions: string[];
  improvement: string;
};

export type PracticeResult = {
  attemptId: string;
  submittedAt: string;
  durationSeconds: number;
  score: number;
  availableMarks: number;
  percentage: number;
  results: QuestionResult[];
  masteryUpdates?: Array<{ topicSlug: string; topicTitle: string; previousScore: number; score: number; label: string; change: number }>;
};
