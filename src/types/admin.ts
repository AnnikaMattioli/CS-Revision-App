import type { AnswerRule, PracticeQuestionType } from "@/types/practice";
import type { UserRole } from "@/types/database";

export type ContentStatus = "draft" | "published" | "archived";
export type AdminQuestion = { id: string; prompt: string; type: PracticeQuestionType; difficulty: string; marks: number; topic: string; status: ContentStatus; attempts: number; averagePercent?: number; reportCount: number };
export type AdminReport = { id: string; questionId?: string; category: string; details: string; status: "open" | "reviewing" | "resolved" | "dismissed"; internalNotes?: string; createdAt: string; questionPrompt?: string };
export type AdminUser = { id: string; displayName: string; role: UserRole };
export type AuditEntry = { id: string; action: string; entityType: string; entityId?: string; actorLabel: string; metadata: Record<string, unknown>; createdAt: string };
export type AdminContentItem = { id: string; kind: "course" | "topic" | "lesson" | "flashcard" | "worked_solution"; title: string; detail: string; status: ContentStatus };
export type QuestionImportRow = { importKey: string; subtopicId: string; type: PracticeQuestionType; difficulty: "foundation" | "standard" | "stretch"; prompt: string; marks: number; estimatedSeconds: number; calculatorAllowed: boolean; ruleType: string; answerRule: AnswerRule; feedback?: string; explanation: string; hints: string[]; commonMistakes: string[]; stimulus?: string; imageRef?: string; codeBlock?: string };
export type ImportValidation = { valid: Array<{ row: number; value: QuestionImportRow }>; invalid: Array<{ row: number; errors: string[]; source: unknown }> };
