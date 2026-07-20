import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { createClient } from "@supabase/supabase-js";

const courseKey = ["aqa", "ocr-a-level", "aqa-a-level"].includes(process.argv[2]) ? process.argv[2] : "ocr";
const syncConfig = courseKey === "aqa-a-level" ? {
  source: "src/data/aqa-a-level.ts", exportName: "aqaALevelBlueprints", courseId: "10000000-0000-0000-0000-000000000004",
  subtopicGroup: 24000000, lessonGroup: 33000000, sectionGroup: 37000000, flashcardGroup: 43000000, solutionGroup: 53000000, questionGroup: 90000000, ruleGroup: 91000000,
} : courseKey === "ocr-a-level" ? {
  source: "src/data/ocr-a-level.ts", exportName: "ocrALevelBlueprints", courseId: "10000000-0000-0000-0000-000000000003",
  subtopicGroup: 23000000, lessonGroup: 32000000, sectionGroup: 36000000, flashcardGroup: 42000000, solutionGroup: 52000000, questionGroup: 80000000, ruleGroup: 81000000,
} : courseKey === "aqa" ? {
  source: "src/data/aqa-gcse.ts", exportName: "aqaGcseBlueprints", courseId: "10000000-0000-0000-0000-000000000002",
  subtopicGroup: 22000000, lessonGroup: 31000000, sectionGroup: 35000000, flashcardGroup: 41000000, solutionGroup: 51000000, questionGroup: 70000000, ruleGroup: 71000000,
} : {
  source: "src/data/ocr-gcse.ts", exportName: "ocrGcseBlueprints", courseId: "10000000-0000-0000-0000-000000000001",
  subtopicGroup: 21000000, lessonGroup: 30000000, sectionGroup: 34000000, flashcardGroup: 40000000, solutionGroup: 50000000, questionGroup: 60000000, ruleGroup: 61000000,
};

function loadEnvironment() {
  for (const file of [".env.local", ".env"]) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
    }
  }
}

async function loadBlueprints() {
  const source = fs.readFileSync(syncConfig.source, "utf8");
  const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const temporary = path.join(process.env.TMPDIR ?? "/tmp", `${courseKey}-gcse-${Date.now()}.mjs`);
  fs.writeFileSync(temporary, javascript);
  try { return (await import(pathToFileURL(temporary).href))[syncConfig.exportName]; }
  finally { fs.unlinkSync(temporary); }
}

function uuid(group, topic, item) {
  return `${String(group).padStart(8, "0")}-0000-4000-8000-${String(topic * 1000 + item).padStart(12, "0")}`;
}
const questionId = (topic, item) => uuid(syncConfig.questionGroup, topic, item);
const ruleId = (topic, item) => uuid(syncConfig.ruleGroup, topic, item);
const difficulties = ["foundation", "developing", "secure", "advanced", "exam_challenge"];
const databaseDifficulty = (value) => value === "foundation" ? "foundation" : ["advanced", "exam_challenge"].includes(value) ? "stretch" : "standard";

