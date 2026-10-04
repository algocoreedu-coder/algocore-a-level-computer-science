import { createAudit, loadPaper3 } from "./lib/paper3-validation.mjs";

const audit = createAudit("paper3-checkpoints");
const { lessons } = await loadPaper3();
const positions = [0, 0, 0];
let checkpoints = 0;
let transfer = 0;
const section20Prompts = [];
const section20Distractors = [];
const section20Explanations = [];

const normalizeLocalized = (value) => `${value?.en ?? ""}||${value?.vi ?? ""}`.toLowerCase().replace(/\s+/g, " ").trim();
const duplicateShare = (values) => {
  if (!values.length) return 0;
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  const repeatedOccurrences = [...counts.values()].reduce((total, count) => total + Math.max(0, count - 1), 0);
  return repeatedOccurrences / values.length;
};

for (const { name, data: lesson } of lessons) {
  audit.check(lesson.checkpoints.length >= 3, `${name}: expected at least three quick checkpoints.`);
  audit.check(lesson.checkpoints.some((item) => item.transfer), `${name}: expected at least one transfer checkpoint.`);
  for (const checkpoint of lesson.checkpoints) {
    checkpoints += 1;
    if (checkpoint.transfer) transfer += 1;
    const ids = checkpoint.choices.map((choice) => choice.id);
    const correctPosition = ids.indexOf(checkpoint.correctChoiceId);
    audit.check(checkpoint.choices.length >= 3, `${name}/${checkpoint.id}: expected at least three choices.`);
    audit.check(new Set(ids).size === ids.length, `${name}/${checkpoint.id}: choice ids must be unique.`);
    audit.check(correctPosition >= 0, `${name}/${checkpoint.id}: correctChoiceId does not identify a choice.`);
    if (correctPosition >= 0 && correctPosition < positions.length) positions[correctPosition] += 1;
    if (lesson.topicId.startsWith("P3-20.")) {
      section20Prompts.push(normalizeLocalized(checkpoint.prompt));
      section20Explanations.push(normalizeLocalized(checkpoint.explanation));
      checkpoint.choices.forEach((choice) => {
        if (choice.id !== checkpoint.correctChoiceId) section20Distractors.push(normalizeLocalized(choice.label));
      });
    }
  }
}

const dominantShare = checkpoints ? Math.max(...positions) / checkpoints : 1;
const section20PromptDuplicateShare = duplicateShare(section20Prompts);
const section20DistractorDuplicateShare = duplicateShare(section20Distractors);
const section20ExplanationDuplicateShare = duplicateShare(section20Explanations);
audit.metric("checkpoints", checkpoints);
audit.metric("transfer", transfer);
audit.metric("correctPositions", positions);
audit.metric("dominantPositionShare", Number(dominantShare.toFixed(3)));
audit.metric("section20PromptDuplicateShare", Number(section20PromptDuplicateShare.toFixed(3)));
audit.metric("section20DistractorDuplicateShare", Number(section20DistractorDuplicateShare.toFixed(3)));
audit.metric("section20ExplanationDuplicateShare", Number(section20ExplanationDuplicateShare.toFixed(3)));
audit.check(checkpoints >= 330, `Expected at least 330 checkpoints, found ${checkpoints}.`);
audit.check(transfer >= 98, `Expected at least 98 transfer checkpoints, found ${transfer}.`);
audit.check(dominantShare <= 0.45, `Correct-answer positions remain predictable (${(dominantShare * 100).toFixed(1)}% in one position).`);
audit.check(section20PromptDuplicateShare <= 0.1, `Section 20 repeats ${(section20PromptDuplicateShare * 100).toFixed(1)}% of checkpoint prompts; expected at most 10%.`);
audit.check(section20DistractorDuplicateShare <= 0.1, `Section 20 repeats ${(section20DistractorDuplicateShare * 100).toFixed(1)}% of distractors; expected at most 10%.`);
audit.check(section20ExplanationDuplicateShare <= 0.1, `Section 20 repeats ${(section20ExplanationDuplicateShare * 100).toFixed(1)}% of explanations; expected at most 10%.`);
audit.finish();
