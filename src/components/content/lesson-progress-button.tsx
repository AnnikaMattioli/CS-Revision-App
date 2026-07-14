"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/env";

export function LessonProgressButton({ lessonId }: { lessonId: string }) {
  const key = `bytewise:lesson:${lessonId}`;
  const [complete, setComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      if (!hasSupabaseConfig()) {
        if (!cancelled) setComplete(window.localStorage.getItem(key) === "complete");
        return;
      }
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("lesson_progress").select("completed").eq("user_id", user.id).eq("lesson_id", lessonId).maybeSingle();
      if (!cancelled) setComplete(data?.completed ?? false);
    }, 0);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [key, lessonId]);

  async function toggle() {
    const next = !complete;
    setSaving(true); setMessage(undefined);
    try {
      if (hasSupabaseConfig()) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Sign in to save progress.");
        const { error } = await supabase.from("lesson_progress").upsert({ user_id: user.id, lesson_id: lessonId, completed: next, progress_percent: next ? 100 : 0, completed_at: next ? new Date().toISOString() : null }, { onConflict: "user_id,lesson_id" });
        if (error) throw error;
      } else {
        if (next) window.localStorage.setItem(key, "complete"); else window.localStorage.removeItem(key);
      }
      setComplete(next);
      setMessage(next ? "Lesson marked complete." : "Lesson marked incomplete.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Progress could not be saved."); }
    finally { setSaving(false); }
  }

  return <div><button onClick={toggle} disabled={saving} className={complete ? "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-[var(--teal)] bg-emerald-50 px-5 font-black text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200" : "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--violet)] px-5 font-black text-white shadow-lg shadow-violet-500/20"}>{saving ? <LoaderCircle className="animate-spin" size={19} /> : complete ? <Check size={19} /> : null}{complete ? "Completed" : "Mark lesson complete"}</button>{message && <p role="status" className="sr-only">{message}</p>}</div>;
}
