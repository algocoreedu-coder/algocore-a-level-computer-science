import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(root, "content", "paper3");
const failures = [];
let assertions = 0;

function check(condition, message) {
  assertions += 1;
  if (!condition) failures.push(message);
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function isLocalized(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof value.en === "string" &&
      value.en.trim() &&
      typeof value.vi === "string" &&
      value.vi.trim(),
  );
}

function sameLocalized(left, right) {
  return isLocalized(left) && isLocalized(right) && left.en === right.en && left.vi === right.vi;
}

function sameSet(left, right) {
  return left.size === right.size && [...left].every((item) => right.has(item));
}

const runtimeByKind = new Map();
function registerRuntime(runtimeFamily, kinds) {
  for (const kind of kinds) runtimeByKind.set(kind, runtimeFamily);
}

registerRuntime("concept-workbench", ["enumeration", "pointers", "sets", "records"]);
registerRuntime("file-workbench", ["file-organisation", "hashing", "collisions"]);
registerRuntime("float-workbench", ["floating-conversion"]);
registerRuntime("numeric-workbench", ["normalisation", "precision-range", "rounding-errors"]);
registerRuntime("network-workbench", ["tcp-ip-stack"]);
registerRuntime("network-topic-workbench", ["application-protocols", "bittorrent", "packet-routing", "switching-methods"]);
registerRuntime("hardware-workbench", ["pipeline-registers-interrupts"]);
registerRuntime("hardware-scale-workbench", ["risc-cisc", "flynn-parallelism", "virtual-machines"]);
registerRuntime("logic-workbench", ["logic-circuit"]);
registerRuntime("logic-scale-workbench", ["adders", "sr-jk-flip-flops", "boolean-simplification", "karnaugh-map"]);
registerRuntime("section16-workbench", ["process-states", "cpu-scheduling", "kernel-interrupts", "memory-addressing", "page-replacement", "translation-workflows", "compilation-pipeline", "bnf-explorer", "rpn-stack"]);
registerRuntime("section17-security-workbench", ["key-ownership", "quantum-key-distribution", "tls-session", "certificate-signature"]);
registerRuntime("section18-ai-workbench", ["dijkstra-search", "astar-search", "learning-categories", "neural-network", "backpropagation", "regression"]);
registerRuntime("section19-computational-workbench", ["linear-search", "binary-search", "bubble-sort", "insertion-sort", "stack-adt", "queue-adt", "linked-list", "binary-tree", "dictionary", "adt-implementation", "complexity-comparator", "recursion-trace", "call-stack-unwinding"]);
registerRuntime("section20-further-programming-workbench", ["paradigm-procedural", "addressing-modes", "assembly-workbench", "oop-encapsulation", "oop-relationships", "declarative-inference", "sequential-files", "random-files", "exception-flow"]);

const [catalog, lessonStatus, studyMap, lessonFiles] = await Promise.all([
  readJson(path.join(contentRoot, "visual-catalog.json")),
  readJson(path.join(contentRoot, "lesson-status.json")),
  readJson(path.join(contentRoot, "study-map.json")),
  readdir(path.join(contentRoot, "lessons")),
]);

check(catalog.schemaVersion === 1, "visual-catalog.json must use schemaVersion 1");
check(catalog.examYear === 2026, "visual-catalog.json must target examYear 2026");
check(Array.isArray(catalog.visuals), "visual-catalog.json must contain a visuals array");
check(catalog.visuals?.length === 66, `visual catalog must contain exactly 66 entries; found ${catalog.visuals?.length ?? 0}`);
check(lessonStatus.schemaVersion === 1 && Array.isArray(lessonStatus.lessons), "lesson-status.json must use the expected lesson registry schema");

const visuals = Array.isArray(catalog.visuals) ? catalog.visuals : [];
const statusRows = Array.isArray(lessonStatus.lessons) ? lessonStatus.lessons : [];
const statusByTopic = new Map(statusRows.map((entry) => [entry.topicId, entry]));
const topicsById = new Map(studyMap.topics.map((topic) => [topic.id, topic]));
const strandsById = new Map(studyMap.strands.map((strand) => [strand.id, strand]));
const lessonJsonFiles = lessonFiles.filter((name) => name.endsWith(".json"));
const topicIds = new Set();
const slugs = new Set();
const visualKinds = new Set();

