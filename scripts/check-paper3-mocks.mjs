import { spawnSync } from "node:child_process";
import path from "node:path";
import { paper3Root } from "./lib/paper3-validation.mjs";

const validator = path.join(paper3Root, "mocks", "validate-mocks.cjs");
const result = spawnSync(process.execPath, [validator], { cwd: path.dirname(validator), encoding: "utf8" });
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) throw result.error;
if (result.status !== 0) process.exitCode = result.status ?? 1;
