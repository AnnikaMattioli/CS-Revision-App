import type {Metadata} from "next";
import {PricingTable} from "@/components/billing/pricing-table";
import {MarketingFooter} from "@/components/marketing/footer";
import {MarketingHeader} from "@/components/marketing/header";
import {getCurrentAccount} from "@/lib/auth/account";
import {getFreePlan} from "@/lib/billing/config";
import {getCurrentSubscription} from "@/lib/billing/server";
import {hasSupabaseConfig} from "@/lib/env";
export const metadata:Metadata={title:"Pricing",description:"Compare Bytewise plans for Computer Science students and teachers."};
export default async function PricingPage(){const account=await getCurrentAccount();const accountType=account?.role==="teacher"||account?.role==="admin"?"teacher":"student";const subscription=account&&!account.userId.startsWith("demo-")?await getCurrentSubscription(account.userId):null;return <><MarketingHeader/><main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8"><div className="mx-auto max-w-3xl text-center"><p className="font-black text-[var(--violet)]">CLEAR, HONEST PRICING</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">Useful for free. <span className="gradient-text">More powerful when you need it.</span></h1><p className="mt-5 text-lg leading-8 text-muted">Core specification content stays free. Upgrade for deeper personalisation, analytics and time-saving tools.</p></div><PricingTable initial={accountType} currentPlan={subscription?.planId??(account?getFreePlan(accountType).id:undefined)} demo={!hasSupabaseConfig()}/></main><MarketingFooter/></>}
