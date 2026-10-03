import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = process.env.ALGOCORE_NEXT_DIST_DIR || ".next";
const manifestPath = path.join(root, distDir, "server", "app-paths-manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const requiredRoutes = [
  "/paper-3/page",
  "/paper-3/mocks/page",
  "/paper-3/sections/[sectionId]/page",
  "/paper-3/topics/[slug]/page",
  "/paper-4/page",
  "/paper-4/lessons/[slug]/page",
  "/paper-4/rehearsals/page",
  "/paper-4/rehearsals/[paperId]/page",
  "/api/paper4/rehearsals/[paperId]/submit/route",
];
const missing = requiredRoutes.filter((route) => !Object.hasOwn(manifest, route));
if (missing.length) throw new Error(`Built application is missing routes: ${missing.join(", ")}`);

console.log(JSON.stringify({
  status: "PASS",
  check: "dual-paper-build-manifest",
  distDir,
  paper3Routes: requiredRoutes.filter((route) => route.startsWith("/paper-3")).length,
  paper4Routes: requiredRoutes.filter((route) => route.startsWith("/paper-4") || route.startsWith("/api/paper4")).length,
}, null, 2));
