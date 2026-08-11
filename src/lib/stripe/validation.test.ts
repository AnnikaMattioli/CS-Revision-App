import {describe,expect,it} from "vitest";
import {checkoutRequestSchema,isEligibleCheckoutPlan} from "./validation";
describe("Stripe checkout validation",()=>{
  it("accepts only approved internal paid plan identifiers",()=>{expect(checkoutRequestSchema.safeParse({planId:"student_plus_monthly"}).success).toBe(true);expect(checkoutRequestSchema.safeParse({planId:"price_attacker"}).success).toBe(false);});
  it("rejects arbitrary price IDs even alongside a valid plan",()=>{expect(checkoutRequestSchema.safeParse({planId:"student_plus_monthly",priceId:"price_attacker"}).success).toBe(false);});
  it("separates student and teacher checkout families",()=>{expect(isEligibleCheckoutPlan("student_plus_annual","student")).toBe(true);expect(isEligibleCheckoutPlan("student_plus_annual","teacher")).toBe(false);expect(isEligibleCheckoutPlan("teacher_pro_monthly","student")).toBe(false);});
});
