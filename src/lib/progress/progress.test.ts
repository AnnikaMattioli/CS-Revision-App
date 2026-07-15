import { describe, expect, it } from "vitest";
import { calculateMastery, masteryLabel } from "./mastery";
import { selectAdaptiveQuestions } from "./adaptive";
import { createEmptyProgress } from "./demo-progress";

describe("new learner progress", () => {
  it("starts every metric and topic at zero", () => {
    const progress = createEmptyProgress();
    expect(progress.totalQuestions).toBe(0);
    expect(progress.recentAccuracy).toBe(0);
    expect(progress.currentStreak).toBe(0);
    expect(progress.topics.every((topic) => topic.score === 0 && topic.label === "Not started")).toBe(true);
    expect(progress.achievements.every((achievement) => achievement.progress === 0 && !achievement.earnedAt)).toBe(true);
  });
});

describe("mastery calculation", () => {
  it("uses understandable labels", () => {
    expect(masteryLabel(0, 0)).toBe("Not started");
    expect(masteryLabel(34)).toBe("Beginning");
    expect(masteryLabel(74)).toBe("Secure");
    expect(masteryLabel(75)).toBe("Mastered");
  });

  it("rewards successful harder independent work", () => {
    const result = calculateMastery(50, 10, [{ marksAwarded: 4, marksAvailable: 4, difficulty: "advanced", firstAttempt: true, hintUsed: false }]);
    expect(result.score).toBeGreaterThan(50);
    expect(result.explanation).toContain("adjusted for question difficulty");
  });

  it("does not let one mistake cause a dramatic fall", () => {
    const result = calculateMastery(80, 30, [{ marksAwarded: 0, marksAvailable: 1, difficulty: "foundation" }]);
    expect(result.score).toBeGreaterThanOrEqual(72);
  });
});

describe("adaptive selection", () => {
  const candidates = [
    { id: "a", topicSlug: "strong", difficulty: "advanced" },
    { id: "b", topicSlug: "weak", difficulty: "foundation" },
    { id: "c", topicSlug: "weak", difficulty: "developing" },
  ];

  it("prioritises weak topics and recent errors", () => {
    const selected = selectAdaptiveQuestions({ candidates, topicMastery: { strong: 85, weak: 25 }, history: [{ questionId: "c", seenCount: 1, lastSeenDaysAgo: 4, recentlyIncorrect: true }], count: 2 });
    expect(selected.map((item) => item.id)).toContain("c");
    expect(selected[0].topicSlug).toBe("weak");
  });

  it("avoids an immediate repeat when alternatives exist", () => {
    const selected = selectAdaptiveQuestions({ candidates, topicMastery: { strong: 50, weak: 50 }, history: [{ questionId: "b", seenCount: 2, lastSeenDaysAgo: 0 }], count: 1 });
    expect(selected[0].id).not.toBe("b");
  });
});
