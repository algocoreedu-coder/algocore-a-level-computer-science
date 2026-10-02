import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import axe from "axe-core";
import { readJson } from "./lib/paper3-validation.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const username = `paper3_qa_${randomBytes(6).toString("hex")}`;
const password = randomBytes(24).toString("base64url");
const sessionSecret = randomBytes(48).toString("base64url");
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

class CDP {
  constructor(url) { this.id = 0; this.pending = new Map(); this.socket = new WebSocket(url); }
  async open() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      message.error ? pending.reject(new Error(message.error.message)) : pending.resolve(message.result);
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }
  close() { this.socket.close(); }
}

async function checkPaper3InBrowser(baseUrl, cookie, routes) {
  const browserPath = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft Edge\\Application\\msedge.exe",
  ].filter(Boolean).find(existsSync);
  if (!browserPath) throw new Error("A Chromium browser is required for Paper 3 UX and accessibility release checks.");

  const profile = await mkdtemp(path.join(os.tmpdir(), "algocore-paper3-"));
  const browser = spawn(browserPath, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--disable-extensions",
    "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--window-size=360,900", "about:blank",
  ], { windowsHide: true, stdio: "ignore" });
  let cdp;
  try {
    let debugPort;
    for (let attempt = 0; attempt < 150; attempt += 1) {
      try {
        const [value] = (await readFile(path.join(profile, "DevToolsActivePort"), "utf8")).trim().split(/\r?\n/);
        if (/^\d+$/.test(value)) { debugPort = Number(value); break; }
      } catch { /* Browser is starting. */ }
      await delay(100);
    }
    if (!debugPort) throw new Error("Paper 3 browser debugging port did not become ready.");

    let target;
    for (let attempt = 0; attempt < 150; attempt += 1) {
      try {
        const response = await fetch(`http://127.0.0.1:${debugPort}/json`);
        if (response.ok) {
          target = (await response.json()).find((item) => item.type === "page");
          if (target?.webSocketDebuggerUrl) break;
        }
      } catch { /* Debug endpoint is starting. */ }
      await delay(100);
    }
    if (!target?.webSocketDebuggerUrl) throw new Error("Paper 3 browser page target did not become ready.");

    cdp = new CDP(target.webSocketDebuggerUrl);
    await cdp.open();
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Network.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 360, height: 900, deviceScaleFactor: 1, mobile: false });
    const [cookieName, ...cookieValueParts] = cookie.split("=");
    await cdp.send("Network.setCookie", { name: cookieName, value: cookieValueParts.join("="), url: baseUrl, httpOnly: true, sameSite: "Lax" });

    async function evaluate(expression) {
      const result = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true, userGesture: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
      return result.result.value;
    }
    async function waitFor(expression, label) {
      for (let attempt = 0; attempt < 200; attempt += 1) {
        try { if (await evaluate(`Boolean(${expression})`)) return; } catch { /* Navigation replaces execution context. */ }
        await delay(50);
      }
      throw new Error(`Timed out waiting for ${label}.`);
    }

    const browserRoutes = routes.filter((route) => route.path.endsWith("lang=en"));
    const failures = [];
    let axeScans = 0;
    for (const route of browserRoutes) {
      await cdp.send("Page.navigate", { url: `${baseUrl}${route.path}` });
      await waitFor(`document.readyState==='complete' && document.querySelector(${JSON.stringify(route.selector)})`, route.path);
      await delay(75);
      const geometry = await evaluate(`({
        width: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        hasMain: Boolean(document.querySelector('main')),
        title: document.title
      })`);
      const axeResult = await evaluate(`(async()=>{
        eval(${JSON.stringify(axe.source)});
        const result=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa']}});
        return result.violations.filter((item)=>item.impact==='critical'||item.impact==='serious').map((item)=>({id:item.id,impact:item.impact,nodes:item.nodes.length}));
      })()`);
      axeScans += 1;
      if (geometry.scrollWidth > geometry.width + 1 || !geometry.hasMain || !geometry.title || axeResult.length > 0) {
        failures.push({ path: route.path, geometry, violations: axeResult });
      }
    }
    if (failures.length) throw new Error(`Paper 3 browser UX/accessibility failures: ${JSON.stringify(failures.slice(0, 10))}`);

    await cdp.send("Page.navigate", { url: `${baseUrl}/paper-3/mocks?lang=en` });
    await waitFor("document.readyState==='complete' && document.querySelector('[data-paper3-mocks] textarea')", "mock interaction workspace");
    await evaluate(`(() => {
      const first=document.querySelector('[data-paper3-mocks] textarea');
      const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;
      setter.call(first,'draft-preservation-check');
      first.dispatchEvent(new Event('input',{bubbles:true}));
      document.querySelectorAll('[role=group] button')[1].click();
    })()`);
    await waitFor("document.querySelectorAll('[role=group] button')[1]?.getAttribute('aria-pressed')==='true'", "Mock B selection");
    await evaluate("document.querySelectorAll('[role=group] button')[0].click()");
    await waitFor("document.querySelectorAll('[role=group] button')[0]?.getAttribute('aria-pressed')==='true'", "Mock A reselection");
    const mockInteraction = await evaluate(`(() => {
      const restored=document.querySelector('[data-paper3-mocks] textarea')?.value;
      const start=[...document.querySelectorAll('[data-paper3-mocks] button')].find((button)=>button.textContent.includes('Start'));
      start?.focus();
      return {draftRestored:restored==='draft-preservation-check',timerKeyboardFocusable:document.activeElement===start};
    })()`);
    if (!mockInteraction.draftRestored || !mockInteraction.timerKeyboardFocusable) {
      throw new Error(`Paper 3 mock browser interaction failed: ${JSON.stringify(mockInteraction)}`);
    }
    return { browserRoutes: browserRoutes.length, axeScans, mockInteractionChecks: 2 };
  } finally {
    cdp?.close();
    browser.kill();
    await delay(500);
    await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(() => {});
  }
}

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
  for (let attempt = 0; attempt < 200; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Production server exited early (${child.exitCode}). ${stderr()}`);
    try {
      const response = await fetch(`${baseUrl}/login?lang=en`, { redirect: "manual" });
      if (response.status === 200) return;
    } catch { /* Server is starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Production server did not become ready. ${stderr()}`);
}

