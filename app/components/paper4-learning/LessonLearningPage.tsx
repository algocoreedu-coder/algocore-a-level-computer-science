import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";

import binarySearchProjectionData from "@/app/data/paper4-v2/learner-projections/binary-search.json";
import dataModelsProjectionData from "@/app/data/paper4-v2/learner-projections/data-models.json";
import proceduralDesignProjectionData from "@/app/data/paper4-v2/learner-projections/procedural-design.json";
import validationRulesProjectionData from "@/app/data/paper4-v2/learner-projections/validation-rules.json";
import testingProjectionData from "@/app/data/paper4-v2/learner-projections/testing.json";
import textProcessingProjectionData from "@/app/data/paper4-v2/learner-projections/text-processing.json";
import searchCollectionsProjectionData from "@/app/data/paper4-v2/learner-projections/search-collections.json";
import sortingProjectionData from "@/app/data/paper4-v2/learner-projections/sorting.json";
import performanceProjectionData from "@/app/data/paper4-v2/learner-projections/performance.json";
import stackProjectionData from "@/app/data/paper4-v2/learner-projections/stack.json";
import queueProjectionData from "@/app/data/paper4-v2/learner-projections/queue.json";
import linkedListProjectionData from "@/app/data/paper4-v2/learner-projections/linked-list.json";
import recursionProjectionData from "@/app/data/paper4-v2/learner-projections/recursion.json";
import { LocaleBoundary, LocaleLink } from "./LocaleBoundary";
import { assertLearnerProjectionSafe, assertLearnerTextSafe, learnerText, type DataModelsLearnerProjection, type LearnerProjection, type LinkedListLearnerProjection, type PerformanceLearnerProjection, type ProceduralDesignLearnerProjection, type QueueLearnerProjection, type RecursionLearnerProjection, type SearchCollectionsLearnerProjection, type SortingLearnerProjection, type StackLearnerProjection, type TestingLearnerProjection, type TextProcessingLearnerProjection, type ValidationRulesLearnerProjection } from "./learnerProjection";
import { assertLinkedListProjection } from "./linkedListProjectionAdapter";
import { assertRecursionProjection } from "./recursionProjectionAdapter";
import { SixStageLearnerJourney } from "./SixStageLearnerJourney";
import type { LearningLocale, LessonDto, Localized } from "./types";
import styles from "./LessonLearningPage.module.css";

const binarySearchProjection = binarySearchProjectionData as unknown as LearnerProjection;
const dataModelsProjection = dataModelsProjectionData as unknown as DataModelsLearnerProjection;
const proceduralDesignProjection = proceduralDesignProjectionData as unknown as ProceduralDesignLearnerProjection;
const validationRulesProjection = validationRulesProjectionData as unknown as ValidationRulesLearnerProjection;
const testingProjection = testingProjectionData as unknown as TestingLearnerProjection;
const textProcessingProjection = textProcessingProjectionData as unknown as TextProcessingLearnerProjection;
const searchCollectionsProjection = searchCollectionsProjectionData as unknown as SearchCollectionsLearnerProjection;
const sortingProjection = sortingProjectionData as unknown as SortingLearnerProjection;
const performanceProjection = performanceProjectionData as unknown as PerformanceLearnerProjection;
const stackProjection = stackProjectionData as unknown as StackLearnerProjection;
const queueProjection = queueProjectionData as unknown as QueueLearnerProjection;
const linkedListProjection = linkedListProjectionData as unknown as LinkedListLearnerProjection;
const recursionProjection = recursionProjectionData as unknown as RecursionLearnerProjection;
assertLearnerProjectionSafe(binarySearchProjection);
assertLearnerProjectionSafe(dataModelsProjection);
assertLearnerProjectionSafe(proceduralDesignProjection);
assertLearnerProjectionSafe(validationRulesProjection);
assertLearnerProjectionSafe(testingProjection);
assertLearnerProjectionSafe(textProcessingProjection);
assertLearnerProjectionSafe(searchCollectionsProjection);
assertLearnerProjectionSafe(sortingProjection);
assertLearnerProjectionSafe(performanceProjection as unknown as LearnerProjection);
assertLearnerProjectionSafe(stackProjection as unknown as LearnerProjection);
assertLearnerProjectionSafe(queueProjection as unknown as LearnerProjection);
assertLearnerProjectionSafe(linkedListProjection as unknown as LearnerProjection);
assertLinkedListProjection(linkedListProjection);
assertLearnerProjectionSafe(recursionProjection as unknown as LearnerProjection);
assertRecursionProjection(recursionProjection);

const learnerCandidates: Readonly<Record<string, LearnerProjection>> = {
  "binary-search": binarySearchProjection,
  "data-models": dataModelsProjection,
  "procedural-design": proceduralDesignProjection,
  "validation-rules": validationRulesProjection,
  "testing": testingProjection,
  "text-processing": textProcessingProjection,
  "search-collections": searchCollectionsProjection,
  "sorting": sortingProjection,
  "performance": performanceProjection as unknown as LearnerProjection,
  "stack": stackProjection as unknown as LearnerProjection,
  "queue": queueProjection as unknown as LearnerProjection,
  "linked-list": linkedListProjection as unknown as LearnerProjection,
  "recursion": recursionProjection as unknown as LearnerProjection,
};

