import { describe, expect, it } from "vitest";
import { parseImportText, questionCsvTemplate, validateQuestionImport } from "./import-validation";

describe("admin question imports",()=>{
  it("parses the CSV template and validates its row",()=>{ const result=validateQuestionImport(parseImportText(questionCsvTemplate,"csv")); expect(result.valid).toHaveLength(1); expect(result.invalid).toHaveLength(0); expect(result.valid[0].value.answerRule).toEqual({kind:"exact",acceptable:["alu"]}); });
  it("reports every invalid row without accepting it",()=>{ const result=validateQuestionImport([{importKey:"x",prompt:"short"}]); expect(result.valid).toHaveLength(0); expect(result.invalid[0].errors.length).toBeGreaterThan(2); });
  it("rejects duplicate keys in one batch",()=>{ const row={importKey:"same-key",subtopicId:"20000000-0000-0000-0000-000000000001",type:"boolean",difficulty:"foundation",prompt:"This prompt is long enough",marks:1,estimatedSeconds:30,calculatorAllowed:false,ruleType:"boolean",answerRule:{kind:"boolean",correct:true},explanation:"",hints:[],commonMistakes:[]}; const result=validateQuestionImport([row,row]); expect(result.valid).toHaveLength(1); expect(result.invalid[0].errors).toContain("importKey: duplicate within this file"); });
  it("limits oversized batches",()=>expect(()=>validateQuestionImport(Array.from({length:251},()=>({})))).toThrow(/250/));
});
