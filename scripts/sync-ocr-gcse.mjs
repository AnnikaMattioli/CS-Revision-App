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

async function loadTypeScriptExport(sourceFile, exportName) {
  const source = fs.readFileSync(sourceFile, "utf8");
  const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const temporary = path.join(process.env.TMPDIR ?? "/tmp", `${courseKey}-gcse-${Date.now()}.mjs`);
  fs.writeFileSync(temporary, javascript);
  try { return (await import(pathToFileURL(temporary).href))[exportName]; }
  finally { fs.unlinkSync(temporary); }
}

const loadBlueprints = () => loadTypeScriptExport(syncConfig.source, syncConfig.exportName);
let courseEnrichment = {};
const enrichmentFor = (unitSlug) => courseEnrichment[unitSlug];

function uuid(group, topic, item) {
  return `${String(group).padStart(8, "0")}-0000-4000-8000-${String(topic * 1000 + item).padStart(12, "0")}`;
}
const questionId = (topic, item) => uuid(syncConfig.questionGroup, topic, item);
const ruleId = (topic, item) => uuid(syncConfig.ruleGroup, topic, item);
const difficulties = ["foundation", "developing", "secure", "advanced", "exam_challenge"];
const databaseDifficulty = (value) => value === "foundation" ? "foundation" : ["advanced", "exam_challenge"].includes(value) ? "stretch" : "standard";

function workedSolutionsForTopic(topic, topicIndex, subtopics) {
  const facts = topic.units.flatMap((unit) => unit.facts.map((item) => ({ ...item, unitSlug: unit.slug, subtopicId: subtopics.get(unit.slug) })));
  const maximum = courseKey.includes("a-level") ? 12 : 8;
  const stride = courseKey.includes("a-level") ? 5 : 3;
  return Array.from({ length: 5 }, (_, solutionIndex) => {
    const marks = ((topicIndex - 1 + solutionIndex * stride) % maximum) + 1;
    const start = (solutionIndex * 4) % facts.length;
    const selected = Array.from({ length: marks }, (_, offset) => facts[(start + offset) % facts.length]);
    const keywords = [...new Set(selected.flatMap((item) => item.keywords))].slice(0, 8);
    const finalAnswer = selected.map((item) => {
      const detail = enrichmentFor(item.unitSlug)?.workedExample;
      const answer = detail && facts.indexOf(item) % 5 === 0 ? `${item.answer.replace(/[.!?]+$/, "")}; for example, ${detail.charAt(0).toLowerCase()}${detail.slice(1).replace(/[.!?]+$/, "")}` : item.answer;
      return `${answer.trim().replace(/[.!?]+$/, "")}.`;
    }).join(" ");
    return {
      id: uuid(syncConfig.solutionGroup, topicIndex, solutionIndex + 1),
      subtopic_id: selected[0].subtopicId,
      title: `${marks}-mark worked response ${solutionIndex + 1}`,
      prompt: marks === 1 ? `${selected[0].question} [1 mark]` : `Explain the key ideas in ${topic.title}, including ${keywords.join(", ")}. [${marks} marks]`,
      steps: [
        { title: "Decode the command", explanation: `The response needs ${marks} precise, relevant ${marks === 1 ? "sentence" : "sentences"}.`, working: selected.map((item) => item.question).join("\n") },
        { title: "Plan the marking points", explanation: `Build one developed sentence for each available mark. Use ${keywords.join(", ")} accurately.` },
        { title: "Write the model response", explanation: `Write exactly ${marks} complete ${marks === 1 ? "sentence" : "sentences"}, each adding a distinct accurate marking point.` },
      ],
      final_answer: finalAnswer,
      status: "published",
    };
  });
}

