"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, FileCheck2, Pause, Play, RotateCcw, Save } from "lucide-react";
import type { Locale } from "@/app/lib/paper3/catalog";
import type { MockPaper } from "@/app/lib/paper3/mock-types";
import { paper3Href } from "./shared";
import { Paper3LocaleBoundary } from "./Paper3LocaleBoundary";
import styles from "./MockPaperWorkspace.module.css";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
}

const STORAGE_KEY = "algocore.paper3.mock-workspace.v1";
type JsonRecord = Record<string, unknown>;
type TimerSnapshot = { readonly remaining: number; readonly running: boolean; readonly deadlineMs: number | null };
const isRecord = (value: unknown): value is JsonRecord => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const restoreTimer = (value: unknown, maxSeconds: number): TimerSnapshot => {
  if (!isRecord(value)) return { remaining: maxSeconds, running: false, deadlineMs: null };
  const deadlineMs = typeof value.deadlineMs === "number" ? value.deadlineMs : null;
  const savedRemaining = typeof value.remaining === "number" ? Math.max(0, Math.min(maxSeconds, Math.round(value.remaining))) : maxSeconds;
  if (value.running === true && deadlineMs !== null) {
    const remaining = Math.max(0, Math.ceil((deadlineMs - Date.now()) / 1000));
    return { remaining, running: remaining > 0, deadlineMs: remaining > 0 ? deadlineMs : null };
  }
  return { remaining: savedRemaining, running: false, deadlineMs: null };
};
const displayValue = (value: unknown): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(displayValue).join(", ");
  if (isRecord(value)) return Object.entries(value).map(([key, entry]) => `${key}: ${displayValue(entry)}`).join(" · ");
  return String(value);
};

function RawDataDisclosure({ data, locale }: { readonly data: unknown; readonly locale: Locale }) {
  return <details className={styles.rawData}><summary>{locale === "vi" ? "Xem dữ liệu kỹ thuật gốc" : "View raw technical data"}</summary><pre tabIndex={0}>{JSON.stringify(data, null, 2)}</pre></details>;
}

