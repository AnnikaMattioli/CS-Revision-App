import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  existingSubscription: null as null | { id: string; plan_id: string },
  checkoutCreate: vi.fn(),
  priceRetrieve: vi.fn(),
}));

vi.mock("./client", () => ({
  getStripe: () => ({
    prices: { retrieve: mocks.priceRetrieve },
    checkout: { sessions: { create: mocks.checkoutCreate } },
  }),
}));

vi.mock("./config", async () => {
  const actual = await vi.importActual<typeof import("./config")>("./config");
  return {
    ...actual,
    getStripeConfig: () => ({ NEXT_PUBLIC_SITE_URL: "https://bytewise.example" }),
    getStripePriceId: (planId: string) => `price_${planId}`,
  };
});

function query(result: () => unknown) {
  const chain: Record<string, unknown> = {};
  for (const method of ["select", "eq", "in", "limit"]) chain[method] = vi.fn(() => chain);
  chain.maybeSingle = vi.fn(async () => result());
  return chain;
}

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: (table: string) => {
      if (table === "subscriptions") return query(() => ({ data: mocks.existingSubscription }));
      if (table === "billing_customers") return query(() => ({ data: { stripe_customer_id: "cus_owned" } }));
      throw new Error(`Unexpected table ${table}`);
    },
  }),
}));

import { createCheckoutSession, validateStripePrice } from "./service";

const validStudentPrice = {
  id: "price_student_plus_monthly",
  active: true,
  livemode: false,
  currency: "gbp",
  unit_amount: 599,
  type: "recurring",
  recurring: { interval: "month" },
};

describe("Stripe service trust boundaries", () => {
  beforeEach(() => {
    mocks.existingSubscription = null;
    mocks.checkoutCreate.mockReset().mockResolvedValue({ id: "cs_test_mock", url: "https://checkout.stripe.test/mock" });
    mocks.priceRetrieve.mockReset().mockResolvedValue(validStudentPrice);
  });

  it("validates Stripe's amount, currency, mode and interval before checkout", async () => {
    await expect(validateStripePrice("student_plus_monthly")).resolves.toEqual(validStudentPrice);
    for (const unsafe of [
      { ...validStudentPrice, unit_amount: 1 },
      { ...validStudentPrice, currency: "usd" },
      { ...validStudentPrice, livemode: true },
      { ...validStudentPrice, recurring: { interval: "year" } },
      { ...validStudentPrice, active: false },
    ]) {
      mocks.priceRetrieve.mockResolvedValueOnce(unsafe);
      await expect(validateStripePrice("student_plus_monthly")).rejects.toThrow("does not match");
    }
  });

  it("rejects free and cross-family plans before calling Stripe", async () => {
    await expect(createCheckoutSession({ userId: "student-1", accountType: "student", planId: "teacher_pro_monthly" })).rejects.toThrow("not available");
    await expect(createCheckoutSession({ userId: "student-1", accountType: "student", planId: "student_free" })).rejects.toThrow("not available");
    expect(mocks.checkoutCreate).not.toHaveBeenCalled();
  });

  it("prevents duplicate active subscriptions", async () => {
    mocks.existingSubscription = { id: "sub_internal", plan_id: "student_plus_monthly" };
    await expect(createCheckoutSession({ userId: "student-1", accountType: "student", planId: "student_plus_monthly" })).rejects.toThrow("already have this plan");
    expect(mocks.priceRetrieve).not.toHaveBeenCalled();
    expect(mocks.checkoutCreate).not.toHaveBeenCalled();
  });

  it("creates subscription Checkout with server-owned URLs and metadata", async () => {
    const session = await createCheckoutSession({ userId: "student-1", accountType: "student", planId: "student_plus_monthly" });
    expect(session.url).toContain("checkout.stripe.test");
    expect(mocks.checkoutCreate).toHaveBeenCalledOnce();
    const [payload, options] = mocks.checkoutCreate.mock.calls[0];
    expect(payload).toMatchObject({
      mode: "subscription",
      customer: "cus_owned",
      line_items: [{ price: validStudentPrice.id, quantity: 1 }],
      client_reference_id: "student-1",
      success_url: "https://bytewise.example/billing/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://bytewise.example/billing/cancelled",
      allow_promotion_codes: false,
      metadata: { bytewise_user_id: "student-1", bytewise_plan_id: "student_plus_monthly", bytewise_account_type: "student" },
    });
    expect(options.idempotencyKey).toMatch(/^checkout-student-1-student_plus_monthly-/);
  });
});
