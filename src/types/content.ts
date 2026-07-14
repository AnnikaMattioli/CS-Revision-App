export type LessonSection = {
  id: string;
  heading: string;
  body: string[];
  callout?: { type: "definition" | "tip" | "warning"; title: string; text: string };
  code?: string;
};

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  sections: LessonSection[];
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  hint?: string;
};

export type WorkedSolution = {
  id: string;
  slug: string;
  title: string;
  prompt: string;
  steps: Array<{ title: string; explanation: string; working?: string }>;
  finalAnswer: string;
  topicSlug: string;
  topicTitle: string;
};

export type Topic = {
  id: string;
  slug: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  colour: string;
  estimatedMinutes: number;
  learningObjectives: string[];
  mastery: number;
  subtopicTitle: string;
  lessons: Lesson[];
  flashcards: Flashcard[];
  workedSolutions: WorkedSolution[];
};

export type CourseContent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  qualification: string;
  examBoard: string;
  topics: Topic[];
};
