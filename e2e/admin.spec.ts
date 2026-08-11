import { expect, test } from "@playwright/test";

test("admin dashboard opens every protected tool",async({page})=>{
  await page.goto("/admin"); await expect(page.getByRole("heading",{level:1,name:"Keep the learning library trustworthy"})).toBeVisible(); await expect(page.getByText("Published questions")).toBeVisible();
  for(const name of ["Content","Questions","Imports","Reports","Roles","Audit log"]) await expect(page.getByRole("link",{name,exact:true})).toBeVisible();
});

test("admin creates and publishes managed content",async({page})=>{
  await page.goto("/admin/content"); await expect(page.getByRole("heading",{level:1,name:"Build and publish the course library"})).toBeVisible(); await page.waitForLoadState("networkidle");
  await page.getByLabel("Content title").fill("AQA GCSE Revision"); await page.getByLabel("Content detail").fill("A new draft course shell."); await page.getByRole("button",{name:"Add draft"}).click();
  const createdContent=page.getByRole("article").filter({hasText:"AQA GCSE Revision"}).last();
  await expect(createdContent.getByText("AQA GCSE Revision",{exact:true})).toBeVisible(); await createdContent.getByRole("button",{name:"Publish AQA GCSE Revision"}).click(); await expect(createdContent.getByText("published",{exact:true})).toBeVisible();
});

test("question bank filters and editor saves protected marking data",async({page})=>{
  await page.goto("/admin/questions"); await page.getByLabel("Search questions").fill("virtual memory"); await expect(page.getByRole("heading", { name: "What is virtual memory?", exact: true })).toBeVisible();
  await page.goto("/admin/questions/new"); await page.waitForLoadState("networkidle"); await page.getByLabel("Question text").fill("Which register stores the address of the next instruction?"); await page.getByLabel("Protected answer rule").fill('{"kind":"exact","acceptable":["program counter","pc"]}'); await page.getByLabel("Save as").selectOption("published"); await page.getByRole("button",{name:"Save question"}).click(); await expect(page).toHaveURL("/admin/questions",{timeout:15_000});
});

test("validated JSON import previews and confirms transaction",async({page})=>{
  await page.goto("/admin/imports"); const rows=[{importKey:"e2e-import-1",subtopicId:"20000000-0000-0000-0000-000000000001",type:"boolean",difficulty:"foundation",prompt:"The program counter stores the address of the next instruction.",marks:1,estimatedSeconds:30,calculatorAllowed:false,ruleType:"boolean",answerRule:{kind:"boolean",correct:true},feedback:"Correct.",explanation:"The PC tracks the next instruction.",hints:[],commonMistakes:[]}];
  await page.getByLabel("Question import file").setInputFiles({name:"questions.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(rows))}); await expect(page.getByText("1 valid")).toBeVisible(); await expect(page.getByText("0 invalid")).toBeVisible(); await page.getByRole("button",{name:"Confirm transactional import"}).click(); await expect(page.getByText("1 questions imported; 0 duplicates skipped.")).toBeVisible();
});

test("reports, roles and audit controls remain server mediated",async({page})=>{
  await page.goto("/admin/reports"); const card=page.locator("article").filter({hasText:"A correct explanation using the phrase storage drive"}); const status=card.getByLabel("Status for report report-1"); await status.selectOption("resolved"); await card.getByLabel("Internal notes for report report-1").fill("Answer variant added and marking retested."); await card.getByRole("button",{name:"Save review"}).click(); await expect(status).toHaveValue("resolved");
  await page.goto("/admin/roles"); await page.getByLabel("Role for Alex Admin").selectOption("student"); await expect(page.getByText("You cannot remove your own administrator access.")).toBeVisible(); await page.getByLabel("Role for Taylor Teacher").selectOption("admin"); await expect(page.getByText("Taylor Teacher is now an administrator.")).toBeVisible();
  await page.goto("/admin/audit"); await expect(page.getByRole("heading",{level:1,name:"Important changes, preserved"})).toBeVisible(); await expect(page.getByText("question published")).toBeVisible();
});
