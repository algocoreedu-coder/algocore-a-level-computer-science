import { createAudit, loadPaper3 } from "./lib/paper3-validation.mjs";

const audit = createAudit("paper3-code-contract");
const { lessons } = await loadPaper3();
const allowed = new Set(["pseudocode", "python", "assembly", "declarative", "model"]);
let fragments = 0;

for (const { name, data: lesson } of lessons) {
  const blocks = [
    ...lesson.theory.map((block) => ({ where: `theory:${block.id}`, ...block })),
    ...lesson.workedExample.steps.map((step) => ({ where: `worked:${step.id}`, ...step })),
  ];
  for (const block of blocks.filter((item) => typeof item.code === "string" && item.code.trim())) {
    fragments += 1;
    audit.check(allowed.has(block.codeLanguage), `${name} ${block.where}: missing or invalid codeLanguage.`);
    audit.check(typeof block.codeDialect === "string" && block.codeDialect.trim().length > 0, `${name} ${block.where}: codeDialect is required.`);
  }
}

audit.metric("codeFragments", fragments);
audit.check(fragments > 0, "Expected at least one code fragment across Paper 3 lessons.");
audit.finish();
