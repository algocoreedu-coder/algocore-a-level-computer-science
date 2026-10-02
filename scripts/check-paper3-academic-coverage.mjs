import path from "node:path";
import { createAudit, loadPaper3, paper3Root, readJson } from "./lib/paper3-validation.mjs";

const audit = createAudit("paper3-academic-coverage");
const { lessons, catalog } = await loadPaper3();
const academicRoot = path.join(paper3Root, "academic");
const objectives = await readJson(path.join(academicRoot, "syllabus-objectives-2026.json"));
const coverage = await readJson(path.join(academicRoot, "coverage-matrix.json"));
const alignment = await readJson(path.join(academicRoot, "book-alignment.json"));
const patterns = await readJson(path.join(academicRoot, "exam-patterns.json"));
const lessonSlugs = new Set(lessons.map(({ data }) => data.slug));
const strandIds = new Set(catalog.strands.map((strand) => strand.id));
const objectiveIds = new Set(objectives.capabilities.map((item) => item.id));

audit.metric("objectives", objectives.capabilities.length);
audit.metric("coverageEntries", coverage.rows.length);
audit.metric("bookAlignmentLessons", alignment.lessons.length);
audit.metric("examPatterns", patterns.patterns.length);
audit.metric("fullTeachingDepth", objectives.capabilities.filter((item) => item.depth === "full").length);
audit.metric("examinerReportLinked", coverage.rows.filter((item) => item.evidenceStatus.examinerReport === "linked-via-exam-technique-pattern").length);
audit.check(objectives.capabilities.length === 200, `Expected 200 independently testable capabilities, found ${objectives.capabilities.length}.`);
audit.check(objectiveIds.size === 200, "Capability ids must be unique.");
audit.check(objectives.capabilities.every((item) => item.depth === "full"), "Every capability must pass the teaching-depth gate after the Section 13, 19 and 20 repairs.");
audit.check(new Set(objectives.capabilities.map((item) => item.strand)).size === 15, "Objectives must cover all 15 syllabus strands.");
for (const objective of objectives.capabilities) {
  audit.check(strandIds.has(objective.strand), `${objective.id}: unknown strand ${objective.strand}.`);
  audit.check(objective.linkedLessonSlugs.length > 0, `${objective.id}: no linked lesson.`);
  for (const slug of objective.linkedLessonSlugs) audit.check(lessonSlugs.has(slug), `${objective.id}: unknown lesson slug ${slug}.`);
}
audit.check(coverage.rows.length === 200, `Expected 200 coverage entries, found ${coverage.rows.length}.`);
for (const entry of coverage.rows) audit.check(objectiveIds.has(entry.capabilityId), `Coverage references unknown objective ${entry.capabilityId}.`);
audit.check(coverage.rows.every((entry) => entry.evidenceStatus.independentExamPractice === "constructed-response-and-checkpoints"), "Every capability must link constructed response and checkpoint practice.");
audit.check(coverage.rows.every((entry) => entry.evidenceStatus.examinerReport === "linked-via-exam-technique-pattern"), "Every capability must link an examiner-report-backed technique pattern.");
audit.check(new Set(alignment.lessons.map((item) => item.lessonSlug)).size === 66, "Book alignment must cover all 66 lessons exactly once.");
for (const item of alignment.lessons) audit.check(lessonSlugs.has(item.lessonSlug), `Book alignment references unknown lesson ${item.lessonSlug}.`);
audit.check(Array.isArray(patterns.patterns) && patterns.patterns.length > 0, "Exam patterns must contain evidence-backed entries.");
audit.finish();
