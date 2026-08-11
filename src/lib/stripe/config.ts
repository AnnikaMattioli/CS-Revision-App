import "server-only";
import { z } from "zod";
import type { PlanId } from "@/lib/billing/types";

const schema = z.object({
  STRIPE_MODE: z.literal("test").default("test"),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_test_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),
  STRIPE_STUDENT_PLUS_MONTHLY_PRICE_ID: z.string().startsWith("price_"),
  STRIPE_STUDENT_PLUS_ANNUAL_PRICE_ID: z.string().startsWith("price_"),
  STRIPE_TEACHER_PRO_MONTHLY_PRICE_ID: z.string().startsWith("price_"),
  STRIPE_TEACHER_PRO_ANNUAL_PRICE_ID: z.string().startsWith("price_"),
  STRIPE_STUDENT_PORTAL_CONFIGURATION_ID: z.string().startsWith("bpc_").optional(),
  STRIPE_TEACHER_PORTAL_CONFIGURATION_ID: z.string().startsWith("bpc_").optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

export function getStripeConfig(options: { requireWebhook?: boolean } = {}) {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) throw new Error("Stripe test-mode environment variables are missing or invalid.");
  if (options.requireWebhook && !parsed.data.STRIPE_WEBHOOK_SECRET) throw new Error("STRIPE_WEBHOOK_SECRET is required for webhook verification.");
  return parsed.data;
}

export function getStripePriceId(planId: PlanId) {
  const env = getStripeConfig();
  const ids: Partial<Record<PlanId,string>> = {
    student_plus_monthly: env.STRIPE_STUDENT_PLUS_MONTHLY_PRICE_ID,
    student_plus_annual: env.STRIPE_STUDENT_PLUS_ANNUAL_PRICE_ID,
    teacher_pro_monthly: env.STRIPE_TEACHER_PRO_MONTHLY_PRICE_ID,
    teacher_pro_annual: env.STRIPE_TEACHER_PRO_ANNUAL_PRICE_ID,
  };
  const id=ids[planId]; if(!id) throw new Error("The selected plan is not purchasable."); return id;
}

export function planIdForStripePrice(priceId:string): PlanId | null {
  const env=getStripeConfig();
  return ({[env.STRIPE_STUDENT_PLUS_MONTHLY_PRICE_ID]:"student_plus_monthly",[env.STRIPE_STUDENT_PLUS_ANNUAL_PRICE_ID]:"student_plus_annual",[env.STRIPE_TEACHER_PRO_MONTHLY_PRICE_ID]:"teacher_pro_monthly",[env.STRIPE_TEACHER_PRO_ANNUAL_PRICE_ID]:"teacher_pro_annual"} as Record<string,PlanId>)[priceId]??null;
}
