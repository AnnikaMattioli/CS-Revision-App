import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/lib/auth/account";
import { rateLimit } from "@/lib/security/rate-limit";
import { createPortalSession } from "@/lib/stripe/service";
export async function POST(request:Request){const limited=rateLimit(request,"billing-portal",{limit:20,windowMs:10*60_000});if(limited)return limited;const account=await getCurrentAccount();if(!account||account.userId.startsWith("demo-")||account.role==="admin")return NextResponse.json({error:"A student or teacher billing account is required."},{status:401});try{const session=await createPortalSession(account.userId,account.role);return NextResponse.json({url:session.url},{headers:{"cache-control":"private, no-store"}});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Subscription management is unavailable."},{status:409});}}
