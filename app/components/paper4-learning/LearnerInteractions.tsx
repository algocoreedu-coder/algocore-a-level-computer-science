"use client";

import { useEffect, useRef, useState } from "react";

import type { LearnerProjection } from "./learnerProjection";
import { learnerText } from "./learnerProjection";
import type { LearningLocale } from "./types";
import styles from "./LessonLearningPage.module.css";

const copy = {
  en: {
    answer: "Your answer or trace",
    placeholder: "Write your answer before revealing support…",
    record: "Record attempt",
    recorded: "Attempt recorded. You can now check the support.",
    hint: "Hint",
    model: "Model answer",
    check: "Success check",
    previous: "Previous practice",
    next: "Next practice",
    item: "Practice item",
    of: "of",
    recall: "Your recalled answer",
    checkRecall: "Record and check",
    retry: "Try again",
    copied: "Code copied.",
    copyFailed: "Copy failed; select the code manually.",
    copyCode: "Copy code",
  },
  vi: {
    answer: "Câu trả lời hoặc trace của bạn",
    placeholder: "Viết câu trả lời trước khi mở hỗ trợ…",
    record: "Ghi nhận lần làm",
    recorded: "Đã ghi nhận. Bây giờ bạn có thể kiểm tra phần hỗ trợ.",
    hint: "Gợi ý",
    model: "Đáp án mẫu",
    check: "Điểm tự kiểm",
    previous: "Bài luyện trước",
    next: "Bài luyện tiếp",
    item: "Bài luyện",
    of: "trên",
    recall: "Câu trả lời nhớ lại của bạn",
    checkRecall: "Ghi nhận và tự kiểm",
    retry: "Thử lại",
    copied: "Đã sao chép code.",
    copyFailed: "Không thể sao chép; hãy chọn code thủ công.",
    copyCode: "Sao chép code",
  },
} as const;

type PracticeStage = LearnerProjection["stages"]["practise"];
type RecallStage = LearnerProjection["stages"]["recallAndContinue"];
type ProtectMarksStage = LearnerProjection["stages"]["protectMarks"];
export const PRACTICE_PROGRESS_KEY = "algocore.paper4.learner.binary-search.practice.v1";
export const RECALL_PROGRESS_KEY = "algocore.paper4.learner.binary-search.recall.v1";
export function practiceProgressKey(lessonSlug: string) { return `algocore.paper4.learner.${lessonSlug}.practice.v1`; }
export function recallProgressKey(lessonSlug: string) { return `algocore.paper4.learner.${lessonSlug}.recall.v1`; }

