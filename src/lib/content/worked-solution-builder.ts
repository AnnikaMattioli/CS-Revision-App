import type { OcrTopicBlueprint } from "@/data/ocr-gcse";
import type { WorkedSolution } from "@/types/content";

type Options = {
  id: string;
  blueprint: OcrTopicBlueprint;
  topicIndex: number;
  solutionIndex: number;
  qualification: "GCSE" | "A Level";
};

export function workedSolutionMarks(topicIndex: number, solutionIndex: number, qualification: Options["qualification"]) {
  const maximum = qualification === "GCSE" ? 8 : 12;
  const stride = qualification === "GCSE" ? 3 : 5;
  return ((topicIndex - 1 + solutionIndex * stride) % maximum) + 1;
}

export function buildWorkedSolution({ id, blueprint, topicIndex, solutionIndex, qualification }: Options): WorkedSolution {
  const facts = blueprint.units.flatMap((unit) => unit.facts);
  const marks = workedSolutionMarks(topicIndex, solutionIndex, qualification);
  const start = (solutionIndex * 4) % facts.length;
  const selected = Array.from({ length: marks }, (_, offset) => facts[(start + offset) % facts.length]);
  const keywords = [...new Set(selected.flatMap((item) => item.keywords))].slice(0, 8);

  return {
    id,
    slug: `${blueprint.slug}-worked-${solutionIndex + 1}`,
    title: `${marks}-mark worked response ${solutionIndex + 1}`,
    marks,
    prompt: marks === 1
      ? `${selected[0].question} [1 mark]`
      : `Explain the key ideas in ${blueprint.title}, including ${keywords.join(", ")}. [${marks} marks]`,
    topicSlug: blueprint.slug,
    topicTitle: blueprint.title,
    steps: [
      { title: "Decode the command", explanation: `The command is “explain”, so the response needs ${marks} precise, relevant ${marks === 1 ? "sentence" : "sentences"} rather than disconnected keywords.`, working: selected.map((item) => item.question).join("\n") },
      { title: "Plan the marking points", explanation: `Build one developed sentence for each available mark. Use the ideas ${keywords.join(", ")} accurately.` },
      { title: "Write the model response", explanation: `Write exactly ${marks} complete ${marks === 1 ? "sentence" : "sentences"}; each sentence should add a distinct accurate fact, explanation, comparison or consequence.` },
    ],
    finalAnswer: selected.map((item) => sentence(item.answer)).join(" "),
  };
}

function sentence(value: string) {
  return `${value.trim().replace(/[.!?]+$/, "")}.`;
}
