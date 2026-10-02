import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const paper3Root = path.join(repoRoot, "content", "paper3");
export const lessonRoot = path.join(paper3Root, "lessons");

export async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

export async function loadPaper3() {
  const lessonFiles = (await readdir(lessonRoot)).filter((name) => name.endsWith(".json")).sort();
  const lessons = await Promise.all(
    lessonFiles.map(async (name) => ({ name, data: await readJson(path.join(lessonRoot, name)) })),
  );
  const catalog = await readJson(path.join(paper3Root, "study-map.json"));
  const status = await readJson(path.join(paper3Root, "lesson-status.json"));
  return { lessonFiles, lessons, catalog, status };
}

export function isLocalized(value) {
  return Boolean(value && typeof value.en === "string" && value.en.trim() && typeof value.vi === "string" && value.vi.trim());
}

export function sha256(text) {
  return createHash("sha256").update(text).digest("hex");
}

export function collectReferencedSourceIds(lesson) {
  return [
    ...lesson.theory.flatMap((block) => block.sourceIds ?? []),
    ...(lesson.visual.sourceIds ?? []),
    ...(lesson.workedExample.sourceIds ?? []),
    ...(lesson.examPractice?.sourceIds ?? []),
  ];
}

export function createAudit(name) {
  const failures = [];
  const metrics = {};
  return {
    check(condition, message) {
      if (!condition) failures.push(message);
    },
    metric(key, value) {
      metrics[key] = value;
    },
    finish() {
      const payload = { check: name, passed: failures.length === 0, metrics, failures };
      console.log(JSON.stringify(payload, null, 2));
      if (failures.length) process.exitCode = 1;
    },
  };
}
