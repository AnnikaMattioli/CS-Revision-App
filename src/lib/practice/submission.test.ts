import { describe, expect, it } from "vitest";
import { answerForPersistence, answerRowsForSubmission } from "./submission";

describe("practice submission persistence", () => {
  it("stores unanswered questions as a non-null blank JSON value", () => {
    const rows = answerRowsForSubmission("attempt", ["answered", "unanswered"], { answered: "CPU" });
    expect(rows).toEqual([
      { attempt_id: "attempt", question_id: "answered", answer: "CPU", flagged: false },
      { attempt_id: "attempt", question_id: "unanswered", answer: "", flagged: false },
    ]);
    expect(rows.every((row) => row.answer !== null)).toBe(true);
    expect(answerForPersistence(null)).toBe("");
  });
});
