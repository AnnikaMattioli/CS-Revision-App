import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { writeAdminAudit } from "@/lib/admin/audit";
import { createAdminClient } from "@/lib/supabase/admin";
const schema=z.object({status:z.enum(["open","reviewing","resolved","dismissed"]),internalNotes:z.string().max(4000)});
export async function PATCH(request:Request,{params}:{params:Promise<{reportId:string}>}){const actor=await requireAdmin(); if(!actor)return NextResponse.json({error:"Administrator access is required."},{status:403}); const parsed=schema.safeParse(await request.json().catch(()=>null)); if(!parsed.success)return NextResponse.json({error:"Check the report status and notes."},{status:400}); const {reportId}=await params; if(!actor.demo){const {data,error}=await createAdminClient().from("question_reports").update({status:parsed.data.status,internal_notes:parsed.data.internalNotes,resolved_by:["resolved","dismissed"].includes(parsed.data.status)?actor.userId:null}).eq("id",reportId).select("id").maybeSingle(); if(error||!data)return NextResponse.json({error:"Report not found."},{status:404}); await writeAdminAudit(actor.userId,"report.reviewed","question_report",reportId,{status:parsed.data.status});} return NextResponse.json({status:parsed.data.status});}
