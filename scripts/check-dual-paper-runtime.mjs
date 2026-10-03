import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const username = `dual_paper_${randomBytes(6).toString("hex")}`;
const password = randomBytes(24).toString("base64url");
const sessionSecret = randomBytes(48).toString("base64url");
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function freePort() {
  return await new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close((error) => error ? reject(error) : resolve(port));
    });
  });
}

async function waitForServer(baseUrl, child, stderr) {
  for (let attempt = 0; attempt < 240; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Production server exited early (${child.exitCode}). ${stderr()}`);
    try {
      const response = await fetch(`${baseUrl}/login?lang=en`, { redirect: "manual" });
      if (response.status === 200) return;
    } catch { /* Server is starting. */ }
    await delay(100);
  }
  throw new Error(`Production server did not become ready. ${stderr()}`);
}

const port = await freePort();
const baseUrl = `http://127.0.0.1:${port}`;
const env = {
  ...process.env,
  ALGOCORE_STUDENT_USERNAME: username,
  ALGOCORE_STUDENT_PASSWORD: password,
  ALGOCORE_SESSION_SECRET: sessionSecret,
  ALGOCORE_COOKIE_SECURE: "false",
  STUDENT_LOGIN_USERNAME: username,
  STUDENT_LOGIN_PASSWORD: password,
  STUDENT_SESSION_SECRET: sessionSecret,
  STUDENT_AUTH_BASE_URL: baseUrl,
};
const server = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: root,
  env,
  windowsHide: true,
  stdio: ["ignore", "pipe", "pipe"],
});
let serverError = "";
server.stderr.on("data", (chunk) => { serverError += chunk; });

try {
  await waitForServer(baseUrl, server, () => serverError.slice(-2000));
  const login = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: baseUrl, "sec-fetch-site": "same-origin" },
    body: JSON.stringify({ username, password, next: "/paper-3?lang=en", lang: "en" }),
    redirect: "manual",
  });
  if (login.status !== 200) throw new Error(`Runtime login failed with status ${login.status}.`);
  const cookie = (login.headers.get("set-cookie") ?? "").split(";", 1)[0];
  if (!cookie.startsWith("algocore_student_session=")) throw new Error("Runtime login did not issue a student session cookie.");

  const [paper3Catalog, paper4Manifest] = await Promise.all([
    readFile(path.join(root, "content", "paper3", "study-map.json"), "utf8").then(JSON.parse),
    readFile(path.join(root, "app", "data", "paper4-v2", "course-manifest.json"), "utf8").then(JSON.parse),
  ]);
  const routes = [];
  for (const locale of ["en", "vi"]) {
    routes.push({ paper: 3, path: `/paper-3?lang=${locale}`, marker: "data-paper3-map" });
    routes.push({ paper: 3, path: `/paper-3/mocks?lang=${locale}`, marker: "data-paper3-mocks" });
    for (const section of paper3Catalog.sections) routes.push({ paper: 3, path: `/paper-3/sections/${section.id}?lang=${locale}`, marker: `data-section-id=\"${section.id}\"` });
    for (const topic of paper3Catalog.topics) routes.push({ paper: 3, path: `/paper-3/topics/${topic.slug}?lang=${locale}`, marker: `data-paper3-lesson=\"${topic.id}\"` });
    routes.push({ paper: 4, path: `/paper-4?lang=${locale}`, marker: "data-paper4-map" });
    routes.push({ paper: 4, path: `/paper-4/rehearsals?lang=${locale}`, marker: "data-rehearsal-hub" });
    for (const lesson of paper4Manifest.lessons) routes.push({ paper: 4, path: `/paper-4/lessons/${lesson.slug}?lang=${locale}`, marker: `data-paper4-lesson=\"${lesson.slug}\"` });
  }

  const failures = [];
  for (const route of routes) {
    const response = await fetch(`${baseUrl}${route.path}`, { headers: { cookie }, redirect: "manual" });
    const html = await response.text();
    const ownMarker = route.marker;
    const foreignMarker = route.paper === 3 ? "data-paper4-" : "data-paper3-";
    if (response.status !== 200 || !html.includes(ownMarker) || html.includes(foreignMarker)) {
      failures.push({ path: route.path, status: response.status, ownMarker, foreignMarkerPresent: html.includes(foreignMarker) });
    }
  }
  if (failures.length) throw new Error(`Dual-paper route failures: ${JSON.stringify(failures.slice(0, 12))}`);

  const authReport = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(root, "scripts", "check-student-auth.mjs")], {
      cwd: root,
      env,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve(stdout) : reject(new Error(`Student auth gate failed (${code}).\n${stdout}\n${stderr}`)));
  });
  const authReportStart = authReport.indexOf("{\n");
  const authResult = JSON.parse(authReport.slice(authReportStart));
  if (authResult.decision !== "PASS") throw new Error("Student authentication gate did not pass.");

  console.log(JSON.stringify({
    status: "PASS",
    check: "dual-paper-runtime-isolation",
    authenticatedRoutes: routes.length,
    paper3Routes: routes.filter((route) => route.paper === 3).length,
    paper4Routes: routes.filter((route) => route.paper === 4).length,
    overlapFailures: 0,
    authChecksPassed: authResult.passed,
  }, null, 2));
} finally {
  if (server.exitCode === null) server.kill();
}
