import { z } from "zod";
import type { ImportValidation, QuestionImportRow } from "@/types/admin";

const databaseId = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
const rowSchema = z.object({
  importKey: z.string().trim().min(3).max(100), subtopicId: databaseId,
  type: z.enum(["multiple_choice","multiple_select","boolean","fill_blank","short_answer","extended_answer","ordering","matching"]),
  difficulty: z.enum(["foundation","standard","stretch"]), prompt: z.string().trim().min(10).max(4000), marks: z.coerce.number().int().min(1).max(30), estimatedSeconds: z.coerce.number().int().min(10).max(7200).default(60), calculatorAllowed: z.union([z.boolean(),z.string()]).transform((v)=>v===true||v==="true"), ruleType: z.string().min(2).max(40), answerRule: z.unknown(), feedback: z.string().max(2000).optional(), explanation: z.string().max(4000).default(""), hints: z.array(z.string().max(500)).max(10).default([]), commonMistakes: z.array(z.string().max(500)).max(10).default([]), stimulus: z.string().max(4000).optional(), imageRef: z.string().max(500).optional(), codeBlock: z.string().max(8000).optional(),
});

function parseCsv(text: string) {
  const rows: string[][] = []; let row: string[] = []; let value = ""; let quoted = false;
  for (let i=0;i<text.length;i++) { const char=text[i]; if (char==='"') { if (quoted && text[i+1]==='"') { value+='"'; i++; } else quoted=!quoted; } else if (char===',' && !quoted) { row.push(value); value=""; } else if ((char==='\n'||char==='\r')&&!quoted) { if(char==='\r'&&text[i+1]==='\n') i++; row.push(value); if(row.some(Boolean)) rows.push(row); row=[]; value=""; } else value+=char; }
  row.push(value); if(row.some(Boolean)) rows.push(row); if(quoted) throw new Error("CSV contains an unclosed quote."); return rows;
}

function jsonCell(value: string, fallback: unknown) { if (!value.trim()) return fallback; try { return JSON.parse(value); } catch { return value; } }
export function parseImportText(text: string, format: "csv"|"json"): unknown[] {
  if (text.length>1_000_000) throw new Error("Import files must be smaller than 1 MB.");
  if (format==="json") { const value=JSON.parse(text); if(!Array.isArray(value)) throw new Error("JSON imports must contain an array."); return value; }
  const rows=parseCsv(text); if(rows.length<2) return []; const headers=rows[0].map((h)=>h.trim());
  return rows.slice(1).map((cells)=>Object.fromEntries(headers.map((header,index)=>{ const raw=cells[index]??""; return [header,["answerRule","hints","commonMistakes"].includes(header)?jsonCell(raw,header==="answerRule"?{}:[]):raw]; })));
}
export function validateQuestionImport(source: unknown[]): ImportValidation {
  if(source.length>250) throw new Error("Import batches are limited to 250 questions."); const valid: ImportValidation["valid"]=[]; const invalid: ImportValidation["invalid"]=[]; const keys=new Set<string>();
  source.forEach((item,index)=>{ const parsed=rowSchema.safeParse(item); if(!parsed.success){invalid.push({row:index+2,errors:parsed.error.issues.map((issue)=>`${issue.path.join(".")||"row"}: ${issue.message}`),source:item});return;} if(keys.has(parsed.data.importKey)){invalid.push({row:index+2,errors:["importKey: duplicate within this file"],source:item});return;} keys.add(parsed.data.importKey); valid.push({row:index+2,value:parsed.data as QuestionImportRow}); }); return {valid,invalid};
}

export const questionCsvTemplate = "importKey,subtopicId,type,difficulty,prompt,marks,estimatedSeconds,calculatorAllowed,ruleType,answerRule,feedback,explanation,hints,commonMistakes\noriginal-cpu-001,20000000-0000-0000-0000-000000000001,multiple_choice,foundation,Which component performs arithmetic operations?,1,45,false,exact,\"{\"\"kind\"\":\"\"exact\"\",\"\"acceptable\"\":[\"\"alu\"\"]}\",Correct.,The ALU calculates.,\"[\"\"Think calculations\"\"]\",\"[\"\"Do not choose the control unit\"\"]\"";
export const questionJsonTemplate = JSON.stringify([{importKey:"original-cpu-001",subtopicId:"20000000-0000-0000-0000-000000000001",type:"multiple_choice",difficulty:"foundation",prompt:"Which component performs arithmetic operations?",marks:1,estimatedSeconds:45,calculatorAllowed:false,ruleType:"exact",answerRule:{kind:"exact",acceptable:["alu"]},feedback:"Correct.",explanation:"The ALU performs calculations.",hints:["Think calculations"],commonMistakes:["Do not choose the control unit"]}],null,2);
