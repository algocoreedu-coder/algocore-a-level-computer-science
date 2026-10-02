import path from "node:path";
import { collectReferencedSourceIds, createAudit, loadPaper3, paper3Root, readJson } from "./lib/paper3-validation.mjs";

const audit = createAudit("paper3-source-integrity");
const { lessons } = await loadPaper3();
const examPatterns = await readJson(path.join(paper3Root, "academic", "exam-patterns.json"));
const examPatternIds = new Set(examPatterns.patterns.map((pattern) => pattern.id));
const examinerSourceIds = new Set(examPatterns.sourceRegistry.filter((source) => /examiner report/i.test(source.title)).map((source) => source.id));
const examinerPatternIds = new Set(examPatterns.patterns.filter((pattern) => pattern.sourceIds.some((id) => examinerSourceIds.has(id))).map((pattern) => pattern.id));
let qpLessons = 0;
let msLessons = 0;
let examinerLinkedLessons = 0;

for (const { name, data: lesson } of lessons) {
  const ids = lesson.sources.map((source) => source.id);
  const idSet = new Set(ids);
  audit.check(idSet.size === ids.length, `${name}: source ids must be unique.`);
  for (const source of lesson.sources) {
    audit.check(typeof source.title === "string" && source.title.trim(), `${name}/${source.id}: title is required.`);
    audit.check(typeof source.locator === "string" && source.locator.trim(), `${name}/${source.id}: a precise locator is required.`);
    audit.check(["syllabus", "book", "guide", "question-paper", "mark-scheme", "examiner-report"].includes(source.kind), `${name}/${source.id}: unsupported source kind ${source.kind}.`);
  }
  for (const sourceId of collectReferencedSourceIds(lesson)) {
    audit.check(idSet.has(sourceId), `${name}: block references missing source id ${sourceId}.`);
  }
  audit.check(lesson.examPractice?.examPatternIds?.length >= 2, `${name}: exam practice must link evidence-backed exam patterns.`);
  for (const patternId of lesson.examPractice?.examPatternIds ?? []) {
    audit.check(examPatternIds.has(patternId), `${name}: exam practice references unknown pattern ${patternId}.`);
  }
  if ((lesson.examPractice?.examPatternIds ?? []).some((id) => examinerPatternIds.has(id))) examinerLinkedLessons += 1;
  const kinds = new Set(lesson.sources.map((source) => source.kind));
  audit.check(kinds.has("syllabus"), `${name}: syllabus evidence is required.`);
  audit.check(kinds.has("book"), `${name}: coursebook evidence is required.`);
  if (kinds.has("question-paper")) qpLessons += 1;
  if (kinds.has("mark-scheme")) msLessons += 1;
}

audit.metric("lessonsWithQuestionPaper", qpLessons);
audit.metric("lessonsWithMarkScheme", msLessons);
audit.metric("lessonsWithExaminerReportPattern", examinerLinkedLessons);
audit.check(qpLessons >= 54, `Question-paper evidence regressed below the audited baseline (54): ${qpLessons}.`);
audit.check(msLessons >= 55, `Mark-scheme evidence regressed below the audited baseline (55): ${msLessons}.`);
audit.check(examinerLinkedLessons === lessons.length, `Expected all lessons to link an examiner-report-backed exam technique pattern: ${examinerLinkedLessons}/${lessons.length}.`);
audit.finish();
