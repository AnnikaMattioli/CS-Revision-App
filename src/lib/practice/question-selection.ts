const preferredOrder = ["multiple_choice", "short_answer", "boolean"];

export function interleaveQuestionTypes<T extends { type: string }>(questions: T[]) {
  const types = [...preferredOrder, ...new Set(questions.map((question) => question.type).filter((type) => !preferredOrder.includes(type)))];
  const groups = types.map((type) => questions.filter((question) => question.type === type));
  const ordered: T[] = [];
  const longest = Math.max(0, ...groups.map((group) => group.length));

  for (let index = 0; index < longest; index += 1) {
    for (const group of groups) if (group[index]) ordered.push(group[index]);
  }
  return ordered;
}
