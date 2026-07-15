import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { rateLimit } from "@/lib/security/rate-limit";
const schema=z.object({rows:z.array(z.unknown()).min(1).max(250),confirmed:z.literal(true)});
export async function POST(request:Request){const limited=rateLimit(request,"admin-import-commit",{limit:10,windowMs:60_000});if(limited)return limited;const actor=await requireAdmin(); if(!actor)return NextResponse.json({error:"Administrator access is required."},{status:403}); const parsed=schema.safeParse(await request.json()); if(!parsed.success)return NextResponse.json({error:"Preview and confirm a valid import first."},{status:400}); if(actor.demo)return NextResponse.json({inserted:parsed.data.rows.length,duplicates:0}); const {data,error}=await actor.supabase.rpc("admin_import_questions",{payload:parsed.data.rows}); if(error)return NextResponse.json({error:"The transaction was rolled back; no questions were imported."},{status:400}); return NextResponse.json({inserted:Number(data),duplicates:parsed.data.rows.length-Number(data)});}
