"use client";

import { Check, GraduationCap, LoaderCircle, School } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/env";
import { cn } from "@/lib/utils";

const courses = [
  { id: "10000000-0000-0000-0000-000000000001", qualification: "GCSE", board: "OCR" },
  { id: "10000000-0000-0000-0000-000000000002", qualification: "GCSE", board: "AQA" },
  { id: "10000000-0000-0000-0000-000000000003", qualification: "A-level", board: "OCR" },
  { id: "10000000-0000-0000-0000-000000000004", qualification: "A-level", board: "AQA" },
] as const;

type Role = "student" | "teacher";
type Qualification = "GCSE" | "A-level";
type Board = "OCR" | "AQA";

const choiceClass = (selected: boolean) => cn(
  "relative min-h-28 rounded-2xl border-2 p-5 text-left transition hover:-translate-y-0.5",
  selected ? "border-[var(--violet)] bg-violet-50 dark:bg-violet-500/10" : "border-[var(--border)] bg-[var(--surface)]",
);

export function CoursePicker({ onboarding = false }: { onboarding?: boolean }) {
  const [role, setRole] = useState<Role>("student");
  const [qualification, setQualification] = useState<Qualification>("GCSE");
  const [board, setBoard] = useState<Board>("OCR");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  const router = useRouter();
  const selected = courses.find((course) => course.qualification === qualification && course.board === board)!;

  async function save() {
    setSaving(true);
    setError(undefined);
    try {
      if (hasSupabaseConfig()) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Sign in again to save these choices.");
        if (onboarding) {
          const { error: onboardingError } = await supabase.rpc("complete_onboarding", { requested_role: role, requested_course: selected.id });
          if (onboardingError) throw onboardingError;
        } else {
          const { error: deactivateError } = await supabase.from("user_course_enrolments").update({ is_active: false }).eq("user_id", user.id).eq("is_active", true);
          if (deactivateError) throw deactivateError;
          const { error: enrolError } = await supabase.from("user_course_enrolments").upsert({ user_id: user.id, course_id: selected.id, is_active: true }, { onConflict: "user_id,course_id" });
          if (enrolError) throw enrolError;
        }
      } else if (onboarding) {
        window.localStorage.setItem("bytewise:demo-role", role);
        window.localStorage.setItem("bytewise:demo-course", selected.id);
        document.cookie = `bytewise-demo-role=${role}; Path=/; SameSite=Lax`;
      }
      router.push(onboarding && role === "teacher" ? "/teacher" : "/dashboard");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save your choices.");
      setSaving(false);
    }
  }

  return <div className="mt-8 space-y-8">
    {onboarding ? <fieldset><legend className="text-xl font-black">First, how will you use Bytewise?</legend><div className="mt-4 grid gap-4 sm:grid-cols-2">
      <button type="button" onClick={() => setRole("student")} className={choiceClass(role === "student")} aria-pressed={role === "student"}><GraduationCap className="text-[var(--violet)]" /><p className="mt-3 text-xl font-black">I’m a student</p><p className="mt-1 text-sm leading-6 text-muted">Revise, practise, track progress and join a teacher’s class with a code.</p>{role === "student" ? <CheckBadge /> : null}</button>
      <button type="button" onClick={() => setRole("teacher")} className={choiceClass(role === "teacher")} aria-pressed={role === "teacher"}><School className="text-[var(--teal)]" /><p className="mt-3 text-xl font-black">I’m a teacher</p><p className="mt-1 text-sm leading-6 text-muted">Create classes, set work and monitor class learning statistics.</p>{role === "teacher" ? <CheckBadge /> : null}</button>
    </div></fieldset> : null}

    <fieldset><legend className="text-xl font-black">{onboarding && role === "teacher" ? "What level do you teach?" : "What level are you studying?"}</legend><div className="mt-4 grid grid-cols-2 gap-4">
      {(["GCSE", "A-level"] as const).map((value) => <button key={value} type="button" onClick={() => setQualification(value)} className={choiceClass(qualification === value)} aria-pressed={qualification === value}><p className="text-xl font-black">{value}</p><p className="mt-1 text-sm text-muted">Computer Science</p>{qualification === value ? <CheckBadge /> : null}</button>)}
    </div></fieldset>

    <fieldset><legend className="text-xl font-black">Which exam board?</legend><div className="mt-4 grid grid-cols-2 gap-4">
      {(["OCR", "AQA"] as const).map((value) => <button key={value} type="button" onClick={() => setBoard(value)} className={choiceClass(board === value)} aria-pressed={board === value}><p className="text-2xl font-black">{value}</p><p className="mt-1 text-sm text-muted">{qualification} course</p>{board === value ? <CheckBadge /> : null}</button>)}
    </div></fieldset>

    {error ? <p role="alert" className="rounded-xl bg-red-50 p-3 font-bold text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p> : null}
    <button onClick={save} disabled={saving} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--violet)] px-6 font-black text-white shadow-lg shadow-violet-500/20 disabled:opacity-70">{saving ? <LoaderCircle className="animate-spin" size={18} /> : null}{onboarding ? `Continue as a ${role}` : "Save my course"}</button>
  </div>;
}

function CheckBadge() {
  return <span className="absolute right-4 top-4 grid size-7 place-items-center rounded-full bg-[var(--violet)] text-white"><Check size={16} /></span>;
}
