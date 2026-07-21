const objectiveTypes = new Set(["multiple_choice", "multiple_select", "boolean"]);

export function isObjectiveQuestion(type: string) {
  return objectiveTypes.has(type);
}

export function objectiveQuestionLimit(count: number) {
  if (count <= 5) return 1;
  if (count <= 10) return 2;
  return 3;
}

export function selectPracticeQuestionMix<T extends { type: string }>(ranked: T[], count: number) {
  const limit = objectiveQuestionLimit(count);
  const selected: T[] = [];
  let objectiveCount = 0;

  for (const question of ranked) {
    if (selected.length >= count) break;
    if (isObjectiveQuestion(question.type)) {
      if (objectiveCount >= limit) continue;
      objectiveCount += 1;
    }
    selected.push(question);
  }

  return selected;
}
