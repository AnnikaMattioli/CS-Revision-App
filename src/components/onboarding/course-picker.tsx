"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/env";
import { cn } from "@/lib/utils";

const courses = [
  { id: "10000000-0000-0000-0000-000000000001", qualification: "GCSE", board: "OCR", colour: "var(--violet)", emoji: "🧠" },
  { id: "10000000-0000-0000-0000-000000000002", qualification: "GCSE", board: "AQA", colour: "var(--blue)", emoji: "💻" },
  { id: "10000000-0000-0000-0000-000000000003", qualification: "A-level", board: "OCR", colour: "var(--teal)", emoji: "⚙️" },
  { id: "10000000-0000-0000-0000-000000000004", qualification: "A-level", board: "AQA", colour: "var(--coral)", emoji: "🔬" },
];

export function CoursePicker() {
  const [selected, setSelected] = useState(courses[0].id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  const router = useRouter();

  async function save() {
    setSaving(true); setError(undefined);
    try {
      if (hasSupabaseConfig()) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Sign in again to save your course.");
        const { error: enrolError } = await supabase.from("user_course_enrolments").upsert({ user_id: user.id, course_id: selected, is_active: true }, { onConflict: "user_id,course_id" });
        if (enrolError) throw enrolError;
        const { error: profileError } = await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", user.id);
        if (profileError) throw profileError;
      }
      router.push("/dashboard"); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to save your course."); setSaving(false); }
  }

  return <div className="mt-8"><div className="grid gap-4 sm:grid-cols-2">{courses.map((course) => <button key={course.id} type="button" onClick={() => setSelected(course.id)} className={cn("relative rounded-2xl border-2 p-5 text-left transition hover:-translate-y-0.5", selected === course.id ? "border-[var(--violet)] bg-violet-50 dark:bg-violet-500/10" : "border-[var(--border)] bg-[var(--surface)]")} aria-pressed={selected === course.id}><span className="text-3xl">{course.emoji}</span><p className="mt-4 text-xl font-black">{course.qualification}</p><p className="font-bold text-muted">{course.board} Computer Science</p>{selected === course.id && <span className="absolute right-4 top-4 grid size-7 place-items-center rounded-full bg-[var(--violet)] text-white"><Check size={16} /></span>}</button>)}</div>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 font-bold text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}<button onClick={save} disabled={saving} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--violet)] px-6 font-black text-white shadow-lg shadow-violet-500/20 disabled:opacity-70">{saving && <LoaderCircle className="animate-spin" size={18} />}Save my course</button></div>;
}
