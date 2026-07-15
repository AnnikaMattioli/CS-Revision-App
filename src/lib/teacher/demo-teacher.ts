import type { TeacherClass, TopicClassInsight } from "@/types/teacher";

export const demoClass: TeacherClass = {
  id: "demo-class-1",
  name: "Year 10 Computer Science",
  courseTitle: "OCR GCSE Computer Science",
  joinCodeHint: "••••42",
  archived: false,
  students: [
    { id: "demo-student-1", displayName: "Maya R.", joinedAt: "2026-06-18", assignmentCompletion: 100, averageMastery: 68, lastActive: "Today" },
    { id: "demo-student-2", displayName: "Leo K.", joinedAt: "2026-06-19", assignmentCompletion: 50, averageMastery: 52, lastActive: "Yesterday" },
    { id: "demo-student-3", displayName: "Sam P.", joinedAt: "2026-06-20", assignmentCompletion: 50, averageMastery: 43, lastActive: "3 days ago" },
    { id: "demo-student-4", displayName: "Noor A.", joinedAt: "2026-06-21", assignmentCompletion: 0, averageMastery: 35, lastActive: "5 days ago" },
  ],
  assignments: [
    { id: "demo-assignment-1", title: "CPU retrieval check", instructions: "Complete the timed test independently.", targetType: "practice_set", targetLabel: "10-minute timed test", dueAt: "2026-07-18T15:30:00.000Z", status: "published", completedCount: 3, studentCount: 4 },
    { id: "demo-assignment-2", title: "Networks recap", instructions: "Review the topic and complete a practice set.", targetType: "topic", targetLabel: "Networks and protocols", dueAt: "2026-07-22T15:30:00.000Z", status: "published", completedCount: 1, studentCount: 4 },
  ],
};

export const demoClasses: TeacherClass[] = [demoClass];

export const demoClassInsights: TopicClassInsight[] = [
  { topicId: "systems", title: "Systems architecture", averageMastery: 66, secureStudents: 3, studentCount: 4 },
  { topicId: "memory", title: "Memory and storage", averageMastery: 49, secureStudents: 1, studentCount: 4 },
  { topicId: "networks", title: "Networks and protocols", averageMastery: 35, secureStudents: 0, studentCount: 4 },
];
