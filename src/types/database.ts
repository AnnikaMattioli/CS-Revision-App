import type { AnswerRule, PracticeAnswer, PublicQuestion, QuestionResult } from "@/types/practice";

export type UserRole = "student" | "teacher" | "admin";
export type QualificationLevel = "GCSE" | "A_LEVEL";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_colour: string;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_colour?: string;
          onboarding_completed?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      user_roles: {
        Row: { user_id: string; role: UserRole; created_at: string };
        Insert: { user_id: string; role?: UserRole };
        Update: { role?: UserRole };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          accent_colour: string;
          qualification_id: string;
          exam_board_id: string;
          published: boolean;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      user_course_enrolments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: { user_id: string; course_id: string; is_active?: boolean };
        Update: { course_id?: string; is_active?: boolean };
        Relationships: [];
      };
      specification_sections: {
        Row: { id: string; course_id: string; code: string; title: string; description: string; sort_order: number; status: "draft" | "published" | "archived" };
        Insert: never; Update: never; Relationships: [];
      };
      topics: {
        Row: { id: string; specification_section_id: string; slug: string; title: string; description: string; icon: string | null; estimated_minutes: number; learning_objectives: string[]; sort_order: number; status: "draft" | "published" | "archived" };
        Insert: never; Update: never; Relationships: [];
      };
      subtopics: {
        Row: { id: string; topic_id: string; slug: string; title: string; description: string; sort_order: number; status: "draft" | "published" | "archived" };
        Insert: never; Update: never; Relationships: [];
      };
      lessons: {
        Row: { id: string; subtopic_id: string; slug: string; title: string; summary: string; estimated_minutes: number; sort_order: number; status: "draft" | "published" | "archived" };
        Insert: never; Update: never; Relationships: [];
      };
      lesson_sections: {
        Row: { id: string; lesson_id: string; heading: string; body: { paragraphs?: string[]; callout?: { type: "definition" | "tip" | "warning"; title: string; text: string } }; sort_order: number };
        Insert: never; Update: never; Relationships: [];
      };
      flashcards: {
        Row: { id: string; subtopic_id: string; front: string; back: string; hint: string | null; sort_order: number; status: "draft" | "published" | "archived" };
        Insert: never; Update: never; Relationships: [];
      };
      flashcard_reviews: {
        Row: { id: string; user_id: string; flashcard_id: string; rating: number; reviewed_at: string; next_review_at: string | null };
        Insert: { user_id: string; flashcard_id: string; rating: number; next_review_at?: string | null };
        Update: never; Relationships: [];
      };
      worked_solutions: {
        Row: { id: string; subtopic_id: string; title: string; prompt: string; steps: Array<{ title: string; explanation: string; working?: string }>; final_answer: string; status: "draft" | "published" | "archived" };
        Insert: never; Update: never; Relationships: [];
      };
      lesson_progress: {
        Row: { user_id: string; lesson_id: string; completed: boolean; progress_percent: number; last_viewed_at: string; completed_at: string | null };
        Insert: { user_id: string; lesson_id: string; completed?: boolean; progress_percent?: number; completed_at?: string | null };
        Update: { completed?: boolean; progress_percent?: number; completed_at?: string | null };
        Relationships: [];
      };
      questions: {
        Row: { id: string; subtopic_id: string; type: string; difficulty: string; prompt: PublicQuestion; marks: number; calculator_allowed: boolean; status: "draft" | "published" | "archived"; version: number; created_by: string | null; archived_at: string | null; created_at: string; updated_at: string };
        Insert: never; Update: never; Relationships: [];
      };
      question_answer_rules: {
        Row: { id: string; question_id: string; rule_type: string; rule: AnswerRule; feedback: string | null; created_at: string; updated_at: string };
        Insert: never; Update: never; Relationships: [];
      };
      practice_sets: {
        Row: { id: string; owner_id: string | null; course_id: string; title: string; mode: string; time_limit_seconds: number | null; exam_kind: string | null; allow_backwards: boolean; warn_unanswered: boolean; results_release: string; results_released_at: string | null; grade_boundaries: unknown | null; configuration: unknown; created_at: string };
        Insert: { owner_id: string; course_id: string; title: string; mode?: string; time_limit_seconds?: number | null; exam_kind?: string | null; allow_backwards?: boolean; warn_unanswered?: boolean; results_release?: string; results_released_at?: string | null; grade_boundaries?: unknown | null; configuration?: unknown };
        Update: never; Relationships: [];
      };
      practice_set_questions: {
        Row: { practice_set_id: string; question_id: string; sort_order: number };
        Insert: { practice_set_id: string; question_id: string; sort_order: number };
        Update: never; Relationships: [];
      };
      attempts: {
        Row: { id: string; user_id: string; practice_set_id: string; status: "in_progress" | "submitted" | "marked" | "abandoned"; started_at: string; deadline_at: string | null; auto_submitted: boolean; submitted_at: string | null; marked_at: string | null; score: number | null; available_marks: number | null; duration_seconds: number | null; updated_at: string };
        Insert: { user_id: string; practice_set_id: string; status?: "in_progress"; deadline_at?: string | null };
        Update: { status?: "submitted" | "marked"; auto_submitted?: boolean; submitted_at?: string; marked_at?: string; score?: number; available_marks?: number; duration_seconds?: number };
        Relationships: [];
      };
      attempt_answers: {
        Row: { id: string; attempt_id: string; question_id: string; answer: PracticeAnswer; flagged: boolean; saved_at: string };
        Insert: { attempt_id: string; question_id: string; answer: PracticeAnswer; flagged?: boolean };
        Update: { answer?: PracticeAnswer; flagged?: boolean; saved_at?: string };
        Relationships: [];
      };
      marking_results: {
        Row: { id: string; attempt_answer_id: string; marks_awarded: number; feedback: QuestionResult; rubric_evidence: unknown[]; marked_by: string; created_at: string };
        Insert: { attempt_answer_id: string; marks_awarded: number; feedback: QuestionResult; rubric_evidence?: unknown[]; marked_by?: string };
        Update: never; Relationships: [];
      };
      topic_mastery: {
        Row: { user_id: string; topic_id: string; mastery_score: number; confidence: "new" | "beginning" | "developing" | "secure" | "mastered"; questions_seen: number; accuracy_score: number; trend: string; explanation: string; updated_at: string };
        Insert: { user_id: string; topic_id: string; mastery_score: number; confidence: "new" | "beginning" | "developing" | "secure" | "mastered"; questions_seen: number; accuracy_score?: number; trend?: string; explanation?: string; updated_at?: string };
        Update: { mastery_score?: number; confidence?: "new" | "beginning" | "developing" | "secure" | "mastered"; questions_seen?: number; accuracy_score?: number; trend?: string; explanation?: string; updated_at?: string };
        Relationships: [];
      };
      study_activity_days: {
        Row: { user_id: string; activity_date: string; questions_answered: number; lessons_completed: number; flashcards_reviewed: number; active_minutes: number; created_at: string; updated_at: string };
        Insert: { user_id: string; activity_date: string; questions_answered?: number; lessons_completed?: number; flashcards_reviewed?: number; active_minutes?: number };
        Update: { questions_answered?: number; lessons_completed?: number; flashcards_reviewed?: number; active_minutes?: number; updated_at?: string };
        Relationships: [];
      };
      exam_question_timings: {
        Row: { attempt_id: string; question_id: string; seconds_spent: number; created_at: string };
        Insert: { attempt_id: string; question_id: string; seconds_spent: number };
        Update: never; Relationships: [];
      };
      achievements: {
        Row: { id: string; code: string; title: string; description: string; icon: string; criteria: unknown; published: boolean; created_at: string };
        Insert: never; Update: never; Relationships: [];
      };
      user_achievements: {
        Row: { user_id: string; achievement_id: string; earned_at: string };
        Insert: { user_id: string; achievement_id: string; earned_at?: string };
        Update: never; Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: { app_role: UserRole; qualification_level: QualificationLevel };
    CompositeTypes: Record<string, never>;
  };
};
