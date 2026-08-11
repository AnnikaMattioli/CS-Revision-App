import { allEntitlements, getFreePlan, getPlan, plans, subscriptionAccessPolicy } from "./config";
import type { AccountType, ComplimentaryGrant, EntitlementKey, FeatureKey, FeatureLimit, InternalSubscription, ResolvedAccess } from "./types";

const accessStatuses = new Set<string>(subscriptionAccessPolicy.accessStatuses);
const recoverableStatuses = new Set<string>(subscriptionAccessPolicy.recoverableStatuses);

export function isSubscriptionActive(subscription: InternalSubscription, now = new Date()) {
  const periodEnd = subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : undefined;
  if (accessStatuses.has(subscription.status)) return !periodEnd || periodEnd > now;
  if (!recoverableStatuses.has(subscription.status) || !periodEnd) return false;
  return new Date(periodEnd.getTime() + subscriptionAccessPolicy.gracePeriodDays * 86_400_000) > now;
}

export function isGrantActive(grant: ComplimentaryGrant, now = new Date()) {
  return !grant.revokedAt && new Date(grant.startsAt) <= now && (!grant.expiresAt || new Date(grant.expiresAt) > now);
}

function mergeLimit(current: FeatureLimit | undefined, incoming: FeatureLimit) {
  if (current === null || incoming === null) return null;
  return Math.max(current ?? 0, incoming);
}

export function resolveAccess(input: {
  accountType: AccountType;
  subscriptions?: readonly InternalSubscription[];
  grants?: readonly ComplimentaryGrant[];
  administrator?: boolean;
  now?: Date;
}): ResolvedAccess {
  const now = input.now ?? new Date();
  const base = getFreePlan(input.accountType);
  const applicablePlans = [base, ...(input.subscriptions ?? [])
    .filter((subscription) => subscription.accountType === input.accountType && isSubscriptionActive(subscription, now))
    .map((subscription) => getPlan(subscription.planId))
    .filter((plan) => plan.accountType === input.accountType)];
  const activeGrants = (input.grants ?? []).filter((grant) => isGrantActive(grant, now));
  for (const grant of activeGrants) {
    if (!grant.planId) continue;
    const plan = getPlan(grant.planId);
    if (plan.accountType === input.accountType) applicablePlans.push(plan);
  }

  const entitlements = new Set<EntitlementKey>();
  const limits: Partial<Record<FeatureKey, FeatureLimit>> = {};
  for (const plan of applicablePlans) {
    plan.entitlements.forEach((key) => entitlements.add(key));
    for (const [key, value] of Object.entries(plan.limits) as Array<[FeatureKey, FeatureLimit]>) limits[key] = mergeLimit(limits[key], value);
  }
  for (const grant of activeGrants) {
    if (grant.entitlement && grant.entitlement.startsWith(`${input.accountType}.`)) entitlements.add(grant.entitlement);
  }
  if (input.administrator) {
    allEntitlements.forEach((key) => entitlements.add(key));
    for (const plan of Object.values(plans)) {
      for (const key of Object.keys(plan.limits) as FeatureKey[]) limits[key] = null;
    }
  }

  return { accountType: input.accountType, planIds: [...new Set(applicablePlans.map((plan) => plan.id))], entitlements, limits, administratorOverride: Boolean(input.administrator) };
}

export function hasResolvedEntitlement(access: ResolvedAccess, entitlement: EntitlementKey) { return access.entitlements.has(entitlement); }
export function getResolvedFeatureLimit(access: ResolvedAccess, feature: FeatureKey) { return access.limits[feature]; }
export function remainingUsage(limit: FeatureLimit | undefined, used: number) { return limit === null ? null : Math.max(0, (limit ?? 0) - Math.max(0, used)); }
