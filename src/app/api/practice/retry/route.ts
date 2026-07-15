import { NextResponse } from "next/server";
import { z } from "zod";
import { hasSupabaseConfig } from "@/lib/env";
import { questionBank } from "@/lib/practice/question-bank";
import { rateLimit } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";

const databaseId=z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
const schema=z.object({sourceAttemptId:z.string().min(1).max(100),questionIds:z.array(databaseId).min(1).max(10)});

export async function POST(request:Request){
  const limited=rateLimit(request,"practice-retry",{limit:30,windowMs:60_000});if(limited)return limited;
  const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"No incorrect questions were available to retry."},{status:400});
  if(!hasSupabaseConfig()){const allowed=new Set(questionBank.map((item)=>item.id));const questionIds=parsed.data.questionIds.filter((id)=>allowed.has(id));if(!questionIds.length)return NextResponse.json({error:"No incorrect questions were available to retry."},{status:400});return NextResponse.json({attemptId:`retry-${Date.now()}`,questionIds});}
  const supabase=await createClient();const{data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:"Sign in required."},{status:401});
  const{data:source}=await supabase.from("attempts").select("practice_set_id").eq("id",parsed.data.sourceAttemptId).eq("user_id",user.id).eq("status","marked").maybeSingle();if(!source)return NextResponse.json({error:"That completed attempt was not found."},{status:404});
  const{data:answers}=await supabase.from("attempt_answers").select("id,question_id").eq("attempt_id",parsed.data.sourceAttemptId);const answerIds=(answers??[]).map((item)=>item.id);const{data:marks}=answerIds.length?await supabase.from("marking_results").select("attempt_answer_id,feedback").in("attempt_answer_id",answerIds):{data:[]};
  const incorrectAnswerIds=new Set((marks??[]).filter((item)=>{const feedback=item.feedback as {status?:string};return feedback.status!=="correct"}).map((item)=>item.attempt_answer_id));const questionIds=(answers??[]).filter((item)=>incorrectAnswerIds.has(item.id)).map((item)=>item.question_id);if(!questionIds.length)return NextResponse.json({error:"You answered every question correctly."},{status:409});
  const{data:sourceSet}=await supabase.from("practice_sets").select("course_id").eq("id",source.practice_set_id).single();if(!sourceSet)return NextResponse.json({error:"The original set is unavailable."},{status:404});
  const{data:set,error:setError}=await supabase.from("practice_sets").insert({owner_id:user.id,course_id:sourceSet.course_id,title:"Retry incorrect questions",mode:"practice"}).select("id").single();if(setError||!set)return NextResponse.json({error:"The retry set could not be created."},{status:500});
  const{error:linkError}=await supabase.from("practice_set_questions").insert(questionIds.map((questionId,index)=>({practice_set_id:set.id,question_id:questionId,sort_order:index+1})));if(linkError)return NextResponse.json({error:"The retry questions could not be saved."},{status:500});
  const{data:attempt,error:attemptError}=await supabase.from("attempts").insert({user_id:user.id,practice_set_id:set.id}).select("id").single();if(attemptError||!attempt)return NextResponse.json({error:"The retry attempt could not be started."},{status:500});return NextResponse.json({attemptId:attempt.id,questionIds});
}
