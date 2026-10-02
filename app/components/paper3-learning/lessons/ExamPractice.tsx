"use client";

import { useId, useState } from "react";
import type { Locale } from "@/app/lib/paper3/catalog";
import type { ExamPractice as ExamPracticeData } from "@/app/lib/paper3/lesson-types";
import styles from "./LessonPage.module.css";

export function ExamPractice({ practice, locale }: { readonly practice: ExamPracticeData; readonly locale: Locale }) {
  const answerId = useId();
  const [draft, setDraft] = useState("");
  const [revealed, setRevealed] = useState(false);
  const taskLabel = {
    "constructed-response": { en: "Written response", vi: "Câu trả lời tự viết" },
    calculation: { en: "Calculation", vi: "Bài tính" },
    trace: { en: "Trace", vi: "Bài trace" },
    diagram: { en: "Diagram", vi: "Bài sơ đồ" },
    pseudocode: { en: "Pseudocode", vi: "Bài pseudocode" },
  }[practice.taskType][locale];

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
    <label htmlFor={answerId}>{locale === "vi" ? "Viết câu trả lời của bạn trước khi xem marking points" : "Write your answer before revealing the marking points"}</label>
    <textarea id={answerId} value={draft} onChange={(event) => setDraft(event.target.value)} rows={7} spellCheck aria-describedby={answerId + "-help"} />
    <p id={answerId + "-help"} className={styles.examHelp}>{locale === "vi" ? "Câu trả lời chỉ được giữ trong trang hiện tại và không được gửi đi." : "Your answer stays in this page and is not submitted."}</p>
    <div className={styles.examActions}>
      <button type="button" className={styles.primaryButton} onClick={() => setRevealed(true)} disabled={draft.trim().length < 3}>
        {locale === "vi" ? "Đối chiếu marking points" : "Check the marking points"}
      </button>
      <button type="button" className={styles.secondaryButton} onClick={() => { setDraft(""); setRevealed(false); }}>
        {locale === "vi" ? "Làm lại" : "Reset"}
      </button>
    </div>
    {revealed ? <div className={styles.markingPoints} role="status" aria-live="polite">
      <h4>{locale === "vi" ? "Marking points tự kiểm" : "Self-marking points"}</h4>
      <ol>{practice.markingPoints.map((point, index) => <li key={index}>{point[locale]}</li>)}</ol>
      <p>{locale === "vi" ? "Đây là rubric do AlgoCore biên soạn. Chỉ tính một điểm khi câu trả lời của bạn nêu rõ ý tương ứng." : "This is an AlgoCore-authored rubric. Award a mark only when your answer clearly states the matching point."}</p>
    </div> : null}
  </section>;
}