function questionsForTopic(topic, topicIndex, subtopics) {
  const facts = topic.units.flatMap((unit) => unit.facts.map((item) => ({ ...item, lessonSlug: unit.slug, subtopicId: subtopics.get(unit.slug), enrichment: enrichmentFor(unit.slug) })));
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
  facts.filter((_, index) => index % 2 === 0).forEach((item, index) => {
    const number = 21 + index; const id = questionId(topicIndex, number); const correct = index % 2 === 0;
    const statement = correct ? item.answer : facts[(index * 2 + 1) % facts.length].answer;
    const publicQuestion = { id, topicSlug: topic.slug, topicTitle: topic.title, type: "boolean", difficulty: difficulties[(index + 1) % 5], prompt: `True or false — for “${item.question}”, this is an accurate answer: ${statement}`, marks: 1, estimatedSeconds: 40, options: [{ id: "true", label: "True" }, { id: "false", label: "False" }], lessonHref: `/learn/${topic.slug}/${item.lessonSlug}` };
    add(number, item, { id, type: "boolean", difficulty: publicQuestion.difficulty, marks: 1, public: publicQuestion, rule: { kind: "boolean", correct }, explanation: item.answer, commonMistake: "Judge the whole statement rather than one familiar word." });
  });
  facts.forEach((item, index) => {
    const number = 31 + index; const id = questionId(topicIndex, number);
    const points = item.keywords.slice(0, 4).map((keyword, pointIndex) => ({ id: `point-${pointIndex + 1}`, description: `Uses the idea “${keyword}” accurately`, patterns: [keyword.toLowerCase()] }));
    const publicQuestion = { id, topicSlug: topic.slug, topicTitle: topic.title, type: "short_answer", difficulty: difficulties[(index + 2) % 5], prompt: `${item.question} Give a developed exam-style answer. [${points.length} marks]`, marks: points.length, estimatedSeconds: 120, lessonHref: `/learn/${topic.slug}/${item.lessonSlug}` };
    const model = item.enrichment ? `${item.answer} ${item.enrichment.workedExample}` : item.answer;
    add(number, item, { id, type: "short_answer", difficulty: publicQuestion.difficulty, marks: points.length, public: publicQuestion, rule: { kind: "rubric", points }, explanation: model, commonMistake: item.enrichment?.misconception ?? "Connect technical terms in a clear answer." });
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
  if (courseKey === "ocr") courseEnrichment = await loadTypeScriptExport("src/data/ocr-gcse-enrichment.ts", "OCR_GCSE_ENRICHMENT");
  if (courseKey === "aqa") courseEnrichment = await loadTypeScriptExport("src/data/aqa-gcse-enrichment.ts", "AQA_GCSE_ENRICHMENT");
  if (courseKey === "ocr-a-level") courseEnrichment = await loadTypeScriptExport("src/data/ocr-a-level-enrichment.ts", "OCR_A_LEVEL_ENRICHMENT");
  if (courseKey === "aqa-a-level") courseEnrichment = await loadTypeScriptExport("src/data/aqa-a-level-enrichment.ts", "AQA_A_LEVEL_ENRICHMENT");
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
    const sectionRows = blueprint.units.flatMap((unit, unitOffset) => unit.facts.map((item, factOffset) => {
      const enrichment = enrichmentFor(unit.slug);
      const focus = item.question.replace(/\?$/, "").replace(/^(What|Why|How|When|Which|Give|State|Compare)\s+/i, "").toLowerCase();
      const enrichmentText = enrichment ? [
        `Big picture: ${unit.summary}`,
        `Worked example: ${enrichment.workedExample}`,
        `Common misconception: ${enrichment.misconception}`,
        `Exam technique: ${enrichment.examTip}`,
        `Retrieval challenge: explain ${focus} without looking, then add a specific example or consequence.`,
      ][factOffset] : `Use precise subject vocabulary and connect each point to its effect.`;
      const callout = enrichment && factOffset === 2 ? { type: "warning", title: "Correct it", text: "Before moving on, rewrite the misconception above as a precise true statement from memory." }
        : enrichment && factOffset === 3 ? { type: "tip", title: "Mark your answer", text: `Answer the heading now and award yourself one mark for each accurate use of ${item.keywords.join(", ")}.` }
          : factOffset === 4 ? { type: "definition", title: "Active recall", text: "Close the lesson and teach this idea aloud. Reopen it only to identify the exact missing term or link." } : undefined;
      return { id: uuid(syncConfig.sectionGroup, topicIndex, (unitOffset + 1) * 10 + factOffset + 1), lesson_id: lessons.get(unit.slug), heading: item.question, body: { paragraphs: [item.answer, enrichmentText, `Use ${item.keywords.join(", ")} accurately and connect each point to its effect.`], callout, code: enrichment && factOffset === 1 ? enrichment.code : undefined }, sort_order: factOffset + 1 };
    }));
    await checked(supabase.from("lesson_sections").upsert(sectionRows, { onConflict: "id" }), `Upsert ${blueprint.slug} lesson sections`);
    const facts = blueprint.units.flatMap((unit) => unit.facts.map((item) => ({ ...item, subtopicId: subtopics.get(unit.slug) })));
    await checked(supabase.from("flashcards").upsert(facts.map((item, index) => ({ id: uuid(syncConfig.flashcardGroup, topicIndex, index + 1), subtopic_id: item.subtopicId, front: item.question, back: item.answer, hint: `Include: ${item.keywords.join(", ")}`, sort_order: index + 1, status: "published" })), { onConflict: "id" }), `Upsert ${blueprint.slug} flashcards`);
    await checked(supabase.from("worked_solutions").upsert(workedSolutionsForTopic(blueprint, topicIndex, subtopics), { onConflict: "id" }), `Upsert ${blueprint.slug} worked solutions`);
    for (const row of questionsForTopic(blueprint, topicIndex, subtopics)) { allQuestionRows.push(row.question); allRuleRows.push(row.rule); }
    process.stdout.write(`Prepared ${blueprint.code} ${blueprint.title}\n`);
  }
  for (let index = 0; index < allQuestionRows.length; index += 50) await checked(supabase.from("questions").upsert(allQuestionRows.slice(index, index + 50), { onConflict: "id" }), `Upsert questions ${index + 1}`);
  for (let index = 0; index < allRuleRows.length; index += 50) await checked(supabase.from("question_answer_rules").upsert(allRuleRows.slice(index, index + 50), { onConflict: "id" }), `Upsert rules ${index + 1}`);
  process.stdout.write(`Synced ${blueprints.length} topics, ${blueprints.length * 20} flashcards, ${blueprints.length * 5} worked solutions and ${allQuestionRows.length} questions.\n`);
}

main().catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