function questionsForTopic(topic, topicIndex, subtopics) {
  const facts = topic.units.flatMap((unit) => unit.facts.map((item) => ({ ...item, lessonSlug: unit.slug, subtopicId: subtopics.get(unit.slug) })));
  const rows = [];
  const add = (number, item, question) => rows.push({
    question: { id: question.id, subtopic_id: item.subtopicId, type: question.type, difficulty: databaseDifficulty(question.difficulty), prompt: question.public, marks: question.marks, estimated_seconds: question.public.estimatedSeconds, status: "published", explanation: question.explanation, common_mistakes: [question.commonMistake], source_type: "original" },
    rule: { id: ruleId(topicIndex, number), question_id: question.id, rule_type: question.rule.kind, rule: question.rule, feedback: question.explanation },
  });
  facts.forEach((item, index) => {
    const number = index + 1; const id = questionId(topicIndex, number);
    const options = [{ id: "correct", label: item.answer }, ...[1, 2, 3].map((offset, optionIndex) => ({ id: `distractor-${optionIndex + 1}`, label: facts[(index + offset) % facts.length].answer }))];
    const publicQuestion = { id, topicSlug: topic.slug, topicTitle: topic.title, type: "multiple_choice", difficulty: difficulties[index % 5], prompt: item.question, marks: 1, estimatedSeconds: 50, options, lessonHref: `/learn/${topic.slug}/${item.lessonSlug}` };
    add(number, item, { id, type: "multiple_choice", difficulty: publicQuestion.difficulty, marks: 1, public: publicQuestion, rule: { kind: "exact", acceptable: ["correct"] }, explanation: item.answer, commonMistake: "Check that the option answers the exact command word." });
  });
  facts.forEach((item, index) => {
    const number = 21 + index; const id = questionId(topicIndex, number); const correct = index % 2 === 0;
    const statement = correct ? item.answer : facts[(index + 1) % facts.length].answer;
    const publicQuestion = { id, topicSlug: topic.slug, topicTitle: topic.title, type: "boolean", difficulty: difficulties[(index + 1) % 5], prompt: `True or false — for “${item.question}”, this is an accurate answer: ${statement}`, marks: 1, estimatedSeconds: 40, options: [{ id: "true", label: "True" }, { id: "false", label: "False" }], lessonHref: `/learn/${topic.slug}/${item.lessonSlug}` };
    add(number, item, { id, type: "boolean", difficulty: publicQuestion.difficulty, marks: 1, public: publicQuestion, rule: { kind: "boolean", correct }, explanation: item.answer, commonMistake: "Judge the whole statement rather than one familiar word." });
  });
  facts.slice(0, 10).forEach((item, index) => {
    const number = 41 + index; const id = questionId(topicIndex, number);
    const points = item.keywords.slice(0, 3).map((keyword, pointIndex) => ({ id: `point-${pointIndex + 1}`, description: `Uses the idea “${keyword}” accurately`, patterns: [keyword.toLowerCase()] }));
    const publicQuestion = { id, topicSlug: topic.slug, topicTitle: topic.title, type: "short_answer", difficulty: difficulties[(index + 2) % 5], prompt: `${item.question} Give a developed exam-style answer. [${points.length} marks]`, marks: points.length, estimatedSeconds: 120, lessonHref: `/learn/${topic.slug}/${item.lessonSlug}` };
    add(number, item, { id, type: "short_answer", difficulty: publicQuestion.difficulty, marks: points.length, public: publicQuestion, rule: { kind: "rubric", points }, explanation: `A complete response uses the key ideas ${item.keywords.join(", ")}.`, commonMistake: "Connect technical terms in a clear answer." });
  });
  return rows;
}

async function checked(promise, label) {
  const result = await promise;
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  return result.data;
}

