# Adaptive selection and mastery

Phase 4 uses transparent, deterministic scoring. It does not claim to use artificial intelligence.

## Question selection

Each candidate question receives five configurable component scores:

- 40% weak-topic priority
- 20% recent incorrect-answer priority
- 20% suitability for the student’s current mastery
- 10% spaced retrieval from previously seen material
- 10% unseen or underused questions

A small current-topic boost supports a chosen focus. Questions seen in the last two days receive a repeat penalty unless there are not enough alternatives. Stable question IDs break ties, so the same evidence produces the same explainable ordering. The weights live in `src/lib/progress/adaptive.ts` and can be changed without rewriting the algorithm.

## Mastery calculation

Mastery combines mark accuracy, question difficulty, independent work and first-attempt evidence. Harder questions carry slightly more evidence, but all scores remain bounded between 0 and 100. Labels are Not started, Beginning, Developing, Secure and Mastered.

New performance is blended with the existing score. One update can raise mastery by at most 15 points or lower it by at most 8 points, preventing one mistake from erasing a longer record. Every stored topic record includes accuracy, trend and a student-facing explanation.

The representative bank currently has ten questions, so the algorithm’s variety becomes more meaningful as more original questions are imported. Unit tests cover weak-topic priority, recent mistakes, immediate-repeat avoidance, difficulty rewards and score stability.
