import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/security/rate-limit";

const answerSchema = z.union([z.string(), z.array(z.string()), z.record(z.string(), z.string()), z.null()]);
const databaseId = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
const schema = z.object({ attemptId: databaseId, questionId: databaseId, answer: answerSchema, flagged: z.boolean() });
export async function POST(request: Request) {
  const limited = rateLimit(request, "practice-autosave", { limit: 240, windowMs: 60_000 }); if (limited) return limited;
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid answer." }, { status: 400 });
  const supabase = await createClient(); const { error } = await supabase.from("attempt_answers").upsert({ attempt_id: parsed.data.attemptId, question_id: parsed.data.questionId, answer: parsed.data.answer, flagged: parsed.data.flagged }, { onConflict: "attempt_id,question_id" });
  return error ? NextResponse.json({ error: "Answer was not saved." }, { status: 403 }) : NextResponse.json({ saved: true });
}
