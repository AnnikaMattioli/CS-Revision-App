import "server-only";
import { hasSupabaseConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function requireTeacher() {
  if (!hasSupabaseConfig()) return { demo: true as const, userId: "demo-teacher" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", user.id).in("role", ["teacher", "admin"]).maybeSingle();
  return role ? { demo: false as const, userId: user.id, supabase } : null;
}
