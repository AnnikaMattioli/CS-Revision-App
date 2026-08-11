import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";
import { getStripeConfig } from "@/lib/stripe/config";
import { syncStripeSubscription } from "@/lib/stripe/service";

export const runtime="nodejs";
function subscriptionId(object:unknown){const value=object as {subscription?:string|{id:string}|null;parent?:{subscription_details?:{subscription?:string|{id:string}|null}}};const candidate=value.subscription??value.parent?.subscription_details?.subscription;return typeof candidate==="string"?candidate:candidate?.id??null;}
async function handle(event:Stripe.Event){const object=event.data.object;
  if(event.type.startsWith("customer.subscription."))return syncStripeSubscription((object as Stripe.Subscription).id);
  if(event.type==="checkout.session.completed"){const id=subscriptionId(object);if(id)return syncStripeSubscription(id);return;}
  if(["invoice.paid","invoice.payment_failed","invoice.payment_action_required","customer.subscription.trial_will_end"].includes(event.type)){const id=subscriptionId(object);if(id)return syncStripeSubscription(id);return;}
  if(event.type==="customer.updated"){const customer=object as Stripe.Customer;await createAdminClient().from("billing_customers").update({email_snapshot:customer.email}).eq("stripe_customer_id",customer.id);return;}
}
export async function POST(request:Request){const signature=request.headers.get("stripe-signature");if(!signature)return NextResponse.json({error:"Missing Stripe signature."},{status:400});let event:Stripe.Event;try{event=getStripe().webhooks.constructEvent(await request.text(),signature,getStripeConfig({requireWebhook:true}).STRIPE_WEBHOOK_SECRET!);}catch{return NextResponse.json({error:"Invalid Stripe signature."},{status:400});}
  const admin=createAdminClient();const {error:claimError}=await admin.from("stripe_events").insert({stripe_event_id:event.id,event_type:event.type});if(claimError?.code==="23505"){const {data:prior}=await admin.from("stripe_events").select("processing_status,attempts").eq("stripe_event_id",event.id).maybeSingle();if(prior?.processing_status!=="failed")return NextResponse.json({received:true,duplicate:true});const {data:reclaimed}=await admin.from("stripe_events").update({processing_status:"processing",attempts:prior.attempts+1,error_summary:null}).eq("stripe_event_id",event.id).eq("processing_status","failed").select("stripe_event_id").maybeSingle();if(!reclaimed)return NextResponse.json({received:true,duplicate:true});}else if(claimError)return NextResponse.json({error:"Event could not be claimed."},{status:500});
  try{await handle(event);await admin.from("stripe_events").update({processing_status:"processed",processed_at:new Date().toISOString()}).eq("stripe_event_id",event.id);return NextResponse.json({received:true});}catch(error){await admin.from("stripe_events").update({processing_status:"failed",error_summary:(error instanceof Error?error.message:"Internal synchronisation failed").slice(0,500)}).eq("stripe_event_id",event.id);return NextResponse.json({error:"Webhook synchronisation failed."},{status:500});}
}
