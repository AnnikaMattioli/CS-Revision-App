import { describe, expect, it } from "vitest";
import { interleaveQuestionTypes } from "./question-selection";

describe("interleaveQuestionTypes", () => {
  it("mixes objective and written questions from a bank grouped by type", () => {
    const questions = [
      ...Array.from({ length: 5 }, (_, id) => ({ id, type: "multiple_choice" })),
      ...Array.from({ length: 5 }, (_, id) => ({ id: id + 5, type: "boolean" })),
      ...Array.from({ length: 5 }, (_, id) => ({ id: id + 10, type: "short_answer" })),
    ];
    expect(interleaveQuestionTypes(questions).slice(0, 5).map((question) => question.type)).toEqual([
      "multiple_choice", "short_answer", "boolean", "multiple_choice", "short_answer",
    ]);
  });
});
