import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { parseImportText, validateQuestionImport } from "@/lib/admin/import-validation";
import { rateLimit } from "@/lib/security/rate-limit";
const schema=z.object({format:z.enum(["csv","json"]),text:z.string().min(2).max(1_000_000)});
export async function POST(request:Request){const limited=rateLimit(request,"admin-import-preview",{limit:20,windowMs:60_000});if(limited)return limited;const actor=await requireAdmin(); if(!actor)return NextResponse.json({error:"Administrator access is required."},{status:403}); const parsed=schema.safeParse(await request.json()); if(!parsed.success)return NextResponse.json({error:"Choose a CSV or JSON file smaller than 1 MB."},{status:400}); try{return NextResponse.json(validateQuestionImport(parseImportText(parsed.data.text,parsed.data.format)),{headers:{"cache-control":"private, no-store"}});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"The file could not be parsed."},{status:400});}}
