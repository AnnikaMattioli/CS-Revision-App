import "server-only";
import { hasSupabaseConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export type CurrentAccount = {
  userId: string;
  displayName: string;
  role: UserRole;
  onboardingComplete: boolean;
};

export async function getCurrentAccount(): Promise<CurrentAccount | null> {
  if (!hasSupabaseConfig()) return { userId: "demo-student", displayName: "Demo Student", role: "student", onboardingComplete: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("display_name,onboarding_completed,onboarding_version").eq("id", user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);
  const values = new Set((roles ?? []).map((item) => item.role));
  const role: UserRole = values.has("admin") ? "admin" : values.has("teacher") ? "teacher" : "student";
  return {
    userId: user.id,
    displayName: profile?.display_name ?? user.user_metadata.display_name ?? "Student",
    role,
    onboardingComplete: Boolean(profile?.onboarding_completed && (profile?.onboarding_version ?? 1) >= 2),
  };
}