const copy = {
  vi: {
    skip: "Bỏ qua đến nội dung bài học",
    course: "Cambridge 9618 · Paper 4 · Python · 2026",
    language: "Ngôn ngữ bài học",
    unavailable: "Bài học đang được giáo viên biên tập theo hành trình học sáu chặng.",
    unavailableDetail: "Nội dung sẽ mở sau khi bản học sinh được duyệt. Dữ liệu kiểm chứng vẫn được giữ cho giáo viên và QA.",
  },
  en: {
    skip: "Skip to lesson content",
    course: "Cambridge 9618 · Paper 4 · Python · 2026",
    language: "Lesson language",
    unavailable: "This lesson is being prepared in the six-stage learner journey.",
    unavailableDetail: "It will open after its learner projection is teacher-approved. Verified records remain available to teachers and QA.",
  },
} as const;

export type LessonNavigationItem = Readonly<{ slug: string; title: Localized }>;

function LanguageNavigation({ slug, locale }: { readonly slug: string; readonly locale: LearningLocale }) {
  return <nav className={styles.localeNav} aria-label={copy[locale].language}><LocaleLink slug={slug} locale="vi" currentLocale={locale} /><LocaleLink slug={slug} locale="en" currentLocale={locale} /></nav>;
}

function PendingLearnerProjection({ lesson, locale }: { readonly lesson: LessonDto; readonly locale: LearningLocale }) {
  const title = assertLearnerTextSafe(lesson.identity.title[locale]);
  const t = copy[locale];
  return <>
    <LocaleBoundary locale={locale} />
    <DocsPage full tableOfContent={{ enabled: false }} tableOfContentPopover={{ enabled: false }} footer={{ enabled: false }} className={styles.page}>
      <div lang={locale} data-release-state="blocked-pending-teacher-projection">
        <div className={styles.eyebrow}><strong>{t.course}</strong></div>
        <DocsTitle>{title}</DocsTitle>
        <DocsDescription>{t.unavailable}</DocsDescription>
        <div className={styles.meta}><span>{t.unavailableDetail}</span><LanguageNavigation slug={lesson.identity.slug} locale={locale} /></div>
      </div>
    </DocsPage>
  </>;
}

export function LessonLearningPage({ lesson, locale, nextLesson }: { readonly lesson: LessonDto; readonly locale: LearningLocale; readonly previousLesson: LessonNavigationItem | null; readonly nextLesson: LessonNavigationItem | null }) {
  const projection = learnerCandidates[lesson.identity.slug];
  if (!projection) return <PendingLearnerProjection lesson={lesson} locale={locale} />;

  const t = copy[locale];
  const releaseState = lesson.identity.slug === "recursion"
    ? "candidate-awaiting-teacher-post-render"
    : lesson.identity.slug === "linked-list"
    ? "candidate-awaiting-user-evaluation"
    : lesson.identity.slug === "queue"
    ? "candidate-awaiting-user-evaluation"
    : lesson.identity.slug === "stack"
    ? "candidate-awaiting-user-evaluation"
    : lesson.identity.slug === "performance"
    ? "candidate-awaiting-user-evaluation"
    : lesson.identity.slug === "sorting" || lesson.identity.slug === "search-collections" || lesson.identity.slug === "text-processing" || lesson.identity.slug === "testing" || lesson.identity.slug === "validation-rules" || lesson.identity.slug === "procedural-design" || lesson.identity.slug === "data-models"
    ? "candidate-awaiting-user-evaluation"
    : "released";
  return <>
    <LocaleBoundary locale={locale} />
    <DocsPage full tableOfContent={{ enabled: false }} tableOfContentPopover={{ enabled: false }} footer={{ enabled: false }} className={styles.page}>
      <a className={styles.skipLink} href="#stage-recognise">{t.skip}</a>
      <div lang={locale} data-release-state={releaseState}>
        <div className={styles.eyebrow}><strong>{learnerText(projection.exam_family, locale)}</strong><span>{t.course}</span></div>
        <DocsTitle>{learnerText(projection.lesson_title, locale)}</DocsTitle>
        <DocsDescription>{learnerText(projection.stages.recognise.intro, locale)}</DocsDescription>
        <div className={styles.meta}><span>{learnerText(projection.language_policy, locale)}</span><LanguageNavigation slug={lesson.identity.slug} locale={locale} /></div>
      </div>
      <DocsBody id="lesson-content" lang={locale}>
        <SixStageLearnerJourney lessonSlug={lesson.identity.slug} projection={projection} locale={locale} patterns={lesson.visual.owned_patterns} pythonArtifact={lesson.python} nextLesson={nextLesson} />
      </DocsBody>
    </DocsPage>
  </>;
}
