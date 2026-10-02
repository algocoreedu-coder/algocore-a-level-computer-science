"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, FileCheck2, Pause, Play, RotateCcw } from "lucide-react";
import type { Locale } from "@/app/lib/paper3/catalog";
import type { MockPaper } from "@/app/lib/paper3/mock-types";
import { paper3Href } from "./shared";
import { Paper3LocaleBoundary } from "./Paper3LocaleBoundary";
import styles from "./MockPaperWorkspace.module.css";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
}

export function MockPaperWorkspace({ papers, locale }: { readonly papers: readonly MockPaper[]; readonly locale: Locale }) {
  const [selectedId, setSelectedId] = useState(papers[0]?.id ?? "");
  const paper = useMemo(() => papers.find((item) => item.id === selectedId) ?? papers[0], [papers, selectedId]);
  const [remaining, setRemaining] = useState(paper.durationMinutes * 60);
  const [running, setRunning] = useState(false);
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    setRemaining(paper.durationMinutes * 60);
    setRunning(false);
    setDeadlineMs(null);
  }, [paper.id, paper.durationMinutes]);

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

  return <div className={styles.page} lang={locale} data-paper3-mocks>
    <Paper3LocaleBoundary locale={locale} />
    <Link className={styles.back} href={paper3Href("/paper-3", locale)}><ArrowLeft size={17} aria-hidden="true" />{locale === "vi" ? "Về bản đồ học" : "Back to study map"}</Link>
    <header className={styles.hero}>
      <span>PAPER 3 · 2026 · ALGOCORE</span>
      <h1>{locale === "vi" ? "Đề luyện đủ 90 phút" : "Full 90-minute mock papers"}</h1>
      <p>{locale === "vi" ? "Hai đề tự biên soạn phủ Sections 13–20. Làm bài trong thời gian thật, sau đó mở marking points để tự chấm." : "Two original papers covering Sections 13–20. Work under timed conditions, then reveal the marking points to self-mark."}</p>
    </header>

    <div className={styles.paperTabs} role="group" aria-label={locale === "vi" ? "Chọn đề luyện" : "Choose a mock paper"}>
      {papers.map((item) => <button key={item.id} type="button" aria-pressed={item.id === paper.id} onClick={() => setSelectedId(item.id)}>
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
      <button type="button" onClick={() => { setRemaining(paper.durationMinutes * 60); setRunning(false); setDeadlineMs(null); }}><RotateCcw size={17} aria-hidden="true" />{locale === "vi" ? "Đặt lại" : "Reset"}</button>
    </section>

    <ol className={styles.questions}>
      {paper.questions.map((question) => <li key={question.id} className={styles.question}>
        <header><div><span>{question.number}</span><p>SECTION {question.sectionIds.join(", ")} · {question.commandWords.map((word) => word.toUpperCase()).join(" · ")} · {question.ao}</p></div><strong>[{question.marks}]</strong></header>
        {question.scenario ? <p className={styles.scenario}>{question.scenario[locale]}</p> : null}
        <p className={styles.prompt}>{question.prompt[locale]}</p>
        {question.data ? <pre className={styles.data} tabIndex={0} aria-label={locale === "vi" ? `Dữ liệu câu ${question.number}` : `Question ${question.number} data`}>{JSON.stringify(question.data, null, 2)}</pre> : null}
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
