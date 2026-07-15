import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { hasSupabaseConfig } from "@/lib/env";
import { getProgressSnapshot } from "@/lib/progress/repository";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAccount } from "@/lib/auth/account";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Dashboard" };

async function getStudentName() {
  if (!hasSupabaseConfig()) return "Student";
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return "Student";
  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();
  return profile?.display_name ?? "Student";
}

export default async function DashboardPage() {
  const account = await getCurrentAccount();
  if (account?.role === "teacher" || account?.role === "admin") redirect("/teacher");
  const [studentName, progress] = await Promise.all([getStudentName(), getProgressSnapshot()]);
  const today = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  return <DashboardOverview initialName={studentName} initialProgress={progress} demo={!hasSupabaseConfig()} today={today} />;
}