function runNodeScript(script, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], { cwd: root, env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve(stdout) : reject(new Error(`${path.basename(script)} failed (${code}).\n${stdout}\n${stderr}`)));
  });
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
  if (!cookie.startsWith("algocore_student_session=")) throw new Error("Runtime login did not issue the student session cookie.");

  const catalog = await readJson(path.join(root, "content", "paper3", "study-map.json"));
  const routes = [];
  for (const locale of ["en", "vi"]) {
    routes.push({ path: `/paper-3?lang=${locale}`, marker: "data-paper3-map", selector: "[data-paper3-map]" });
    routes.push({ path: `/paper-3/mocks?lang=${locale}`, marker: "data-paper3-mocks", selector: "[data-paper3-mocks]" });
    for (const section of catalog.sections) routes.push({ path: `/paper-3/sections/${section.id}?lang=${locale}`, marker: `data-section-id=\"${section.id}\"`, selector: `[data-section-id=\"${section.id}\"]` });
    for (const topic of catalog.topics) routes.push({ path: `/paper-3/topics/${topic.slug}?lang=${locale}`, marker: `data-paper3-lesson=\"${topic.id}\"`, selector: `[data-paper3-lesson=\"${topic.id}\"]` });
  }

  const failures = [];
  for (const route of routes) {
    const response = await fetch(`${baseUrl}${route.path}`, { headers: { cookie }, redirect: "manual" });
    const html = await response.text();
    if (response.status !== 200 || !html.includes(route.marker)) failures.push({ path: route.path, status: response.status, marker: route.marker });
  }
  if (failures.length) throw new Error(`Paper 3 runtime route failures: ${JSON.stringify(failures.slice(0, 10))}`);

  const browserReport = await checkPaper3InBrowser(baseUrl, cookie, routes);

  const authOutput = await runNodeScript(path.join(root, "scripts", "check-student-auth.mjs"), env);
  const authReportStart = authOutput.indexOf("{\n");
  const authReport = JSON.parse(authOutput.slice(authReportStart));
  if (authReport.decision !== "PASS") throw new Error("Student-auth browser and accessibility suite did not pass.");

  console.log(JSON.stringify({
    check: "paper3-runtime-release",
    passed: true,
    authenticatedRoutes: routes.length,
    lessonRoutes: catalog.topics.length * 2,
    sectionRoutes: catalog.sections.length * 2,
    paper3BrowserRoutes: browserReport.browserRoutes,
    paper3AxeScans: browserReport.axeScans,
    paper3InteractionChecks: browserReport.mockInteractionChecks,
    authAccessibilityChecks: authReport.checks,
    authAccessibilityPassed: authReport.passed,
  }, null, 2));
} finally {
  if (server.exitCode === null) server.kill();
}
