import "server-only";
import { getCurrentAccount } from "@/lib/auth/account";
import { hasSupabaseConfig } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { getFreePlan, plans } from "./config";
import { getResolvedFeatureLimit, hasResolvedEntitlement, remainingUsage, resolveAccess } from "./access";
import type { AccountType, ComplimentaryGrant, EntitlementKey, FeatureKey, InternalSubscription, PlanId, ResolvedAccess, SubscriptionStatus } from "./types";

const subscriptionStatuses = new Set<SubscriptionStatus>(["trialing", "active", "incomplete", "incomplete_expired", "past_due", "unpaid", "paused", "canceled", "ended"]);

function isPlanId(value: string): value is PlanId { return value in plans; }

function mapSubscription(row: {
  id: string; user_id: string; plan_id: string; account_type: "student" | "teacher"; status: string; billing_interval: "free" | "month" | "year";
  current_period_start: string | null; current_period_end: string | null; cancel_at_period_end: boolean; canceled_at: string | null; trial_start: string | null; trial_end: string | null; ended_at: string | null;
}): InternalSubscription | null {
  if (!isPlanId(row.plan_id) || !subscriptionStatuses.has(row.status as SubscriptionStatus)) return null;
  return { id: row.id, userId: row.user_id, planId: row.plan_id, accountType: row.account_type, status: row.status as SubscriptionStatus, billingInterval: row.billing_interval, currentPeriodStart: row.current_period_start ?? undefined, currentPeriodEnd: row.current_period_end ?? undefined, cancelAtPeriodEnd: row.cancel_at_period_end, canceledAt: row.canceled_at ?? undefined, trialStart: row.trial_start ?? undefined, trialEnd: row.trial_end ?? undefined, endedAt: row.ended_at ?? undefined };
}

async function getAccountTypeAndAdmin(userId: string): Promise<{ accountType: AccountType; administrator: boolean }> {
  if (!hasSupabaseConfig()) return { accountType: userId.includes("teacher") || userId.includes("admin") ? "teacher" : "student", administrator: userId.includes("admin") };
  const { data } = await createAdminClient().from("user_roles").select("role").eq("user_id", userId);
  const roles = new Set((data ?? []).map((item) => item.role));
  return { accountType: roles.has("teacher") || roles.has("admin") ? "teacher" : "student", administrator: roles.has("admin") };
}

export async function getCurrentSubscription(userId: string) {
  if (!hasSupabaseConfig()) return null;
  const { data } = await createAdminClient().from("subscriptions").select("*").eq("user_id", userId).order("current_period_end", { ascending: false, nullsFirst: false });
  return (data ?? []).map(mapSubscription).find((item): item is InternalSubscription => Boolean(item)) ?? null;
}

export async function getUserEntitlements(userId: string): Promise<ResolvedAccess> {
  const identity = await getAccountTypeAndAdmin(userId);
  if (!hasSupabaseConfig()) return resolveAccess({ accountType: identity.accountType, administrator: identity.administrator });
  const admin = createAdminClient();
  const [{ data: subscriptionRows }, { data: grantRows }] = await Promise.all([
    admin.from("subscriptions").select("*").eq("user_id", userId),
    admin.from("complimentary_access").select("id,user_id,plan_id,entitlement_key,starts_at,expires_at,revoked_at").eq("user_id", userId),
  ]);
  const subscriptions = (subscriptionRows ?? []).map(mapSubscription).filter((item): item is InternalSubscription => Boolean(item));
  const grants: ComplimentaryGrant[] = (grantRows ?? []).flatMap((row) => {
    const planId = row.plan_id && isPlanId(row.plan_id) ? row.plan_id : undefined;
    const entitlement = row.entitlement_key as EntitlementKey | null;
    if (!planId && !entitlement) return [];
    return [{ id: row.id, userId: row.user_id, planId, entitlement: entitlement ?? undefined, startsAt: row.starts_at, expiresAt: row.expires_at ?? undefined, revokedAt: row.revoked_at ?? undefined }];
  });
  return resolveAccess({ ...identity, subscriptions, grants });
}

export async function getCurrentUserEntitlements() {
  const account = await getCurrentAccount();
  if (!account) return null;
  return getUserEntitlements(account.userId);
}

export async function hasEntitlement(userId: string, entitlement: EntitlementKey) { return hasResolvedEntitlement(await getUserEntitlements(userId), entitlement); }
export async function canUseFeature(userId: string, feature: FeatureKey) {
  const access = await getUserEntitlements(userId);
  return feature.includes(".max_") ? getResolvedFeatureLimit(access, feature) !== 0 : access.entitlements.has(feature as EntitlementKey);
}
export async function getFeatureLimit(userId: string, feature: FeatureKey) { return getResolvedFeatureLimit(await getUserEntitlements(userId), feature); }

export function getMonthlyUsagePeriod(now = new Date()) {
  return { start: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)), end: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)) };
}

export async function getRemainingUsage(userId: string, feature: FeatureKey, now = new Date()) {
  const limit = await getFeatureLimit(userId, feature);
  if (limit === null) return null;
  if (!hasSupabaseConfig()) return remainingUsage(limit, 0);
  const period = getMonthlyUsagePeriod(now);
  const { data } = await createAdminClient().from("usage_records").select("quantity").eq("user_id", userId).eq("feature_key", feature).eq("period_start", period.start.toISOString()).maybeSingle();
  return remainingUsage(limit, data?.quantity ?? 0);
}

export async function recordUsage(userId: string, feature: FeatureKey, quantity = 1, now = new Date()) {
  if (!Number.isInteger(quantity) || quantity <= 0) throw new Error("Usage quantity must be a positive integer.");
  const [limit, remaining] = await Promise.all([getFeatureLimit(userId, feature), getRemainingUsage(userId, feature, now)]);
  if (remaining !== null && remaining < quantity) throw new FeatureAccessError("usage_limit_reached", "You have reached this feature’s current fair-use limit.");
  if (!hasSupabaseConfig()) return quantity;
  const period = getMonthlyUsagePeriod(now);
  const { data, error } = await createAdminClient().rpc("consume_limited_feature_usage", { requested_user: userId, requested_feature: feature, requested_period_start: period.start.toISOString(), requested_period_end: period.end.toISOString(), requested_quantity: quantity, requested_limit: limit ?? 0 });
  if (error?.message.includes("feature_usage_limit_reached")) throw new FeatureAccessError("usage_limit_reached", "You have reached this feature’s current fair-use limit.");
  if (error) throw new Error("Feature usage could not be recorded.");
  return Number(data);
}

export class FeatureAccessError extends Error {
  constructor(public readonly code: "entitlement_required" | "usage_limit_reached" | "resource_limit_reached", message: string) { super(message); this.name = "FeatureAccessError"; }
}

export async function requireEntitlement(userId: string, entitlement: EntitlementKey) {
  if (!await hasEntitlement(userId, entitlement)) throw new FeatureAccessError("entitlement_required", "Your current plan does not include this feature.");
}

export async function requireResourceCapacity(userId: string, feature: FeatureKey, current: number, requested = 1) {
  const limit = await getFeatureLimit(userId, feature);
  if (limit !== null && current + requested > (limit ?? 0)) throw new FeatureAccessError("resource_limit_reached", `Your current plan allows up to ${limit ?? 0} active items for this feature.`);
  return limit;
}

export async function getDefaultPlanForUser(userId: string) { const { accountType } = await getAccountTypeAndAdmin(userId); return getFreePlan(accountType); }
