import { readFile } from "node:fs/promises";
import path from "node:path";
import { createAudit, isLocalized, lessonRoot, loadPaper3, sha256 } from "./lib/paper3-validation.mjs";

const audit = createAudit("paper3-schema");
const releaseMode = process.argv.includes("--release");
const { lessons, catalog, status } = await loadPaper3();
const topics = new Map(catalog.topics.map((topic) => [topic.id, topic]));
const statuses = new Map(status.lessons.map((entry) => [entry.topicId, entry]));

audit.metric("lessons", lessons.length);
audit.metric("topics", catalog.topics.length);
audit.metric("strands", catalog.strands.length);
audit.check(lessons.length === 66, `Expected 66 lesson files, found ${lessons.length}.`);
audit.check(catalog.topics.length === 66, `Expected 66 catalog topics, found ${catalog.topics.length}.`);
audit.check(catalog.strands.length === 15, `Expected 15 syllabus strands, found ${catalog.strands.length}.`);
audit.check(status.lessons.length === 66, `Expected 66 lesson-status entries, found ${status.lessons.length}.`);

for (const { name, data: lesson } of lessons) {
  const label = `${name} (${lesson.topicId ?? "missing topicId"})`;
  const topic = topics.get(lesson.topicId);
  const registry = statuses.get(lesson.topicId);
  audit.check(lesson.schemaVersion === 1, `${label}: schemaVersion must be 1.`);
  audit.check(typeof lesson.version === "string" && lesson.version.length > 0, `${label}: version is required.`);
  audit.check(topic?.slug === lesson.slug, `${label}: slug does not match study-map.json.`);
  audit.check(path.basename(name, ".json") === lesson.slug, `${label}: file name must match slug.`);
  audit.check(registry?.slug === lesson.slug, `${label}: lesson-status entry is missing or mismatched.`);
  const raw = await readFile(path.join(lessonRoot, name), "utf8");
  if (releaseMode) {
    audit.check(registry?.contentSha256 === sha256(raw), `${label}: lesson-status contentSha256 is stale.`);
    audit.check(registry?.releaseAllowed === true, `${label}: releaseAllowed must be true after promotion.`);
    audit.check(registry?.gates && Object.keys(registry.gates).length === 6 && Object.values(registry.gates).every((value) => value === "PASS"), `${label}: all six release gates must be PASS.`);
  }
  for (const [field, value] of [["title", lesson.title], ["question", lesson.question], ["opening", lesson.opening]]) {
    audit.check(isLocalized(value), `${label}: ${field} must contain non-empty en and vi text.`);
  }
  for (const field of ["objectives", "glossary", "theory", "misconceptions", "checkpoints", "takeaways", "sources"]) {
    audit.check(Array.isArray(lesson[field]) && lesson[field].length > 0, `${label}: ${field} must be a non-empty array.`);
  }
  audit.check(lesson.workedExample?.origin === "algocore-authored", `${label}: worked example origin must be algocore-authored.`);
  audit.check(lesson.workedExample?.officialMarks === null, `${label}: worked example must not claim official marks.`);
  audit.check(lesson.recognition?.commandWords?.length > 0, `${label}: topic-specific command-word guidance is required.`);
  audit.check(lesson.examPractice?.origin === "algocore-authored", `${label}: one AlgoCore-authored exam practice is required.`);
  audit.check(Number.isInteger(lesson.examPractice?.marks) && lesson.examPractice.marks >= 2 && lesson.examPractice.marks <= 6, `${label}: exam practice marks must be an integer from 2 to 6.`);
  audit.check(isLocalized(lesson.examPractice?.prompt), `${label}: exam practice prompt must contain en and vi text.`);
  audit.check(lesson.examPractice?.markingPoints?.length >= lesson.examPractice?.marks, `${label}: exam practice needs at least one marking point per mark.`);
}

for (const topic of catalog.topics) {
  audit.check(lessons.some(({ data }) => data.topicId === topic.id), `${topic.id}: catalog topic has no lesson file.`);
}

audit.finish();
