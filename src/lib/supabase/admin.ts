import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

export function createAdminClient() {
  if (!env.supabaseUrl || !env.supabaseSecretKey) throw new Error("Server-side Supabase secret is not configured.");
  return createClient<Database>(env.supabaseUrl, env.supabaseSecretKey, { auth: { autoRefreshToken: false, persistSession: false } });
}