export function LearnerPractice({ stage, locale, progressKey, onAttemptChange }: { readonly stage: PracticeStage; readonly locale: LearningLocale; readonly progressKey: string; readonly onAttemptChange?: (hasAttempt: boolean) => void }) {
  const t = copy[locale];
  const [index, setIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [attempted, setAttempted] = useState<ReadonlySet<number>>(new Set());
  const [progressRestored, setProgressRestored] = useState(false);
  const item = stage.items[index];
  const draft = drafts[index] ?? "";
  const hasAttempt = attempted.has(index);

  useEffect(() => {
    try {
      const value = JSON.parse(window.sessionStorage.getItem(progressKey) ?? "null") as unknown;
      if (!value || typeof value !== "object") { setProgressRestored(true); return; }
      const stored = value as { index?: unknown; drafts?: unknown; attempted?: unknown };
      if (typeof stored.index === "number" && Number.isInteger(stored.index) && stored.index >= 0 && stored.index < stage.items.length) setIndex(stored.index);
      if (stored.drafts && typeof stored.drafts === "object" && !Array.isArray(stored.drafts)) {
        const clean = Object.fromEntries(Object.entries(stored.drafts).filter(([key, entry]) => /^\d+$/.test(key) && typeof entry === "string" && Number(key) < stage.items.length));
        setDrafts(clean);
      }
      if (Array.isArray(stored.attempted)) setAttempted(new Set(stored.attempted.filter((entry): entry is number => typeof entry === "number" && Number.isInteger(entry) && entry >= 0 && entry < stage.items.length)));
    } catch { /* Ignore malformed or unavailable session storage. */ }
    setProgressRestored(true);
  }, [progressKey, stage.items.length]);

  useEffect(() => {
    if (!progressRestored) return;
    try { window.sessionStorage.setItem(progressKey, JSON.stringify({ index, drafts, attempted: [...attempted] })); }
    catch { /* Storage can be unavailable. */ }
  }, [attempted, drafts, index, progressKey, progressRestored]);

  useEffect(() => { onAttemptChange?.(attempted.size > 0); }, [attempted, onAttemptChange]);

  if (!item) return null;
  const persistPractice = (nextIndex: number, nextDrafts: Record<number, string>, nextAttempted: ReadonlySet<number>) => {
    try { window.sessionStorage.setItem(progressKey, JSON.stringify({ index: nextIndex, drafts: nextDrafts, attempted: [...nextAttempted] })); }
    catch { /* Storage can be unavailable. */ }
  };
  const record = () => {
    if (!draft.trim()) return;
    const nextAttempted = new Set([...attempted, index]);
    setAttempted(nextAttempted);
    try { window.sessionStorage.setItem(progressKey, JSON.stringify({ index, drafts, attempted: [...nextAttempted] })); }
    catch { /* Storage can be unavailable. */ }
  };

  return <div className={styles.practiceJourney} data-practice-gate="attempt-before-reveal">
    <p>{learnerText(stage.attempt_rule, locale)}</p>
    <article className={styles.learnerCard}>
      <header className={styles.cardHeader}>
        <div><span>{learnerText(item.level, locale)}</span><h3>{learnerText(item.title, locale)}</h3></div>
        <strong>{t.item} {index + 1} {t.of} {stage.items.length}</strong>
      </header>
      <p>{learnerText(item.prompt, locale)}</p>
      <label className={styles.responseField}>
        <span>{t.answer}</span>
        <textarea value={draft} onChange={(event) => { const nextDrafts = { ...drafts, [index]: event.target.value }; persistPractice(index, nextDrafts, attempted); setDrafts(nextDrafts); }} placeholder={t.placeholder} rows={5} />
      </label>
      <button className={styles.learningButton} type="button" disabled={!draft.trim()} onClick={record}>{t.record}</button>
      <p className={styles.statusText} aria-live="polite">{hasAttempt ? t.recorded : ""}</p>
      {hasAttempt && <div className={styles.afterAttempt} data-answer-revealed="true">
        <details><summary>{t.hint}</summary><p>{learnerText(item.hint, locale)}</p></details>
        <details><summary>{t.model}</summary><p>{learnerText(item.model_answer, locale)}</p></details>
        <p><strong>{t.check}: </strong>{learnerText(item.success_check, locale)}</p>
      </div>}
    </article>
    <nav className={styles.itemNav} aria-label={stage.name[locale]}>
      <button type="button" disabled={index === 0} onClick={() => { const nextIndex = Math.max(0, index - 1); persistPractice(nextIndex, drafts, attempted); setIndex(nextIndex); }}>← {t.previous}</button>
      <button type="button" disabled={index >= stage.items.length - 1 || !hasAttempt} onClick={() => { const nextIndex = Math.min(stage.items.length - 1, index + 1); persistPractice(nextIndex, drafts, attempted); setIndex(nextIndex); }}>{t.next} →</button>
    </nav>
  </div>;
}

export function LearnerRecall({ stage, locale, progressKey }: { readonly stage: RecallStage; readonly locale: LearningLocale; readonly progressKey: string }) {
  const t = copy[locale];
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [index, setIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<ReadonlySet<number>>(new Set());
  const [progressRestored, setProgressRestored] = useState(false);
  const item = stage.recall_items[index];
  const draft = drafts[index] ?? "";
  const hasSubmitted = submitted.has(index);

  useEffect(() => {
    try {
      const value = JSON.parse(window.sessionStorage.getItem(progressKey) ?? "null") as unknown;
      if (!value || typeof value !== "object") { setProgressRestored(true); return; }
      const stored = value as { index?: unknown; drafts?: unknown; submitted?: unknown };
      if (typeof stored.index === "number" && Number.isInteger(stored.index) && stored.index >= 0 && stored.index < stage.recall_items.length) setIndex(stored.index);
      if (stored.drafts && typeof stored.drafts === "object" && !Array.isArray(stored.drafts)) setDrafts(Object.fromEntries(Object.entries(stored.drafts).filter(([key, entry]) => /^\d+$/.test(key) && typeof entry === "string" && Number(key) < stage.recall_items.length)));
      if (Array.isArray(stored.submitted)) setSubmitted(new Set(stored.submitted.filter((entry): entry is number => typeof entry === "number" && Number.isInteger(entry) && entry >= 0 && entry < stage.recall_items.length)));
    } catch { /* Ignore malformed or unavailable session storage. */ }
    setProgressRestored(true);
  }, [progressKey, stage.recall_items.length]);

  useEffect(() => {
    if (!progressRestored) return;
    try { window.sessionStorage.setItem(progressKey, JSON.stringify({ index, drafts, submitted: [...submitted] })); }
    catch { /* Storage can be unavailable. */ }
  }, [drafts, index, progressKey, progressRestored, submitted]);

  if (!item) return null;
  const persistRecall = (nextIndex: number, nextDrafts: Record<number, string>, nextSubmitted: ReadonlySet<number>) => {
    try { window.sessionStorage.setItem(progressKey, JSON.stringify({ index: nextIndex, drafts: nextDrafts, submitted: [...nextSubmitted] })); }
    catch { /* Storage can be unavailable. */ }
  };
  return <div className={styles.practiceJourney} data-recall-gate="attempt-before-reveal">
    <article className={styles.learnerCard}>
      <header className={styles.cardHeader}><h3>{learnerText(item.prompt, locale)}</h3><strong>{index + 1} {t.of} {stage.recall_items.length}</strong></header>
      <label className={styles.responseField}><span>{t.recall}</span><textarea ref={inputRef} value={draft} onChange={(event) => { const nextDrafts = { ...drafts, [index]: event.target.value }; const nextSubmitted = new Set([...submitted].filter((value) => value !== index)); persistRecall(index, nextDrafts, nextSubmitted); setDrafts(nextDrafts); setSubmitted(nextSubmitted); }} rows={3} /></label>
      <button className={styles.learningButton} type="button" disabled={!draft.trim()} onClick={() => { const nextSubmitted = new Set([...submitted, index]); setSubmitted(nextSubmitted); try { window.sessionStorage.setItem(progressKey, JSON.stringify({ index, drafts, submitted: [...nextSubmitted] })); } catch { /* Storage can be unavailable. */ } }}>{t.checkRecall}</button>
      {hasSubmitted && <div className={styles.afterAttempt} data-answer-revealed="true"><p>{learnerText(item.answer, locale)}</p><button type="button" className={styles.secondaryButton} onClick={() => { setDrafts((current) => ({ ...current, [index]: "" })); setSubmitted((current) => new Set([...current].filter((value) => value !== index))); requestAnimationFrame(() => inputRef.current?.focus()); }}>{t.retry}</button></div>}
    </article>
    <nav className={styles.itemNav} aria-label={stage.name[locale]}><button type="button" disabled={index === 0} onClick={() => { const nextIndex = Math.max(0, index - 1); persistRecall(nextIndex, drafts, submitted); setIndex(nextIndex); }}>← {t.previous}</button><button type="button" disabled={!hasSubmitted || index >= stage.recall_items.length - 1} onClick={() => { const nextIndex = Math.min(stage.recall_items.length - 1, index + 1); persistRecall(nextIndex, drafts, submitted); setIndex(nextIndex); }}>{t.next} →</button></nav>
  </div>;
}

export function LearnerRiskChecks({ stage, locale, progressKey }: { readonly stage: ProtectMarksStage; readonly locale: LearningLocale; readonly progressKey?: string }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!progressKey) return;
    try {
      const value = JSON.parse(window.sessionStorage.getItem(progressKey) ?? "null") as { index?: unknown } | null;
      if (value && typeof value.index === "number" && Number.isInteger(value.index) && value.index >= 0 && value.index < stage.mistakes.length) setIndex(value.index);
    } catch { /* Ignore malformed or unavailable session storage. */ }
  }, [progressKey, stage.mistakes.length]);
  const item = stage.mistakes[index];
  const labels = locale === "vi"
    ? { risk: "Điểm cần tránh", mistake: "Lỗi", consequence: "Vì sao mất điểm", repair: "Cách làm đúng", next: "Điểm tiếp theo", restart: "Xem lại từ đầu", of: "trên" }
    : { risk: "Risk check", mistake: "Mistake", consequence: "Why it loses marks", repair: "What to do", next: "Next risk", restart: "Review again", of: "of" };
  if (!item) return null;
  const last = index === stage.mistakes.length - 1;
  return <div className={styles.riskJourney} data-protect-marks-mode="progressive" data-risk-index={index} data-risk-count={stage.mistakes.length}>
    <div className={styles.riskProgress} aria-hidden="true">
      {stage.mistakes.map((_, itemIndex) => <span data-active={itemIndex === index || undefined} key={itemIndex} />)}
    </div>
    <article className={styles.mistakeCard}>
      <header className={styles.cardHeader}>
        <span>{labels.risk} {index + 1} {labels.of} {stage.mistakes.length}</span>
      </header>
      {item.applies_when && <p className={styles.condition}>{learnerText(item.applies_when, locale)}</p>}
      <dl>
        <div><dt>{labels.mistake}</dt><dd>{learnerText(item.mistake, locale)}</dd></div>
        <div><dt>{labels.consequence}</dt><dd>{learnerText(item.consequence, locale)}</dd></div>
        <div><dt>{labels.repair}</dt><dd>{learnerText(item.repair, locale)}</dd></div>
      </dl>
    </article>
    <button className={styles.learningButton} type="button" data-action="next-risk" onClick={() => { const nextIndex = last ? 0 : index + 1; if (progressKey) { try { window.sessionStorage.setItem(progressKey, JSON.stringify({ index: nextIndex })); } catch { /* Storage can be unavailable. */ } } setIndex(nextIndex); }}>{last ? labels.restart : labels.next} →</button>
    <p className={styles.srOnly} aria-live="polite">{labels.risk} {index + 1} {labels.of} {stage.mistakes.length}</p>
  </div>;
}

export function LearnerCodeCard({ caption, lines, locale, activeLineIndex }: { readonly caption: string; readonly lines: readonly string[]; readonly locale: LearningLocale; readonly activeLineIndex?: number }) {
  const t = copy[locale];
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const source = lines.join("\n");
  const copyCode = async () => {
    try { await navigator.clipboard.writeText(source); setStatus("copied"); }
    catch { setStatus("failed"); }
  };
  return <figure className={styles.codeFigure} data-learner-code-card>
    <figcaption><span>{caption}</span><button type="button" className={styles.copyButton} onClick={copyCode}>{t.copyCode}</button></figcaption>
    <pre tabIndex={0} data-learner-code="recipe"><code>{lines.map((line, index) => <span data-learner-code-line data-active={activeLineIndex === index || undefined} aria-current={activeLineIndex === index ? "step" : undefined} key={index}>{line}{index < lines.length - 1 ? "\n" : ""}</span>)}</code></pre>
    <p className={styles.srOnly} aria-live="polite">{status === "copied" ? t.copied : status === "failed" ? t.copyFailed : ""}</p>
  </figure>;
}
