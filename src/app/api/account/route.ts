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
  const admin=createAdminClient();
  const [{data:subscription},{data:billingCustomer}]=await Promise.all([
    admin.from("subscriptions").select("id,status").eq("user_id",user.id).in("status",["trialing","active","past_due","unpaid","paused","incomplete"]).limit(1).maybeSingle(),
    admin.from("billing_customers").select("id").eq("user_id",user.id).maybeSingle(),
  ]);
  if(subscription)return NextResponse.json({error:"Cancel your active subscription and wait for paid access to end before deleting your account."},{status:409});
  if(billingCustomer)return NextResponse.json({error:"Your billing history must be safely detached before account deletion. Please contact billing support."},{status:409});
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: "Your account could not be deleted. Please try again." }, { status: 500 });
  return NextResponse.json({ deleted: true }, { headers: { "cache-control": "private, no-store" } });
}
