"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import type { Locale } from "@/app/lib/paper3/catalog";
import { paper3Href } from "../shared";
import { usePaper3LearningProgress } from "../learning-progress";
import styles from "./LessonJourney.module.css";

export interface LessonJourneyTopic { readonly slug: string; readonly title: { readonly en: string; readonly vi: string } }
export interface LessonJourneyAnchor { readonly id: string; readonly en: string; readonly vi: string }

export function LessonJourneyNav({ slug, anchors, locale }: { readonly slug: string; readonly anchors: readonly LessonJourneyAnchor[]; readonly locale: Locale }) {
  const [activeId, setActiveId] = useState(anchors[0]?.id ?? "understand");
  const { visitLesson } = usePaper3LearningProgress();

  useEffect(() => { visitLesson(slug); }, [slug, visitLesson]);
  useEffect(() => {
    const elements = anchors.map((anchor) => document.getElementById(anchor.id)).filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveId(visible.target.id);
    }, { rootMargin: "-20% 0px -62% 0px", threshold: [0, .15, .5] });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [anchors]);

  return <nav className={styles.journey} aria-label={locale === "vi" ? "Tiến trình trong bài" : "Lesson progress"}>
    {anchors.map((anchor, index) => <a href={`#${anchor.id}`} key={anchor.id} aria-current={anchor.id === activeId ? "location" : undefined}><span>{index + 1}</span>{anchor[locale]}</a>)}
  </nav>;
}
export function LessonCompletionFooter({ slug, previous, next, locale }: { readonly slug: string; readonly previous?: LessonJourneyTopic; readonly next?: LessonJourneyTopic; readonly locale: Locale }) {
  const { progress, setLessonCompleted } = usePaper3LearningProgress();
  const completed = useMemo(() => progress.completedSlugs.includes(slug), [progress.completedSlugs, slug]);
  return <nav className={styles.footer} aria-label={locale === "vi" ? "Hoàn thành và chuyển bài" : "Complete and move between lessons"}>
    {previous ? <Link className={styles.directionLink} href={paper3Href(`/paper-3/topics/${previous.slug}`, locale)}><ArrowLeft size={18} aria-hidden="true" /><span><small>{locale === "vi" ? "Bài trước" : "Previous lesson"}</small><strong>{previous.title[locale]}</strong></span></Link> : <span />}
    <button className={styles.completeButton} type="button" data-completed={completed} aria-pressed={completed} onClick={() => setLessonCompleted(slug, !completed)}>{completed ? <CheckCircle2 size={18} aria-hidden="true" /> : <Circle size={18} aria-hidden="true" />}{completed ? (locale === "vi" ? "Đã hoàn thành" : "Lesson complete") : (locale === "vi" ? "Đánh dấu hoàn thành" : "Mark lesson complete")}</button>
    {next ? <Link className={styles.directionLink} href={paper3Href(`/paper-3/topics/${next.slug}`, locale)}><span><small>{locale === "vi" ? "Bài tiếp theo" : "Next lesson"}</small><strong>{next.title[locale]}</strong></span><ArrowRight size={18} aria-hidden="true" /></Link> : <span />}
  </nav>;
}