function QuestionData({ data, locale, number }: { readonly data: unknown; readonly locale: Locale; readonly number: string }) {
  const label = locale === "vi" ? `Dữ liệu câu ${number}` : `Question ${number} data`;
  if (!isRecord(data)) return <section className={styles.structuredData} aria-label={label}><p>{displayValue(data)}</p><RawDataDisclosure data={data} locale={locale} /></section>;

  if (typeof data.mantissa === "string" && typeof data.exponent === "string") return <section className={styles.structuredData} aria-label={label}><div className={styles.dataHeading}><span>{locale === "vi" ? "SỐ THỰC DẤU PHẨY ĐỘNG" : "FLOATING-POINT VALUE"}</span><strong>{locale === "vi" ? "Tách mantissa và exponent trước khi tính" : "Separate mantissa and exponent before calculating"}</strong></div><div className={styles.bitFields}><div><span>Mantissa</span><code>{data.mantissa}</code></div><div><span>Exponent</span><code>{data.exponent}</code></div></div><RawDataDisclosure data={data} locale={locale} /></section>;

  if (Array.isArray(data.columns) && Array.isArray(data.rows)) return <section className={styles.structuredData} aria-label={label}><div className={styles.dataHeading}><span>{locale === "vi" ? "BẢNG CHÂN TRỊ" : "TRUTH TABLE"}</span><strong>{locale === "vi" ? "Hoàn thành cột kết quả X" : "Complete the result column X"}</strong></div><div className={styles.tableRegion} tabIndex={0} role="region" aria-label={label}><table><caption>{locale === "vi" ? "Mỗi hàng là một tổ hợp đầu vào" : "Each row is one input combination"}</caption><thead><tr>{data.columns.map((column, index) => <th scope="col" key={`${displayValue(column)}-${index}`}>{displayValue(column)}</th>)}</tr></thead><tbody>{data.rows.map((row, rowIndex) => <tr key={rowIndex}>{(Array.isArray(row) ? row : [row]).map((cell, cellIndex) => <td key={cellIndex} data-missing={cell === null || cell === undefined}>{cell === null || cell === undefined ? "?" : displayValue(cell)}</td>)}</tr>)}</tbody></table></div><RawDataDisclosure data={data} locale={locale} /></section>;

  if (Array.isArray(data.undirectedEdges)) {
    const edges = data.undirectedEdges.filter(Array.isArray);
    const nodes = [...new Set(edges.flatMap(edge => [displayValue(edge[0]), displayValue(edge[1])]))];
    return <section className={styles.structuredData} aria-label={label}><div className={styles.dataHeading}><span>{locale === "vi" ? "ĐỒ THỊ VÔ HƯỚNG" : "UNDIRECTED GRAPH"}</span><strong>{locale === "vi" ? "Mỗi cạnh dùng được theo cả hai hướng" : "Each edge can be followed in either direction"}</strong></div><div className={styles.nodeRail} aria-label={locale === "vi" ? "Các node" : "Graph nodes"}>{nodes.map(node => <span key={node}>{node}</span>)}</div><div className={styles.tableRegion} tabIndex={0} role="region" aria-label={label}><table><caption>{locale === "vi" ? "Danh sách cạnh và trọng số" : "Edge list and weights"}</caption><thead><tr><th scope="col">{locale === "vi" ? "Từ" : "From"}</th><th scope="col">{locale === "vi" ? "Đến" : "To"}</th><th scope="col">{locale === "vi" ? "Trọng số" : "Weight"}</th></tr></thead><tbody>{edges.map((edge, index) => <tr key={index}><td>{displayValue(edge[0])}</td><td>{displayValue(edge[1])}</td><td>{displayValue(edge[2])}</td></tr>)}</tbody></table></div><RawDataDisclosure data={data} locale={locale} /></section>;
  }

  if (Array.isArray(data.slots) && Array.isArray(data.initial)) {
    const slots = data.slots as unknown[];
    const initial = data.initial as unknown[];
    return <section className={styles.structuredData} aria-label={label}><div className={styles.dataHeading}><span>{locale === "vi" ? "HASH TABLE" : "HASH TABLE"}</span><strong>{displayValue(data.hash)} · {displayValue(data.collision)}</strong></div><div className={styles.hashSlots}>{slots.map((slot, index) => <div key={index}><span>{locale === "vi" ? "Ô" : "Slot"} {displayValue(slot)}</span><strong>{initial[index] === null || initial[index] === undefined ? "∅" : displayValue(initial[index])}</strong></div>)}</div><RawDataDisclosure data={data} locale={locale} /></section>;
  }

  if (isRecord(data.frontier)) {
    const candidates = Object.entries(data.frontier).map(([node, value]) => ({ node, values: isRecord(value) ? value : {} }));
    const edge = isRecord(data.edgeToGoal) ? data.edgeToGoal : {};
    return <section className={styles.structuredData} aria-label={label}><div className={styles.dataHeading}><span>{locale === "vi" ? "A* FRONTIER" : "A* FRONTIER"}</span><strong>{locale === "vi" ? "Tính f = g + h rồi chọn f nhỏ nhất" : "Calculate f = g + h, then choose the smallest f"}</strong></div><div className={styles.tableRegion} tabIndex={0} role="region" aria-label={label}><table><caption>{locale === "vi" ? "Các node đang chờ xét" : "Candidate nodes awaiting expansion"}</caption><thead><tr><th scope="col">Node</th><th scope="col">g</th><th scope="col">h</th><th scope="col">f = g + h</th></tr></thead><tbody>{candidates.map(({ node, values }) => { const g = Number(values.g); const h = Number(values.h); return <tr key={node}><th scope="row">{node}</th><td>{displayValue(values.g)}</td><td>{displayValue(values.h)}</td><td><strong>{Number.isFinite(g + h) ? g + h : "?"}</strong></td></tr>; })}</tbody></table></div>{Object.keys(edge).length ? <p className={styles.edgeNote}><strong>{locale === "vi" ? "Cạnh tiếp theo được cung cấp:" : "Supplied next edge:"}</strong> {displayValue(edge.from)} → {displayValue(edge.to)} · {locale === "vi" ? "chi phí" : "cost"} {displayValue(edge.cost)}</p> : null}<RawDataDisclosure data={data} locale={locale} /></section>;
  }

  return <section className={styles.structuredData} aria-label={label}><div className={styles.dataHeading}><span>{locale === "vi" ? "DỮ LIỆU CÓ CẤU TRÚC" : "STRUCTURED DATA"}</span><strong>{locale === "vi" ? "Đọc từng trường trước khi trả lời" : "Read each field before answering"}</strong></div><dl className={styles.genericData}>{Object.entries(data).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{displayValue(value)}</dd></div>)}</dl><RawDataDisclosure data={data} locale={locale} /></section>;
}

