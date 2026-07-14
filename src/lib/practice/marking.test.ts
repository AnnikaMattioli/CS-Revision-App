import { describe, expect, it } from "vitest";
import type { ProtectedQuestion } from "@/types/practice";
import { markQuestion } from "./marking";

function question(rule: ProtectedQuestion["rule"], marks = 2): ProtectedQuestion { return { id: "q", topicSlug: "topic", topicTitle: "Topic", type: "short_answer", difficulty: "secure", prompt: "Prompt", marks, estimatedSeconds: 60, lessonHref: "/learn", rule, correctAnswer: "Expected", explanation: "Explanation", commonMistake: "Mistake" }; }

describe("deterministic marking", () => {
  it("normalises exact answers", () => expect(markQuestion(question({ kind: "exact", acceptable: ["Domain Name System"] }, 1), "  domain   name system ").marksAwarded).toBe(1));
  it("applies numerical tolerance", () => expect(markQuestion(question({ kind: "numeric", correct: 10, tolerance: 0.1 }, 1), "10.05 units").marksAwarded).toBe(1));
  it("awards and deducts multiple-select partial credit", () => expect(markQuestion(question({ kind: "set", correct: ["a", "b"], partialCredit: true }), ["a", "wrong"]).marksAwarded).toBe(0));
  it("awards matching pairs independently", () => expect(markQuestion(question({ kind: "matching", correct: { a: "1", b: "2" } }), { a: "1", b: "x" }).marksAwarded).toBe(1));
  it("does not award the same rubric concept twice", () => expect(markQuestion(question({ kind: "rubric", points: [{ id: "x", description: "Mentions RAM", patterns: ["ram"] }] }, 1), "RAM is faster because RAM is quick").marksAwarded).toBe(1));
  it("reports unanswered questions", () => expect(markQuestion(question({ kind: "exact", acceptable: ["yes"] }), null).status).toBe("unanswered"));
});
