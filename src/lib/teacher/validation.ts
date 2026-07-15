import { z } from "zod";

const databaseId = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
export const classSchema = z.object({ name: z.string().trim().min(2).max(80), courseId: databaseId.optional() });
export const joinClassSchema = z.object({ code: z.string().min(4).max(14) });
export const assignmentSchema = z.object({
  title: z.string().trim().min(2).max(100),
  instructions: z.string().trim().max(1000).default(""),
  targetType: z.enum(["topic", "practice_set"]),
  topicId: databaseId.optional(),
  practiceSetId: databaseId.optional(),
  timeLimitMinutes: z.number().int().min(5).max(120).optional(),
  dueAt: z.string().datetime().optional(),
  status: z.enum(["draft", "published"]).default("published"),
}).refine((value) => value.targetType !== "topic" || Boolean(value.topicId), "Choose assignment content.");