export function MockPaperWorkspace({ papers, locale }: { readonly papers: readonly MockPaper[]; readonly locale: Locale }) {
  const [selectedId, setSelectedId] = useState(papers[0]?.id ?? "");
  const paper = useMemo(() => papers.find((item) => item.id === selectedId) ?? papers[0], [papers, selectedId]);
  const [remaining, setRemaining] = useState(paper.durationMinutes * 60);
  const [running, setRunning] = useState(false);
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [storageReady, setStorageReady] = useState(false);
  const timersByPaper = useRef<Record<string, TimerSnapshot>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as JsonRecord;
        const savedId = typeof saved.selectedId === "string" && papers.some((item) => item.id === saved.selectedId) ? saved.selectedId : papers[0]?.id;
        const savedPaper = papers.find((item) => item.id === savedId) ?? papers[0];
        const savedTimers = isRecord(saved.timers) ? saved.timers : { [savedPaper.id]: saved };
        const restoredTimers = Object.fromEntries(papers.map((item) => [item.id, restoreTimer(savedTimers[item.id], item.durationMinutes * 60)]));
        const selectedTimer = restoredTimers[savedPaper.id];
        timersByPaper.current = restoredTimers;
        setSelectedId(savedPaper.id);
        setRemaining(selectedTimer.remaining);
        setRunning(selectedTimer.running);
        setDeadlineMs(selectedTimer.deadlineMs);
        if (isRecord(saved.answers)) setAnswers(Object.fromEntries(Object.entries(saved.answers).filter((entry): entry is [string,string] => typeof entry[1] === "string")));
      }
    } catch {
      try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* Continue with in-memory answers when storage is blocked. */ }
    } finally {
      setStorageReady(true);
    }
  }, [papers]);

  useEffect(() => {
    if (!storageReady) return;
    try {
      const timers = { ...timersByPaper.current, [paper.id]: { remaining, running, deadlineMs } };
      timersByPaper.current = timers;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, selectedId: paper.id, answers, timers }));
    } catch {
      // Timed practice remains usable in-memory when private browsing blocks storage.
    }
  }, [answers, deadlineMs, paper.id, remaining, running, storageReady]);

  useEffect(() => {
    if (!running || deadlineMs === null) return;
    const updateFromClock = () => {
      const next = Math.max(0, Math.ceil((deadlineMs - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) {
        setRunning(false);
        setDeadlineMs(null);
      }
    };
    updateFromClock();
    const timer = window.setInterval(updateFromClock, 250);
    return () => window.clearInterval(timer);
  }, [deadlineMs, running]);

  const toggleTimer = () => {
    if (running) {
      setRemaining(deadlineMs === null ? remaining : Math.max(0, Math.ceil((deadlineMs - Date.now()) / 1000)));
      setDeadlineMs(null);
      setRunning(false);
      return;
    }
    setDeadlineMs(Date.now() + remaining * 1000);
    setRunning(true);
  };

  const selectPaper = (nextId: string) => {
    if (nextId === paper.id) return;
    const nextPaper = papers.find((item) => item.id === nextId);
    if (!nextPaper) return;
    timersByPaper.current = { ...timersByPaper.current, [paper.id]: { remaining, running, deadlineMs } };
    const nextTimer = restoreTimer(timersByPaper.current[nextId], nextPaper.durationMinutes * 60);
    setSelectedId(nextId);
    setRemaining(nextTimer.remaining);
    setRunning(nextTimer.running);
    setDeadlineMs(nextTimer.deadlineMs);
  };

  return <div className={styles.page} lang={locale} data-paper3-mocks>
    <Paper3LocaleBoundary locale={locale} />
    <Link className={styles.back} href={paper3Href("/paper-3", locale)}><ArrowLeft size={17} aria-hidden="true" />{locale === "vi" ? "Về bản đồ học" : "Back to study map"}</Link>
    <header className={styles.hero}>
      <span>PAPER 3 · 2026 · ALGOCORE</span>
      <h1>{locale === "vi" ? "Đề luyện đủ 90 phút" : "Full 90-minute mock papers"}</h1>
      <p>{locale === "vi" ? "Hai đề tự biên soạn phủ Sections 13–20. Làm bài trong thời gian thật, sau đó mở marking points để tự chấm." : "Two original papers covering Sections 13–20. Work under timed conditions, then reveal the marking points to self-mark."}</p>
      <small className={styles.savedNote}><Save size={15} aria-hidden="true" />{locale === "vi" ? "Bài làm và đồng hồ được lưu trên thiết bị này." : "Answers and timer are saved on this device."}</small>
    </header>

    <div className={styles.paperTabs} role="group" aria-label={locale === "vi" ? "Chọn đề luyện" : "Choose a mock paper"}>
      {papers.map((item) => <button key={item.id} type="button" aria-pressed={item.id === paper.id} onClick={() => selectPaper(item.id)}>
        <strong>{item.id.endsWith("A") ? "Mock A" : "Mock B"}</strong><span>{item.emphasis[locale]}</span>
      </button>)}
    </div>

    <section className={styles.paperHeader} aria-labelledby="mock-paper-title">
      <div><span>{paper.id}</span><h2 id="mock-paper-title">{paper.title[locale]}</h2><p>{paper.instructions[locale]}</p></div>
      <dl><div><dt><Clock3 size={16} aria-hidden="true" />{locale === "vi" ? "Thời gian" : "Time"}</dt><dd>{paper.durationMinutes} {locale === "vi" ? "phút" : "minutes"}</dd></div><div><dt><FileCheck2 size={16} aria-hidden="true" />{locale === "vi" ? "Tổng điểm" : "Total"}</dt><dd>{paper.totalMarks} {locale === "vi" ? "điểm" : "marks"}</dd></div><div><dt>AO1</dt><dd>{paper.aoTargets.AO1}</dd></div><div><dt>AO2</dt><dd>{paper.aoTargets.AO2}</dd></div></dl>
      <p className={styles.notice}>{paper.authorship.notice[locale]}</p>
    </section>

    <section className={styles.timer} aria-label={locale === "vi" ? "Đồng hồ làm bài" : "Mock-paper timer"}>
      <div><span>{locale === "vi" ? "THỜI GIAN CÒN LẠI" : "TIME REMAINING"}</span><strong role="timer" aria-live="off">{formatTime(remaining)}</strong></div>
      <button type="button" onClick={toggleTimer} disabled={remaining === 0}>{running ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}{running ? (locale === "vi" ? "Tạm dừng" : "Pause") : (locale === "vi" ? "Bắt đầu" : "Start")}</button>
      <button type="button" onClick={() => { setRemaining(paper.durationMinutes * 60); setRunning(false); setDeadlineMs(null); }}><RotateCcw size={17} aria-hidden="true" />{locale === "vi" ? "Đặt lại giờ" : "Reset timer"}</button>
    </section>

    <ol className={styles.questions}>
      {paper.questions.map((question) => <li key={question.id} className={styles.question}>
        <header><div><span>{question.number}</span><p>SECTION {question.sectionIds.join(", ")} · {question.commandWords.map((word) => word.toUpperCase()).join(" · ")} · {question.ao}</p></div><strong>[{question.marks}]</strong></header>
        {question.scenario ? <p className={styles.scenario}>{question.scenario[locale]}</p> : null}
        <p className={styles.prompt}>{question.prompt[locale]}</p>
        {question.data ? <QuestionData data={question.data} locale={locale} number={question.number} /> : null}
        <label htmlFor={`${paper.id}-${question.id}`}>{locale === "vi" ? "Bài làm" : "Your answer"}</label>
        <textarea
          id={`${paper.id}-${question.id}`}
          rows={Math.max(4, Math.min(10, question.marks + 2))}
          value={answers[`${paper.id}:${question.id}`] ?? ""}
          onChange={(event) => setAnswers((current) => ({ ...current, [`${paper.id}:${question.id}`]: event.target.value }))}
        />
        <details className={styles.markScheme}>
          <summary>{locale === "vi" ? `Mở đáp án và marking points (${question.marks})` : `Reveal solution and marking points (${question.marks})`}</summary>
          <div><p><strong>{locale === "vi" ? "Lời giải: " : "Worked solution: "}</strong>{question.workedSolution[locale]}</p><ol>{question.markingPoints.map((point) => <li key={point.id}>{point[locale]} <span>[{point.mark}]</span></li>)}</ol></div>
        </details>
      </li>)}
    </ol>
  </div>;
}
