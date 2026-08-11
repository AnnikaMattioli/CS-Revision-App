export type AccountType = "student" | "teacher";

export type PlanId =
  | "student_free"
  | "student_plus_monthly"
  | "student_plus_annual"
  | "teacher_free"
  | "teacher_pro_monthly"
  | "teacher_pro_annual";

export type BillingInterval = "free" | "month" | "year";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "unpaid"
  | "paused"
  | "canceled"
  | "ended";

export type EntitlementKey =
  | "student.core_content"
  | "student.standard_practice"
  | "student.basic_progress"
  | "student.ai_tutor"
  | "student.ai_marking"
  | "student.advanced_analytics"
  | "student.revision_planner"
  | "student.unlimited_custom_sets"
  | "student.unlimited_mock_papers"
  | "student.weekly_report"
  | "student.grade_estimate"
  | "student.advanced_flashcards"
  | "student.progress_export"
  | "teacher.create_classes"
  | "teacher.create_assignments"
  | "teacher.basic_analytics"
  | "teacher.multiple_classes"
  | "teacher.unlimited_assignments"
  | "teacher.advanced_analytics"
  | "teacher.csv_export"
  | "teacher.printable_reports"
  | "teacher.assignment_scheduling"
  | "teacher.intervention_insights"
  | "teacher.class_tests"
  | "teacher.bulk_management";

export type FeatureKey =
  | EntitlementKey
  | "teacher.max_active_classes"
  | "teacher.max_active_students"
  | "teacher.max_active_assignments"
  | "student.max_custom_sets_per_period"
  | "student.max_ai_requests_per_period"
  | "student.max_generated_papers_per_period";

export type FeatureLimit = number | null;

export type PlanDefinition = {
  id: PlanId;
  displayName: string;
  accountType: AccountType;
  billingInterval: BillingInterval;
  displayPricePence: number;
  entitlements: readonly EntitlementKey[];
  limits: Readonly<Partial<Record<FeatureKey, FeatureLimit>>>;
  publiclyAvailable: boolean;
  recommended?: boolean;
  sortOrder: number;
};

export type InternalSubscription = {
  id: string;
  userId: string;
  planId: PlanId;
  accountType: AccountType;
  status: SubscriptionStatus;
  billingInterval: BillingInterval;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  trialStart?: string;
  trialEnd?: string;
  endedAt?: string;
};

export type ComplimentaryGrant = {
  id: string;
  userId: string;
  planId?: PlanId;
  entitlement?: EntitlementKey;
  startsAt: string;
  expiresAt?: string;
  revokedAt?: string;
};

export type ResolvedAccess = {
  accountType: AccountType;
  planIds: readonly PlanId[];
  entitlements: ReadonlySet<EntitlementKey>;
  limits: Readonly<Partial<Record<FeatureKey, FeatureLimit>>>;
  administratorOverride: boolean;
};
