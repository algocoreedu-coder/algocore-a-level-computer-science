import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { lessonRoot, paper3Root } from "./lib/paper3-validation.mjs";

const patterns = JSON.parse(await readFile(path.join(paper3Root, "academic", "exam-patterns.json"), "utf8"));
const patternIds = new Set(patterns.patterns.map((pattern) => pattern.id));
const commandPattern = {
  state: "P3-PAT-003", give: "P3-PAT-003", identify: "P3-PAT-003", define: "P3-PAT-003",
  describe: "P3-PAT-004", explain: "P3-PAT-005", compare: "P3-PAT-006", justify: "P3-PAT-007",
  calculate: "P3-PAT-008", show: "P3-PAT-008", trace: "P3-PAT-008",
  write: "P3-PAT-009", complete: "P3-PAT-009", draw: "P3-PAT-013",
};
const sectionPattern = {
  "13": "P3-PAT-011", "14": "P3-PAT-012", "15": "P3-PAT-002", "16": "P3-PAT-014",
  "17": "P3-PAT-010", "18": "P3-PAT-015", "19": "P3-PAT-016", "20": "P3-PAT-017",
};

let linked = 0;
const lessonPatternIds = new Map();
for (const name of (await readdir(lessonRoot)).filter((item) => item.endsWith(".json"))) {
  const filePath = path.join(lessonRoot, name);
  const lesson = JSON.parse(await readFile(filePath, "utf8"));
  if (!lesson.examPractice) throw new Error(`${name}: examPractice is required before linking patterns.`);
  const section = lesson.topicId.split("-")[1].split(".")[0];
  lesson.examPractice.examPatternIds = [...new Set([
    commandPattern[lesson.examPractice.commandWord] ?? "P3-PAT-001",
    sectionPattern[section],
    "P3-PAT-010",
    "P3-PAT-018",
  ])];
  for (const id of lesson.examPractice.examPatternIds) if (!patternIds.has(id)) throw new Error(`${name}: unknown exam pattern ${id}.`);
  lessonPatternIds.set(lesson.slug, lesson.examPractice.examPatternIds);
  await writeFile(filePath, `${JSON.stringify(lesson, null, 2)}\n`, "utf8");
  linked += 1;
}

const matrixPath = path.join(paper3Root, "academic", "coverage-matrix.json");
const matrix = JSON.parse(await readFile(matrixPath, "utf8"));
for (const row of matrix.rows) {
  row.examPatternIds = [...new Set(row.lessonSlugs.flatMap((slug) => lessonPatternIds.get(slug) ?? []))];
  row.evidenceStatus.examinerReport = "linked-via-exam-technique-pattern";
  row.evidenceStatus.independentExamPractice = "constructed-response-and-checkpoints";
}
matrix.summary.examinerReportLinked = matrix.rows.length;
await writeFile(matrixPath, `${JSON.stringify(matrix, null, 2)}\n`, "utf8");
console.log(`Linked ${linked} lessons to command-word, section and independent-practice exam patterns.`);
