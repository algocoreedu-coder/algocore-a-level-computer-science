"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import type { Locale, StudyMapCatalog } from "@/app/lib/paper3/catalog";
import { paper3Href } from "./shared";
import { usePaper3LearningProgress } from "./learning-progress";
import styles from "./StudyProgressPanel.module.css";

export function StudyProgressPanel({ catalog, locale }: { readonly catalog: StudyMapCatalog; readonly locale: Locale }) {
  const { progress } = usePaper3LearningProgress();
  const completed = new Set(progress.completedSlugs);
  const lastTopic = catalog.topics.find((topic) => topic.slug === progress.lastVisitedSlug);
  const nextTopic = lastTopic ?? catalog.topics.find((topic) => topic.status === "available");
  const completedCount = catalog.topics.filter((topic) => completed.has(topic.slug)).length;

  return <section className={styles.panel} aria-labelledby="paper3-progress-title">
    <div className={styles.summary}>
      <BookOpenCheck aria-hidden="true" />
      <div>
        <span className={styles.eyebrow}>{locale === "vi" ? "TIẾN ĐỘ TRÊN THIẾT BỊ NÀY" : "PROGRESS ON THIS DEVICE"}</span>
        <h2 id="paper3-progress-title">{completedCount ? (locale === "vi" ? `${completedCount}/${catalog.topics.length} bài đã hoàn thành` : `${completedCount}/${catalog.topics.length} lessons complete`) : (locale === "vi" ? "Bắt đầu lộ trình Paper 3" : "Start your Paper 3 journey")}</h2>
        <p>{locale === "vi" ? "Tiến độ được lưu trên trình duyệt này thay vì ghi vào tài khoản lớp dùng chung. Nếu nhiều học sinh dùng cùng một máy, hãy dùng hồ sơ trình duyệt riêng." : "Progress stays in this browser instead of the shared class account. Students using the same computer should use separate browser profiles."}</p>
        {nextTopic ? <Link className={styles.continueLink} href={paper3Href(`/paper-3/topics/${nextTopic.slug}`, locale)}>{lastTopic ? (locale === "vi" ? "Tiếp tục bài gần nhất" : "Continue last lesson") : (locale === "vi" ? "Bắt đầu bài đầu tiên" : "Start the first lesson")}<ArrowRight size={18} aria-hidden="true" /></Link> : null}
      </div>
    </div>
    <div className={styles.sectionProgress} aria-label={locale === "vi" ? "Tiến độ theo section" : "Progress by section"}>
      {catalog.sections.map((section) => {
        const strandIds = new Set(catalog.strands.filter((strand) => strand.sectionId === section.id).map((strand) => strand.id));
        const topics = catalog.topics.filter((topic) => strandIds.has(topic.strandId));
        const done = topics.filter((topic) => completed.has(topic.slug)).length;
        return <div className={styles.sectionRow} key={section.id}>
          <span>{section.id}</span><progress className={styles.track} max={topics.length || 1} value={done} aria-label={`Section ${section.id}: ${done}/${topics.length}`}>{done}/{topics.length}</progress><span>{done}/{topics.length}</span>
        </div>;
      })}
    </div>
  </section>;
}
