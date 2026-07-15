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
          onboarding_version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_colour?: string;
          onboarding_completed?: boolean;
          onboarding_version?: number;
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
        Insert: { qualification_id: string; exam_board_id: string; slug: string; title: string; description?: string; accent_colour?: string; published?: boolean };
        Update: { title?: string; description?: string; accent_colour?: string; published?: boolean };
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
        Insert: { course_id: string; code: string; title: string; description?: string; sort_order?: number; status?: "draft" | "published" | "archived" }; Update: { title?: string; description?: string; sort_order?: number; status?: "draft" | "published" | "archived" }; Relationships: [];
      };
      topics: {
        Row: { id: string; specification_section_id: string; slug: string; title: string; description: string; icon: string | null; estimated_minutes: number; learning_objectives: string[]; sort_order: number; status: "draft" | "published" | "archived" };
        Insert: { specification_section_id: string; slug: string; title: string; description?: string; icon?: string | null; estimated_minutes?: number; learning_objectives?: string[]; sort_order?: number; status?: "draft" | "published" | "archived" }; Update: { title?: string; description?: string; icon?: string | null; estimated_minutes?: number; learning_objectives?: string[]; sort_order?: number; status?: "draft" | "published" | "archived" }; Relationships: [];
      };
      subtopics: {
        Row: { id: string; topic_id: string; slug: string; title: string; description: string; sort_order: number; status: "draft" | "published" | "archived" };
        Insert: { topic_id: string; slug: string; title: string; description?: string; sort_order?: number; status?: "draft" | "published" | "archived" }; Update: { title?: string; description?: string; sort_order?: number; status?: "draft" | "published" | "archived" }; Relationships: [];
      };
      lessons: {
        Row: { id: string; subtopic_id: string; slug: string; title: string; summary: string; estimated_minutes: number; sort_order: number; status: "draft" | "published" | "archived" };
        Insert: { subtopic_id: string; slug: string; title: string; summary?: string; estimated_minutes?: number; sort_order?: number; status?: "draft" | "published" | "archived" }; Update: { title?: string; summary?: string; estimated_minutes?: number; sort_order?: number; status?: "draft" | "published" | "archived" }; Relationships: [];
      };
      lesson_sections: {
        Row: { id: string; lesson_id: string; heading: string; body: { paragraphs?: string[]; callout?: { type: "definition" | "tip" | "warning"; title: string; text: string } }; sort_order: number };
        Insert: { lesson_id: string; heading: string; body?: unknown; sort_order?: number }; Update: { heading?: string; body?: unknown; sort_order?: number }; Relationships: [];
      };
      flashcards: {
        Row: { id: string; subtopic_id: string; front: string; back: string; hint: string | null; sort_order: number; status: "draft" | "published" | "archived" };
        Insert: { subtopic_id: string; front: string; back: string; hint?: string | null; sort_order?: number; status?: "draft" | "published" | "archived" }; Update: { front?: string; back?: string; hint?: string | null; sort_order?: number; status?: "draft" | "published" | "archived" }; Relationships: [];
      };
      flashcard_reviews: {
        Row: { id: string; user_id: string; flashcard_id: string; rating: number; reviewed_at: string; next_review_at: string | null };
        Insert: { user_id: string; flashcard_id: string; rating: number; next_review_at?: string | null };
        Update: never; Relationships: [];
      };
      worked_solutions: {
        Row: { id: string; subtopic_id: string; title: string; prompt: string; steps: Array<{ title: string; explanation: string; working?: string }>; final_answer: string; status: "draft" | "published" | "archived" };
        Insert: { subtopic_id: string; title: string; prompt: string; steps?: unknown; final_answer: string; status?: "draft" | "published" | "archived" }; Update: { title?: string; prompt?: string; steps?: unknown; final_answer?: string; status?: "draft" | "published" | "archived" }; Relationships: [];
      };
      lesson_progress: {
        Row: { user_id: string; lesson_id: string; completed: boolean; progress_percent: number; last_viewed_at: string; completed_at: string | null };
        Insert: { user_id: string; lesson_id: string; completed?: boolean; progress_percent?: number; completed_at?: string | null };
        Update: { completed?: boolean; progress_percent?: number; completed_at?: string | null };
        Relationships: [];
      };
      questions: {
        Row: { id: string; subtopic_id: string; type: string; difficulty: string; prompt: PublicQuestion; marks: number; calculator_allowed: boolean; status: "draft" | "published" | "archived"; version: number; created_by: string | null; archived_at: string | null; estimated_seconds: number; stimulus: string | null; image_ref: string | null; code_block: string | null; explanation: string; hints: string[]; common_mistakes: string[]; source_type: string; source_date: string | null; import_key: string | null; created_at: string; updated_at: string };
        Insert: { subtopic_id: string; type: string; difficulty: string; prompt: unknown; marks: number; calculator_allowed?: boolean; status?: "draft" | "published" | "archived"; created_by?: string | null; estimated_seconds?: number; stimulus?: string | null; image_ref?: string | null; code_block?: string | null; explanation?: string; hints?: string[]; common_mistakes?: string[]; source_type?: string; source_date?: string | null; import_key?: string | null }; Update: { subtopic_id?: string; type?: string; difficulty?: string; prompt?: unknown; marks?: number; calculator_allowed?: boolean; status?: "draft" | "published" | "archived"; archived_at?: string | null; version?: number; estimated_seconds?: number; stimulus?: string | null; image_ref?: string | null; code_block?: string | null; explanation?: string; hints?: string[]; common_mistakes?: string[] }; Relationships: [];
      };
      question_answer_rules: {
        Row: { id: string; question_id: string; rule_type: string; rule: AnswerRule; feedback: string | null; created_at: string; updated_at: string };
        Insert: { question_id: string; rule_type: string; rule: AnswerRule; feedback?: string | null }; Update: { rule_type?: string; rule?: AnswerRule; feedback?: string | null }; Relationships: [];
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
      classes: {
        Row: { id: string; teacher_id: string; course_id: string | null; name: string; join_code_hash: string; join_code_hint: string; archived_at: string | null; join_code_rotated_at: string; created_at: string; updated_at: string };
        Insert: { teacher_id: string; course_id?: string | null; name: string; join_code_hash: string; join_code_hint: string };
        Update: { name?: string; join_code_hash?: string; join_code_hint?: string; join_code_rotated_at?: string; archived_at?: string | null };
        Relationships: [];
      };
      class_memberships: {
        Row: { class_id: string; student_id: string; joined_at: string; removed_at: string | null };
        Insert: { class_id: string; student_id: string; removed_at?: string | null };
        Update: { removed_at?: string | null };
        Relationships: [];
      };
      assignments: {
        Row: { id: string; class_id: string; title: string; instructions: string; due_at: string | null; status: "draft" | "published" | "closed"; created_at: string; updated_at: string };
        Insert: { class_id: string; title: string; instructions?: string; due_at?: string | null; status?: "draft" | "published" | "closed" };
        Update: { title?: string; instructions?: string; due_at?: string | null; status?: "draft" | "published" | "closed" };
        Relationships: [];
      };
      assignment_targets: {
        Row: { id: string; assignment_id: string; target_type: "topic" | "practice_set"; topic_id: string | null; practice_set_id: string | null };
        Insert: { assignment_id: string; target_type: "topic" | "practice_set"; topic_id?: string | null; practice_set_id?: string | null };
        Update: never; Relationships: [];
      };
      assignment_submissions: {
        Row: { assignment_id: string; student_id: string; attempt_id: string | null; submitted_at: string };
        Insert: { assignment_id: string; student_id: string; attempt_id?: string | null; submitted_at?: string };
        Update: { attempt_id?: string | null; submitted_at?: string }; Relationships: [];
      };
      question_reports: {
        Row: { id: string; question_id: string | null; reporter_id: string; category: string; details: string; status: "open" | "reviewing" | "resolved" | "dismissed"; internal_notes: string | null; resolved_by: string | null; created_at: string; updated_at: string };
        Insert: { question_id?: string | null; reporter_id: string; category: string; details: string }; Update: { status?: "open" | "reviewing" | "resolved" | "dismissed"; internal_notes?: string | null; resolved_by?: string | null }; Relationships: [];
      };
      content_versions: { Row: { id: string; entity_type: string; entity_id: string; version: number; snapshot: unknown; changed_by: string; created_at: string }; Insert: { entity_type: string; entity_id: string; version: number; snapshot: unknown; changed_by: string }; Update: never; Relationships: [] };
      admin_audit_logs: { Row: { id: string; actor_id: string | null; action: string; entity_type: string; entity_id: string | null; metadata: Record<string, unknown>; created_at: string }; Insert: { actor_id?: string | null; action: string; entity_type: string; entity_id?: string | null; metadata?: Record<string, unknown> }; Update: never; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: {
      complete_onboarding: { Args: { requested_role: "student" | "teacher"; requested_course: string }; Returns: undefined };
      join_class_by_hash: { Args: { requested_hash: string }; Returns: Array<{ class_id: string; class_name: string }> };
      teacher_class_students: { Args: { requested_class: string }; Returns: Array<{ student_id: string; display_name: string; joined_at: string }> };
      teacher_class_mastery: { Args: { requested_class: string }; Returns: Array<{ topic_id: string; average_mastery: number; secure_students: number; student_count: number }> };
      teacher_student_mastery: { Args: { requested_class: string; requested_student: string }; Returns: Array<{ topic_id: string; mastery_score: number; confidence: string; accuracy_score: number; questions_seen: number; updated_at: string }> };
      admin_users: { Args: Record<string, never>; Returns: Array<{ user_id: string; display_name: string; roles: UserRole[] }> };
      admin_set_user_role: { Args: { target_user: string; requested_role: UserRole }; Returns: undefined };
      admin_question_performance: { Args: Record<string, never>; Returns: Array<{ question_id: string; attempts: number; average_percent: number; incorrect_count: number }> };
      admin_import_questions: { Args: { payload: unknown }; Returns: number };
    };
    Enums: { app_role: UserRole; qualification_level: QualificationLevel };
    CompositeTypes: Record<string, never>;
  };
};
