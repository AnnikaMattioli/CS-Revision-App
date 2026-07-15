import { NextResponse } from "next/server";
import { z } from "zod";
import { hasSupabaseConfig } from "@/lib/env";
import { rateLimit } from "@/lib/security/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({ confirmation: z.literal("DELETE") });

export async function DELETE(request: Request) {
  const limited = rateLimit(request, "account-delete", { limit: 30, windowMs: 60 * 60_000 });
  if (limited) return limited;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Type DELETE to confirm account deletion." }, { status: 400 });
  if (!hasSupabaseConfig()) return NextResponse.json({ deleted: true, demo: true }, { headers: { "cache-control": "private, no-store" } });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in again before deleting your account." }, { status: 401 });
  const { error } = await createAdminClient().auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: "Your account could not be deleted. Please try again." }, { status: 500 });
  return NextResponse.json({ deleted: true }, { headers: { "cache-control": "private, no-store" } });
}
