import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/lib/auth/account";
import { rateLimit } from "@/lib/security/rate-limit";
import { createCheckoutSession } from "@/lib/stripe/service";
import { checkoutRequestSchema } from "@/lib/stripe/validation";

export async function POST(request:Request){
  const limited=rateLimit(request,"billing-checkout",{limit:10,windowMs:10*60_000});if(limited)return limited;
  const account=await getCurrentAccount();if(!account||account.userId.startsWith("demo-"))return NextResponse.json({error:"Sign in to a real account before upgrading."},{status:401});
  if(account.role==="admin")return NextResponse.json({error:"Administrator accounts do not need a personal paid plan."},{status:403});
  const parsed=checkoutRequestSchema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:"Choose an available plan."},{status:400});
  try{const session=await createCheckoutSession({userId:account.userId,accountType:account.role,planId:parsed.data.planId});return NextResponse.json({url:session.url},{headers:{"cache-control":"private, no-store"}});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Checkout could not be started."},{status:409});}
}
