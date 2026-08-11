import type { AccountType, EntitlementKey, FeatureKey, PlanDefinition, PlanId } from "./types";

const studentFree: readonly EntitlementKey[] = [
  "student.core_content", "student.standard_practice", "student.basic_progress",
];

const studentPlus: readonly EntitlementKey[] = [
  ...studentFree, "student.ai_tutor", "student.ai_marking", "student.advanced_analytics",
  "student.revision_planner", "student.unlimited_custom_sets", "student.unlimited_mock_papers",
  "student.weekly_report", "student.grade_estimate", "student.advanced_flashcards", "student.progress_export",
];

const teacherFree: readonly EntitlementKey[] = [
  "teacher.create_classes", "teacher.create_assignments", "teacher.basic_analytics",
];

const teacherPro: readonly EntitlementKey[] = [
  ...teacherFree, "teacher.multiple_classes", "teacher.unlimited_assignments", "teacher.advanced_analytics",
  "teacher.csv_export", "teacher.printable_reports", "teacher.assignment_scheduling",
  "teacher.intervention_insights", "teacher.class_tests", "teacher.bulk_management",
];

const studentFreeLimits = {
  "student.max_custom_sets_per_period": 3,
  "student.max_ai_requests_per_period": 0,
  "student.max_generated_papers_per_period": 0,
} as const satisfies Partial<Record<FeatureKey, number>>;

const studentPlusLimits = {
  "student.max_custom_sets_per_period": null,
  "student.max_ai_requests_per_period": 100,
  "student.max_generated_papers_per_period": 20,
} as const satisfies Partial<Record<FeatureKey, number | null>>;

const teacherFreeLimits = {
  "teacher.max_active_classes": 1,
  "teacher.max_active_students": 15,
  "teacher.max_active_assignments": 3,
} as const satisfies Partial<Record<FeatureKey, number>>;

const teacherProLimits = {
  "teacher.max_active_classes": 100,
  "teacher.max_active_students": 2_000,
  "teacher.max_active_assignments": 10_000,
} as const satisfies Partial<Record<FeatureKey, number>>;

export const plans = {
  student_free: { id: "student_free", displayName: "Student Free", accountType: "student", billingInterval: "free", displayPricePence: 0, entitlements: studentFree, limits: studentFreeLimits, publiclyAvailable: true, sortOrder: 10 },
  student_plus_monthly: { id: "student_plus_monthly", displayName: "Student Plus Monthly", accountType: "student", billingInterval: "month", displayPricePence: 599, entitlements: studentPlus, limits: studentPlusLimits, publiclyAvailable: true, sortOrder: 20 },
  student_plus_annual: { id: "student_plus_annual", displayName: "Student Plus Annual", accountType: "student", billingInterval: "year", displayPricePence: 4_900, entitlements: studentPlus, limits: studentPlusLimits, publiclyAvailable: true, recommended: true, sortOrder: 30 },
  teacher_free: { id: "teacher_free", displayName: "Teacher Free", accountType: "teacher", billingInterval: "free", displayPricePence: 0, entitlements: teacherFree, limits: teacherFreeLimits, publiclyAvailable: true, sortOrder: 40 },
  teacher_pro_monthly: { id: "teacher_pro_monthly", displayName: "Teacher Pro Monthly", accountType: "teacher", billingInterval: "month", displayPricePence: 2_499, entitlements: teacherPro, limits: teacherProLimits, publiclyAvailable: true, sortOrder: 50 },
  teacher_pro_annual: { id: "teacher_pro_annual", displayName: "Teacher Pro Annual", accountType: "teacher", billingInterval: "year", displayPricePence: 19_900, entitlements: teacherPro, limits: teacherProLimits, publiclyAvailable: true, recommended: true, sortOrder: 60 },
} as const satisfies Record<PlanId, PlanDefinition>;

export const subscriptionAccessPolicy = {
  accessStatuses: ["trialing", "active"] as const,
  recoverableStatuses: ["past_due"] as const,
  gracePeriodDays: 7,
};

export const allEntitlements = [...new Set(Object.values(plans).flatMap((plan) => plan.entitlements))] as EntitlementKey[];

export function getPlan(planId: PlanId) { return plans[planId]; }
export function getFreePlan(accountType: AccountType) { return plans[accountType === "student" ? "student_free" : "teacher_free"]; }
export function getPublicPlans(accountType: AccountType) { return Object.values(plans).filter((plan) => plan.accountType === accountType && plan.publiclyAvailable).sort((a, b) => a.sortOrder - b.sortOrder); }
export function isPlanForAccountType(planId: PlanId, accountType: AccountType) { return plans[planId].accountType === accountType; }
export function formatPlanPrice(planId: PlanId) { const pence = plans[planId].displayPricePence; return pence === 0 ? "Free" : new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100); }
