export type AssignmentStatus = "draft" | "published" | "closed";
export type AssignmentTargetType = "topic" | "practice_set";

export type ClassStudent = {
  id: string;
  displayName: string;
  joinedAt: string;
  assignmentCompletion: number;
  averageMastery: number;
  lastActive?: string;
};

export type ClassAssignment = {
  id: string;
  title: string;
  instructions: string;
  targetType: AssignmentTargetType;
  targetLabel: string;
  dueAt?: string;
  status: AssignmentStatus;
  completedCount: number;
  studentCount: number;
};

export type TeacherClass = {
  id: string;
  name: string;
  courseTitle: string;
  joinCodeHint: string;
  archived: boolean;
  students: ClassStudent[];
  assignments: ClassAssignment[];
};

export type TopicClassInsight = { topicId: string; title: string; averageMastery: number; secureStudents: number; studentCount: number };
