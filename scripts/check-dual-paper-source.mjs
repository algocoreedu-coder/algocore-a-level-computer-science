import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "app/paper-3/page.tsx",
  "app/paper-3/mocks/page.tsx",
  "app/paper-3/sections/[sectionId]/page.tsx",
  "app/paper-3/topics/[slug]/page.tsx",
  "app/paper-4/page.tsx",
  "app/paper-4/lessons/[slug]/page.tsx",
  "app/paper-4/rehearsals/page.tsx",
  "app/paper-4/rehearsals/[paperId]/page.tsx",
  "app/api/paper4/rehearsals/[paperId]/submit/route.ts",
  "content/paper3/study-map.json",
  "app/data/paper4-v2/course-manifest.json",
];

for (const relativePath of requiredFiles) await access(path.join(root, relativePath));

const [authSource, proxySource, paper3Source, paper4Source] = await Promise.all([
  readFile(path.join(root, "app/lib/auth.ts"), "utf8"),
  readFile(path.join(root, "proxy.ts"), "utf8"),
  readFile(path.join(root, "app/paper-3/page.tsx"), "utf8"),
  readFile(path.join(root, "app/paper-4/page.tsx"), "utf8"),
]);

const assertions = [
  [authSource.includes('"/paper-3"') && authSource.includes('"/paper-4"'), "Authentication allow-list must include both papers."],
  [proxySource.includes('"/paper-3/:path*"') && proxySource.includes('"/paper-4/:path*"'), "Proxy matcher must protect both papers."],
  [paper3Source.includes("StudyMap"), "Paper 3 root must render the study map."],
  [paper4Source.includes("data-paper4-map"), "Paper 4 root must expose its independent route marker."],
];

for (const [condition, message] of assertions) {
  if (!condition) throw new Error(message);
}

console.log(JSON.stringify({
  status: "PASS",
  check: "dual-paper-source-isolation",
  requiredFiles: requiredFiles.length,
  protectedRoutes: ["/paper-3/:path*", "/paper-4/:path*"],
}, null, 2));
