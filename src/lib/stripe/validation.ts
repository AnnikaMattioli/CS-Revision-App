import { z } from "zod";
import { getPlan, isPlanForAccountType } from "@/lib/billing/config";
import type { AccountType, PlanId } from "@/lib/billing/types";

export const checkoutRequestSchema=z.object({planId:z.enum(["student_plus_monthly","student_plus_annual","teacher_pro_monthly","teacher_pro_annual"])}).strict();
export function isEligibleCheckoutPlan(planId:PlanId,accountType:AccountType){return getPlan(planId).billingInterval!=="free"&&isPlanForAccountType(planId,accountType);}
