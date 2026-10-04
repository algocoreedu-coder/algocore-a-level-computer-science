"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { Locale } from "@/app/lib/paper3/catalog";
import type { ExamPractice as ExamPracticeData } from "@/app/lib/paper3/lesson-types";
import styles from "./LessonPage.module.css";

export function ExamPractice({ practice, locale }: { readonly practice: ExamPracticeData; readonly locale: Locale }) {
  const answerId = useId();
  const [draft, setDraft] = useState("");
  const [supportingDraft, setSupportingDraft] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [awardedPoints, setAwardedPoints] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const storageKey = useMemo(() => `algocore:paper3:exam-practice:${practice.id}`, [practice.id]);
  const taskLabel = {
    "constructed-response": { en: "Written response", vi: "Câu trả lời tự viết" },
    calculation: { en: "Calculation", vi: "Bài tính" },
    trace: { en: "Trace", vi: "Bài trace" },
    diagram: { en: "Diagram", vi: "Bài sơ đồ" },
    pseudocode: { en: "Pseudocode", vi: "Bài pseudocode" },
  }[practice.taskType][locale];

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const value = JSON.parse(saved) as { draft?: string; supportingDraft?: string; revealed?: boolean; awardedPoints?: number[] };
        setDraft(value.draft ?? "");
        setSupportingDraft(value.supportingDraft ?? "");
        setRevealed(Boolean(value.revealed));
        setAwardedPoints(Array.isArray(value.awardedPoints) ? value.awardedPoints.filter(Number.isInteger) : []);
      }
    } catch {
      // A blocked or malformed local store must not stop the learner from answering.
    } finally {
      setHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ draft, supportingDraft, revealed, awardedPoints }));
    } catch {
      // The editor continues to work in-memory when storage is unavailable.
    }
  }, [awardedPoints, draft, hydrated, revealed, storageKey, supportingDraft]);

  const responseReady = draft.trim().length >= 3 || supportingDraft.trim().length >= 3;
  const score = Math.min(awardedPoints.length, practice.marks);
  const responseLabel = {
    "constructed-response": { en: "Write your answer before revealing the marking points", vi: "Viết câu trả lời trước khi xem marking points" },
    calculation: { en: "Show every step of your working", vi: "Trình bày đầy đủ từng bước tính" },
    trace: { en: "Record each step, state change and output", vi: "Ghi lại từng bước, trạng thái và kết quả" },
    diagram: { en: "Plan the labelled elements in your diagram", vi: "Lập kế hoạch các thành phần và nhãn trong sơ đồ" },
    pseudocode: { en: "Write Cambridge-style pseudocode", vi: "Viết Cambridge-style pseudocode" },
  }[practice.taskType][locale];

  const reset = () => {
    setDraft("");
    setSupportingDraft("");
    setRevealed(false);
    setAwardedPoints([]);
    try { window.localStorage.removeItem(storageKey); } catch { /* Keep reset usable without storage. */ }
  };

  return <section className={styles.examPractice} aria-labelledby={answerId + "-title"} data-exam-practice={practice.id}>
    <header>
      <div>
        <span>{locale === "vi" ? "BÀI TẬP DO ALGOCORE BIÊN SOẠN" : "ALGOCORE-AUTHORED EXAM PRACTICE"}</span>
        <h3 id={answerId + "-title"}>{practice.commandWord.toUpperCase()} · {taskLabel}</h3>
      </div>
      <strong>{practice.marks} {locale === "vi" ? "điểm" : practice.marks === 1 ? "mark" : "marks"}</strong>
    </header>
    <p className={styles.examPrompt}>{practice.prompt[locale]}</p>
    <details className={styles.examGuidance}>
      <summary>{locale === "vi" ? "Xem gợi ý cấu trúc câu trả lời" : "View answer-structure guidance"}</summary>
      <ul>{practice.answerGuidance.map((point, index) => <li key={index}>{point[locale]}</li>)}</ul>
    </details>
    <label htmlFor={answerId}>{responseLabel}</label>
    <textarea
      id={answerId}
      value={draft}
      onChange={(event) => { setDraft(event.target.value); setRevealed(false); setAwardedPoints([]); }}
      rows={practice.taskType === "pseudocode" || practice.taskType === "trace" ? 10 : 7}
      spellCheck={practice.taskType !== "pseudocode"}
      className={practice.taskType === "pseudocode" || practice.taskType === "trace" ? styles.structuredAnswer : undefined}
      placeholder={{
        "constructed-response": { en: "Make one clear point per sentence, then link it to the scenario.", vi: "Mỗi câu nêu một ý rõ ràng, sau đó liên hệ với tình huống." },
        calculation: { en: "Formula / conversion → substituted values → working", vi: "Công thức / phép đổi → thay số → các bước tính" },
        trace: { en: "Step | input or instruction | state after the step | output", vi: "Bước | input hoặc lệnh | trạng thái sau bước | output" },
        diagram: { en: "List every required component and the label it needs.", vi: "Liệt kê mọi thành phần cần vẽ và nhãn tương ứng." },
        pseudocode: { en: "Use indentation and Cambridge pseudocode conventions.", vi: "Dùng thụt lề và quy ước Cambridge pseudocode." },
      }[practice.taskType][locale]}
      aria-describedby={answerId + "-help"}
    />
    {practice.taskType === "calculation" ? <div className={styles.supportingAnswer}>
      <label htmlFor={answerId + "-final"}>{locale === "vi" ? "Đáp án cuối cùng và đơn vị" : "Final answer and unit"}</label>
      <input id={answerId + "-final"} value={supportingDraft} onChange={(event) => { setSupportingDraft(event.target.value); setRevealed(false); setAwardedPoints([]); }} />
    </div> : null}
    {practice.taskType === "diagram" ? <div className={styles.supportingAnswer}>
      <label htmlFor={answerId + "-links"}>{locale === "vi" ? "Mũi tên, quan hệ và hướng luồng" : "Arrows, relationships and direction of flow"}</label>
      <textarea id={answerId + "-links"} rows={4} value={supportingDraft} onChange={(event) => { setSupportingDraft(event.target.value); setRevealed(false); setAwardedPoints([]); }} placeholder={locale === "vi" ? "A → B: ghi rõ ý nghĩa của mũi tên" : "A → B: state what the arrow means"} />
    </div> : null}
    <p id={answerId + "-help"} className={styles.examHelp}>{locale === "vi" ? "Bản nháp được lưu trên thiết bị này và không được gửi đi." : "Your draft is saved on this device and is not submitted."}</p>
    <div className={styles.examActions}>
      <button type="button" className={styles.primaryButton} onClick={() => setRevealed(true)} disabled={!responseReady}>
        {locale === "vi" ? "Đối chiếu marking points" : "Check the marking points"}
      </button>
      <button type="button" className={styles.secondaryButton} onClick={reset}>
        {locale === "vi" ? "Làm lại" : "Reset"}
      </button>
    </div>
    {revealed ? <div className={styles.markingPoints}>
      <h4>{locale === "vi" ? "Marking points tự kiểm" : "Self-marking points"}</h4>
      <p className={styles.selfMarkScore} role="status" aria-live="polite">{locale === "vi" ? `Tự chấm: ${score}/${practice.marks} điểm` : `Self-mark: ${score}/${practice.marks} marks`}</p>
      <ol className={styles.selfMarkList}>{practice.markingPoints.map((point, index) => <li key={index}><label><input type="checkbox" checked={awardedPoints.includes(index)} onChange={(event) => setAwardedPoints((current) => event.target.checked ? [...current, index] : current.filter((item) => item !== index))} /><span>{point[locale]}</span></label></li>)}</ol>
      <p>{locale === "vi" ? "Đây là rubric do AlgoCore biên soạn. Chỉ tính một điểm khi câu trả lời của bạn nêu rõ ý tương ứng." : "This is an AlgoCore-authored rubric. Award a mark only when your answer clearly states the matching point."}</p>
      {score < practice.marks ? <p><strong>{locale === "vi" ? "Bước tiếp theo: " : "Next step: "}</strong>{locale === "vi" ? "Sửa câu trả lời để bổ sung các ý chưa đánh dấu, rồi đối chiếu lại." : "Revise your response to add the unchecked ideas, then mark it again."}</p> : null}
    </div> : null}
  </section>;
}
