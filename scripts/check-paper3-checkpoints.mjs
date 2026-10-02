import { createAudit, loadPaper3 } from "./lib/paper3-validation.mjs";

const audit = createAudit("paper3-checkpoints");
const { lessons } = await loadPaper3();
const positions = [0, 0, 0];
let checkpoints = 0;
let transfer = 0;

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
  }
}

const dominantShare = checkpoints ? Math.max(...positions) / checkpoints : 1;
audit.metric("checkpoints", checkpoints);
audit.metric("transfer", transfer);
audit.metric("correctPositions", positions);
audit.metric("dominantPositionShare", Number(dominantShare.toFixed(3)));
audit.check(checkpoints >= 330, `Expected at least 330 checkpoints, found ${checkpoints}.`);
audit.check(transfer >= 98, `Expected at least 98 transfer checkpoints, found ${transfer}.`);
audit.check(dominantShare <= 0.45, `Correct-answer positions remain predictable (${(dominantShare * 100).toFixed(1)}% in one position).`);
audit.finish();
