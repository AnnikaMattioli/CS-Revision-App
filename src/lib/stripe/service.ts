import "server-only";
import type Stripe from "stripe";
import { getPlan, isPlanForAccountType } from "@/lib/billing/config";
import type { AccountType, PlanId, SubscriptionStatus } from "@/lib/billing/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "./client";
import { getStripeConfig, getStripePriceId, planIdForStripePrice } from "./config";

export async function findOrCreateStripeCustomer(userId:string,accountType:AccountType){
  const admin=createAdminClient();
  const {data:existing}=await admin.from("billing_customers").select("stripe_customer_id").eq("user_id",userId).maybeSingle();
  if(existing) return existing.stripe_customer_id;
  const {data:{user}}=await admin.auth.admin.getUserById(userId);
  if(!user) throw new Error("Authenticated account not found.");
  const customer=await getStripe().customers.create({email:user.email,metadata:{bytewise_user_id:userId,bytewise_account_type:accountType}},{idempotencyKey:`bytewise-customer-${userId}`});
  const {error}=await admin.from("billing_customers").insert({user_id:userId,stripe_customer_id:customer.id,email_snapshot:user.email??null});
  if(error) throw new Error("The billing customer could not be stored.");
  return customer.id;
}

export async function validateStripePrice(planId:PlanId){
  const definition=getPlan(planId); const price=await getStripe().prices.retrieve(getStripePriceId(planId),{expand:["product"]});
  if(!price.active||price.livemode||price.currency!=="gbp"||price.unit_amount!==definition.displayPricePence||price.type!=="recurring"||price.recurring?.interval!==definition.billingInterval) throw new Error("The configured Stripe price does not match the approved plan.");
  return price;
}

export async function createCheckoutSession(input:{userId:string;accountType:AccountType;planId:PlanId}){
  if(!isPlanForAccountType(input.planId,input.accountType)||getPlan(input.planId).billingInterval==="free") throw new Error("This plan is not available for this account type.");
  const admin=createAdminClient();
  const {data:owned}=await admin.from("subscriptions").select("id,plan_id").eq("user_id",input.userId).eq("account_type",input.accountType).in("status",["trialing","active","past_due","unpaid","paused","incomplete"]).limit(1).maybeSingle();
  if(owned) throw new Error(owned.plan_id===input.planId?"You already have this plan.":"Manage your existing subscription before choosing another plan.");
  const [customer,price]=await Promise.all([findOrCreateStripeCustomer(input.userId,input.accountType),validateStripePrice(input.planId)]);
  const site=getStripeConfig().NEXT_PUBLIC_SITE_URL.replace(/\/$/,"");
  return getStripe().checkout.sessions.create({mode:"subscription",customer,line_items:[{price:price.id,quantity:1}],client_reference_id:input.userId,success_url:`${site}/billing/success?session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${site}/billing/cancelled`,allow_promotion_codes:false,metadata:{bytewise_user_id:input.userId,bytewise_plan_id:input.planId,bytewise_account_type:input.accountType},subscription_data:{metadata:{bytewise_user_id:input.userId,bytewise_plan_id:input.planId,bytewise_account_type:input.accountType}}},{idempotencyKey:`checkout-${input.userId}-${input.planId}-${Math.floor(Date.now()/300000)}`});
}

function statusOf(status:Stripe.Subscription.Status):SubscriptionStatus{
  switch(status){case "trialing":return "trialing";case "active":return "active";case "incomplete":return "incomplete";case "incomplete_expired":return "incomplete_expired";case "past_due":return "past_due";case "unpaid":return "unpaid";case "paused":return "paused";case "canceled":return "canceled";default:return "ended";}
}
function idOf(value:string|{id:string}|null):string|null{return typeof value==="string"?value:value?.id??null;}

export async function syncStripeSubscription(subscriptionId:string){
  const stripe=getStripe(); const sub=await stripe.subscriptions.retrieve(subscriptionId,{expand:["items.data.price.product"]});
  const item=sub.items.data[0]; if(!item) throw new Error("Stripe subscription has no item.");
  const planId=planIdForStripePrice(item.price.id); if(!planId) throw new Error("Stripe subscription uses an unapproved price.");
  const definition=getPlan(planId); const userId=sub.metadata.bytewise_user_id;
  if(!userId) throw new Error("Stripe subscription is missing its trusted user reference.");
  const customerId=idOf(sub.customer); if(!customerId) throw new Error("Stripe subscription customer is missing.");
  const admin=createAdminClient();
  const {data:customer}=await admin.from("billing_customers").select("user_id").eq("stripe_customer_id",customerId).maybeSingle();
  if(!customer||customer.user_id!==userId) throw new Error("Stripe customer ownership does not match the subscription.");
  const productId=idOf(item.price.product); const row={user_id:userId,plan_id:planId,account_type:definition.accountType,provider:"stripe",provider_customer_id:customerId,provider_subscription_id:sub.id,provider_price_id:item.price.id,provider_product_id:productId,status:statusOf(sub.status),billing_interval:definition.billingInterval,current_period_start:new Date(item.current_period_start*1000).toISOString(),current_period_end:new Date(item.current_period_end*1000).toISOString(),cancel_at_period_end:sub.cancel_at_period_end,canceled_at:sub.canceled_at?new Date(sub.canceled_at*1000).toISOString():null,trial_start:sub.trial_start?new Date(sub.trial_start*1000).toISOString():null,trial_end:sub.trial_end?new Date(sub.trial_end*1000).toISOString():null,ended_at:sub.ended_at?new Date(sub.ended_at*1000).toISOString():null};
  const {data:existing}=await admin.from("subscriptions").select("id").eq("provider","stripe").eq("provider_subscription_id",sub.id).maybeSingle();
  const result=existing?await admin.from("subscriptions").update(row).eq("id",existing.id):await admin.from("subscriptions").insert(row);
  if(result.error) throw new Error("The Stripe subscription could not be synchronised.");
  await admin.from("subscription_audit_logs").insert({user_id:userId,action:"subscription.synchronised",subscription_id:existing?.id,metadata:{provider:"stripe",status:sub.status,plan_id:planId}});
  return {userId,planId,status:statusOf(sub.status)};
}

export async function createPortalSession(userId:string,accountType:AccountType){
  const {data:customer}=await createAdminClient().from("billing_customers").select("stripe_customer_id").eq("user_id",userId).maybeSingle();
  if(!customer) throw new Error("No billing account is available yet.");
  const env=getStripeConfig(); const configuration=accountType==="student"?env.STRIPE_STUDENT_PORTAL_CONFIGURATION_ID:env.STRIPE_TEACHER_PORTAL_CONFIGURATION_ID;
  return getStripe().billingPortal.sessions.create({customer:customer.stripe_customer_id,return_url:`${env.NEXT_PUBLIC_SITE_URL.replace(/\/$/,"")}/billing`,...(configuration?{configuration}:{})});
}
