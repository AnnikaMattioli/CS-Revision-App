import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { env } from "@/lib/env";

export function createClient() {
  if (!env.supabaseUrl || !env.supabasePublishableKey) {
    throw new Error("Supabase is not configured. Copy .env.example to .env.local.");
  }
  return createBrowserClient<Database>(env.supabaseUrl, env.supabasePublishableKey);
}
