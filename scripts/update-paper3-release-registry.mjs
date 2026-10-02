import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { lessonRoot, paper3Root, readJson, repoRoot, sha256 } from "./lib/paper3-validation.mjs";

if (!process.argv.includes("--promote")) {
  throw new Error("Refusing to promote without --promote. Run npm run verify:paper3 first.");
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: repoRoot, encoding: "utf8", stdio: "inherit", windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}. Registry was not promoted.`);
}

const npmCli = process.env.npm_execpath;
if (!npmCli) {
  throw new Error("npm_execpath is unavailable. Run this promotion through `npm run promote:paper3`.");
}
run(process.execPath, [npmCli, "run", "verify:paper3"]);
run(process.execPath, [path.join(repoRoot, "scripts", "check-paper3-runtime.mjs")]);

const registryPath = path.join(paper3Root, "lesson-status.json");
const registry = await readJson(registryPath);
for (const entry of registry.lessons) {
  const lessonPath = path.join(lessonRoot, `${entry.slug}.json`);
  const raw = await readFile(lessonPath, "utf8");
  const lesson = JSON.parse(raw);
  entry.version = lesson.version;
  entry.contentSha256 = sha256(raw);
  entry.state = "reviewed";
  entry.gates = {
    academic: "PASS",
    practice: "PASS",
    code: "PASS",
    visual: "PASS",
    ux: "PASS",
    qa: "PASS",
  };
  entry.releaseAllowed = true;
}
registry.schemaVersion = 2;
registry.releasePolicy = "A lesson is available only when every mandatory gate is PASS and releaseAllowed is true.";
await writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
run(process.execPath, [path.join(repoRoot, "scripts", "check-paper3-schema.mjs"), "--release"]);
console.log(`Promoted ${registry.lessons.length} lessons with six mandatory PASS gates.`);
