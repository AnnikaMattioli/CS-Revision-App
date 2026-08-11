import { describe, expect, it } from "vitest";
import { getPublicPlans, isPlanForAccountType, plans } from "./config";
import { isGrantActive, isSubscriptionActive, remainingUsage, resolveAccess } from "./access";
import type { ComplimentaryGrant, InternalSubscription } from "./types";

const now = new Date("2026-08-10T12:00:00Z");
const studentPlus: InternalSubscription = { id: "sub-1", userId: "student-1", planId: "student_plus_monthly", accountType: "student", status: "active", billingInterval: "month", currentPeriodEnd: "2026-09-10T12:00:00Z", cancelAtPeriodEnd: false };

describe("plan configuration", () => {
  it("keeps prices and plan families central and separate", () => {
    expect(plans.student_plus_monthly.displayPricePence).toBe(599);
    expect(plans.teacher_pro_annual.displayPricePence).toBe(19_900);
    expect(isPlanForAccountType("student_plus_monthly", "teacher")).toBe(false);
    expect(getPublicPlans("student").map((plan) => plan.id)).toEqual(["student_free", "student_plus_monthly", "student_plus_annual"]);
  });
});

describe("subscription access", () => {
  it("grants active subscriptions and keeps student and teacher entitlements separate", () => {
    const access = resolveAccess({ accountType: "student", subscriptions: [studentPlus], now });
    expect(access.entitlements.has("student.ai_tutor")).toBe(true);
    expect(access.entitlements.has("teacher.multiple_classes")).toBe(false);
  });

  it("does not grant ended or expired subscriptions", () => {
    expect(isSubscriptionActive({ ...studentPlus, status: "ended" }, now)).toBe(false);
    expect(isSubscriptionActive({ ...studentPlus, currentPeriodEnd: "2026-08-01T00:00:00Z" }, now)).toBe(false);
    expect(resolveAccess({ accountType: "student", subscriptions: [{ ...studentPlus, status: "past_due", currentPeriodEnd: "2026-08-05T12:00:00Z" }], now }).entitlements.has("student.ai_tutor")).toBe(true);
    expect(resolveAccess({ accountType: "student", subscriptions: [{ ...studentPlus, status: "past_due", currentPeriodEnd: "2026-08-01T00:00:00Z" }], now }).entitlements.has("student.ai_tutor")).toBe(false);
  });

  it("gives administrators a server-role override without mixing account limits", () => {
    const access = resolveAccess({ accountType: "teacher", administrator: true, now });
    expect(access.administratorOverride).toBe(true);
    expect(access.entitlements.has("student.ai_tutor")).toBe(true);
    expect(access.entitlements.has("teacher.bulk_management")).toBe(true);
    expect(access.limits["teacher.max_active_classes"]).toBeNull();
  });
});

describe("complimentary access", () => {
  const grant: ComplimentaryGrant = { id: "grant-1", userId: "student-1", planId: "student_plus_annual", startsAt: "2026-08-01T00:00:00Z", expiresAt: "2026-08-31T23:59:59Z" };

  it("combines an active grant without replacing the base plan", () => {
    const access = resolveAccess({ accountType: "student", grants: [grant], now });
    expect(access.planIds).toEqual(["student_free", "student_plus_annual"]);
    expect(access.entitlements.has("student.progress_export")).toBe(true);
  });

  it("expires and revokes grants automatically during resolution", () => {
    expect(isGrantActive(grant, now)).toBe(true);
    expect(isGrantActive({ ...grant, expiresAt: "2026-08-09T00:00:00Z" }, now)).toBe(false);
    expect(isGrantActive({ ...grant, revokedAt: "2026-08-05T00:00:00Z" }, now)).toBe(false);
  });

  it("rejects cross-family plan grants", () => {
    const access = resolveAccess({ accountType: "student", grants: [{ ...grant, planId: "teacher_pro_annual" }], now });
    expect(access.entitlements.has("teacher.multiple_classes")).toBe(false);
  });
});

describe("usage limits", () => {
  it("calculates finite and unlimited remaining usage", () => {
    expect(remainingUsage(100, 17)).toBe(83);
    expect(remainingUsage(3, 9)).toBe(0);
    expect(remainingUsage(null, 1_000)).toBeNull();
  });

  it("keeps core student revision useful while separating paid generation allowances", () => {
    const free = resolveAccess({ accountType: "student", now });
    const plus = resolveAccess({ accountType: "student", subscriptions: [studentPlus], now });
    expect(free.entitlements.has("student.core_content")).toBe(true);
    expect(free.entitlements.has("student.standard_practice")).toBe(true);
    expect(free.limits["student.max_custom_sets_per_period"]).toBe(3);
    expect(free.limits["student.max_generated_papers_per_period"]).toBe(0);
    expect(plus.limits["student.max_custom_sets_per_period"]).toBeNull();
    expect(plus.limits["student.max_generated_papers_per_period"]).toBe(20);
  });

  it("enforces Teacher Free ceilings and unlocks only teacher capabilities on Pro", () => {
    const free = resolveAccess({ accountType: "teacher", now });
    const pro: InternalSubscription = { ...studentPlus, id: "sub-teacher", userId: "teacher-1", planId: "teacher_pro_monthly", accountType: "teacher", billingInterval: "month" };
    const paid = resolveAccess({ accountType: "teacher", subscriptions: [pro], now });
    expect(free.limits["teacher.max_active_classes"]).toBe(1);
    expect(free.limits["teacher.max_active_students"]).toBe(15);
    expect(free.limits["teacher.max_active_assignments"]).toBe(3);
    expect(free.entitlements.has("teacher.advanced_analytics")).toBe(false);
    expect(paid.entitlements.has("teacher.advanced_analytics")).toBe(true);
    expect(paid.entitlements.has("teacher.class_tests")).toBe(true);
    expect(paid.entitlements.has("student.unlimited_mock_papers")).toBe(false);
  });
});