async function main() {
  loadEnvironment();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required.");
  const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
  const blueprints = [...await loadBlueprints()].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true })); const courseId = syncConfig.courseId;
  await checked(supabase.from("specification_sections").upsert(blueprints.map((blueprint, index) => ({ course_id: courseId, code: blueprint.code, title: blueprint.title, description: blueprint.description, sort_order: index + 1, status: "published" })), { onConflict: "course_id,code" }), "Upsert specification sections");
  const sections = await checked(supabase.from("specification_sections").select("id,code").eq("course_id", courseId), "Load sections");
  const sectionByCode = new Map(sections.map((section) => [section.code, section.id]));
  await checked(supabase.from("topics").upsert(blueprints.map((blueprint, index) => ({ specification_section_id: sectionByCode.get(blueprint.code), slug: blueprint.slug, title: blueprint.title, description: blueprint.description, icon: blueprint.icon, estimated_minutes: blueprint.units.length * 15, learning_objectives: blueprint.units.map((unit) => unit.summary), sort_order: index + 1, status: "published" })), { onConflict: "specification_section_id,slug" }), "Upsert topics");
  const topics = await checked(supabase.from("topics").select("id,slug,specification_section_id").in("specification_section_id", sections.map((section) => section.id)), "Load topics");
  const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic])); const allQuestionRows = []; const allRuleRows = [];
  for (const [topicOffset, blueprint] of blueprints.entries()) {
    const topicIndex = topicOffset + 1; const topic = topicBySlug.get(blueprint.slug);
    if (!topic) throw new Error(`Missing topic ${blueprint.slug}. Apply the specification migration first.`);
    await checked(supabase.from("topics").update({ title: blueprint.title, description: blueprint.description, icon: blueprint.icon, estimated_minutes: blueprint.units.length * (courseKey.includes("a-level") ? 15 : 12), learning_objectives: blueprint.units.map((unit) => unit.summary), status: "published" }).eq("id", topic.id), `Update ${blueprint.slug}`);
    await checked(supabase.from("subtopics").update({ status: "archived" }).eq("topic_id", topic.id).eq("slug", "topic-overview"), `Archive ${blueprint.slug} overview`);
    const subtopicRows = blueprint.units.map((unit, unitOffset) => ({ id: uuid(syncConfig.subtopicGroup, topicIndex, unitOffset + 1), topic_id: topic.id, slug: unit.slug, title: unit.title, description: unit.summary, sort_order: unitOffset + 1, status: "published" }));
    await checked(supabase.from("subtopics").upsert(subtopicRows, { onConflict: "topic_id,slug" }), `Upsert ${blueprint.slug} subtopics`);
    const savedSubtopics = await checked(supabase.from("subtopics").select("id,slug").eq("topic_id", topic.id).in("slug", blueprint.units.map((unit) => unit.slug)), `Reload ${blueprint.slug} subtopics`);
    const subtopics = new Map(savedSubtopics.map((item) => [item.slug, item.id]));
    const lessonRows = blueprint.units.map((unit, unitOffset) => ({ id: uuid(syncConfig.lessonGroup, topicIndex, unitOffset + 1), subtopic_id: subtopics.get(unit.slug), slug: unit.slug, title: unit.title, summary: unit.summary, estimated_minutes: courseKey.includes("a-level") ? 15 : 12, sort_order: unitOffset + 1, status: "published" }));
    await checked(supabase.from("lessons").upsert(lessonRows, { onConflict: "subtopic_id,slug" }), `Upsert ${blueprint.slug} lessons`);
    const savedLessons = await checked(supabase.from("lessons").select("id,slug").in("subtopic_id", [...subtopics.values()]), `Reload ${blueprint.slug} lessons`); const lessons = new Map(savedLessons.map((item) => [item.slug, item.id]));
    const sectionRows = blueprint.units.flatMap((unit, unitOffset) => unit.facts.map((item, factOffset) => ({ id: uuid(syncConfig.sectionGroup, topicIndex, (unitOffset + 1) * 10 + factOffset + 1), lesson_id: lessons.get(unit.slug), heading: item.question, body: { paragraphs: [item.answer, `Use precise subject vocabulary in an exam answer. Include ${item.keywords.join(", ")} and connect each point to its effect.`], callout: factOffset === 0 ? { type: "tip", title: "Active recall", text: "Hide the explanation, answer aloud, then check every key idea." } : undefined }, sort_order: factOffset + 1 })));
    await checked(supabase.from("lesson_sections").upsert(sectionRows, { onConflict: "id" }), `Upsert ${blueprint.slug} lesson sections`);
    const facts = blueprint.units.flatMap((unit) => unit.facts.map((item) => ({ ...item, subtopicId: subtopics.get(unit.slug) })));
    await checked(supabase.from("flashcards").upsert(facts.map((item, index) => ({ id: uuid(syncConfig.flashcardGroup, topicIndex, index + 1), subtopic_id: item.subtopicId, front: item.question, back: item.answer, hint: `Include: ${item.keywords.join(", ")}`, sort_order: index + 1, status: "published" })), { onConflict: "id" }), `Upsert ${blueprint.slug} flashcards`);
    await checked(supabase.from("worked_solutions").upsert(facts.slice(0, 5).map((item, index) => ({ id: uuid(syncConfig.solutionGroup, topicIndex, index + 1), subtopic_id: item.subtopicId, title: `Worked exam response ${index + 1}`, prompt: `${item.question} Explain your answer using precise technical terminology. [3 marks]`, steps: [{ title: "Decode the command", explanation: "Identify exactly what must be explained." }, { title: "Select technical facts", explanation: `Use ${item.keywords.join(", ")}.` }, { title: "Link cause and effect", explanation: "State the fact, then explain what it means or why it matters." }], final_answer: item.answer, status: "published" })), { onConflict: "id" }), `Upsert ${blueprint.slug} worked solutions`);
    for (const row of questionsForTopic(blueprint, topicIndex, subtopics)) { allQuestionRows.push(row.question); allRuleRows.push(row.rule); }
    process.stdout.write(`Prepared ${blueprint.code} ${blueprint.title}\n`);
  }
  for (let index = 0; index < allQuestionRows.length; index += 50) await checked(supabase.from("questions").upsert(allQuestionRows.slice(index, index + 50), { onConflict: "id" }), `Upsert questions ${index + 1}`);
  for (let index = 0; index < allRuleRows.length; index += 50) await checked(supabase.from("question_answer_rules").upsert(allRuleRows.slice(index, index + 50), { onConflict: "id" }), `Upsert rules ${index + 1}`);
  process.stdout.write(`Synced ${blueprints.length} topics, ${blueprints.length * 20} flashcards, ${blueprints.length * 5} worked solutions and ${allQuestionRows.length} questions.\n`);
}

main().catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