for (const entry of visuals) {
  const label = entry.topicId || entry.slug || "unknown visual";
  check(typeof entry.topicId === "string" && entry.topicId.length > 0, `${label}: topicId is required`);
  check(typeof entry.slug === "string" && entry.slug.length > 0, `${label}: slug is required`);
  check(typeof entry.visualKind === "string" && entry.visualKind.length > 0, `${label}: visualKind is required`);
  check(!topicIds.has(entry.topicId), `${label}: duplicate topicId ${entry.topicId}`);
  check(!slugs.has(entry.slug), `${label}: duplicate slug ${entry.slug}`);
  check(!visualKinds.has(entry.visualKind), `${label}: duplicate visualKind ${entry.visualKind}`);
  topicIds.add(entry.topicId);
  slugs.add(entry.slug);
  visualKinds.add(entry.visualKind);

  check(entry.status === "implemented", `${label}: status must be implemented`);
  check(entry.priority === "required" || entry.priority === "recommended", `${label}: priority must be required or recommended`);
  check(isLocalized(entry.lessonTitle), `${label}: lessonTitle must contain non-empty EN and VI text`);
  check(isLocalized(entry.usage), `${label}: usage must contain non-empty EN and VI text`);
  check(isLocalized(entry.learningFocus), `${label}: learningFocus must contain non-empty EN and VI text`);
  check(isLocalized(entry.teacherNote), `${label}: teacherNote must contain non-empty EN and VI text`);

  const expectedRuntime = runtimeByKind.get(entry.visualKind);
  check(Boolean(expectedRuntime), `${label}: unrecognised visualKind ${entry.visualKind}`);
  check(entry.runtimeFamily === expectedRuntime, `${label}: runtimeFamily ${entry.runtimeFamily} does not match ${expectedRuntime}`);

  const status = statusByTopic.get(entry.topicId);
  check(Boolean(status), `${label}: no matching lesson-status entry`);
  check(status?.slug === entry.slug, `${label}: slug does not match lesson-status.json`);
  check(status?.state === "reviewed", `${label}: lesson-status state must be reviewed`);

  const topic = topicsById.get(entry.topicId);
  const strand = topic ? strandsById.get(topic.strandId) : undefined;
  check(Boolean(topic), `${label}: no matching study-map topic`);
  check(topic?.slug === entry.slug, `${label}: slug does not match study-map.json`);
  check(strand?.sectionId === entry.sectionId, `${label}: sectionId does not match the topic strand`);

  try {
    const lesson = await readJson(path.join(contentRoot, "lessons", `${entry.slug}.json`));
    check(lesson.topicId === entry.topicId && lesson.slug === entry.slug, `${label}: lesson JSON identity does not match the catalog`);
    check(lesson.visual?.kind === entry.visualKind, `${label}: visualKind does not match lesson.visual.kind`);
    check(sameLocalized(lesson.title, entry.lessonTitle), `${label}: lessonTitle does not match lesson JSON`);
  } catch (error) {
    check(false, `${label}: could not read lesson JSON (${error.message})`);
  }
}

const statusTopicIds = new Set(statusRows.map((entry) => entry.topicId));
const statusSlugs = new Set(statusRows.map((entry) => entry.slug));
const studyMapTopicIds = new Set(studyMap.topics.map((entry) => entry.id));
const lessonFileSlugs = new Set(lessonJsonFiles.map((name) => name.slice(0, -5)));

check(statusRows.length === 66, `lesson-status.json must contain 66 entries; found ${statusRows.length}`);
check(statusRows.every((entry) => entry.state === "reviewed"), "all lesson-status entries must be reviewed");
check(lessonJsonFiles.length === 66, `content/paper3/lessons must contain 66 JSON files; found ${lessonJsonFiles.length}`);
check(sameSet(topicIds, statusTopicIds), "visual catalog topicIds must exactly match lesson-status.json");
check(sameSet(topicIds, studyMapTopicIds), "visual catalog topicIds must exactly match study-map.json");
check(sameSet(slugs, statusSlugs), "visual catalog slugs must exactly match lesson-status.json");
check(sameSet(slugs, lessonFileSlugs), "visual catalog slugs must exactly match every lesson JSON filename");
check(visualKinds.size === 66, `all 66 visualKind values must be unique; found ${visualKinds.size}`);

const report = {
  status: failures.length ? "FAIL" : "PASS",
  examYear: catalog.examYear,
  visuals: visuals.length,
  required: visuals.filter((entry) => entry.priority === "required").length,
  recommended: visuals.filter((entry) => entry.priority === "recommended").length,
  implemented: visuals.filter((entry) => entry.status === "implemented").length,
  runtimeFamilies: new Set(visuals.map((entry) => entry.runtimeFamily)).size,
  assertions,
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
