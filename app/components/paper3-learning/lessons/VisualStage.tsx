"use client";

import dynamic from "next/dynamic";
import type { Locale } from "@/app/lib/paper3/catalog";
import type { Paper3Lesson } from "@/app/lib/paper3/lesson-types";
import type { Section16Kind } from "./Section16Workbench";
import type { SecurityVisualKind } from "./Section17SecurityWorkbench";
import type { AIVisualKind } from "./Section18AIWorkbench";
import type { Section19VisualKind } from "./Section19ComputationalWorkbench";
import type { Section20VisualKind } from "./Section20FurtherProgrammingWorkbench";
import { CambridgeVisualPrimer } from "./CambridgeVisualPrimer";
import styles from "./LessonPage.module.css";

function VisualLoading() {
  return <div className={styles.visualLoading} role="status" aria-live="polite">Loading interactive visual… · Đang tải minh họa tương tác…</div>;
}

const FloatWorkbench = dynamic(() => import("./FloatWorkbench").then(module => module.FloatWorkbench), { loading: VisualLoading });
const FileWorkbench = dynamic(() => import("./FileWorkbench").then(module => module.FileWorkbench), { loading: VisualLoading });
const ConceptWorkbench = dynamic(() => import("./ConceptWorkbench").then(module => module.ConceptWorkbench), { loading: VisualLoading });
const NumericWorkbench = dynamic(() => import("./NumericWorkbench").then(module => module.NumericWorkbench), { loading: VisualLoading });
const NetworkWorkbench = dynamic(() => import("./NetworkWorkbench").then(module => module.NetworkWorkbench), { loading: VisualLoading });
const NetworkTopicWorkbench = dynamic(() => import("./NetworkTopicWorkbench").then(module => module.NetworkTopicWorkbench), { loading: VisualLoading });
const HardwareWorkbench = dynamic(() => import("./HardwareWorkbench").then(module => module.HardwareWorkbench), { loading: VisualLoading });
const LogicWorkbench = dynamic(() => import("./LogicWorkbench").then(module => module.LogicWorkbench), { loading: VisualLoading });
const HardwareScaleWorkbench = dynamic(() => import("./HardwareScaleWorkbench").then(module => module.HardwareScaleWorkbench), { loading: VisualLoading });
const LogicScaleWorkbench = dynamic(() => import("./LogicScaleWorkbench").then(module => module.LogicScaleWorkbench), { loading: VisualLoading });
const Section16Workbench = dynamic(() => import("./Section16Workbench").then(module => module.Section16Workbench), { loading: VisualLoading });
const Section17SecurityWorkbench = dynamic(() => import("./Section17SecurityWorkbench").then(module => module.Section17SecurityWorkbench), { loading: VisualLoading });
const Section18AIWorkbench = dynamic(() => import("./Section18AIWorkbench").then(module => module.Section18AIWorkbench), { loading: VisualLoading });
const Section19ComputationalWorkbench = dynamic(() => import("./Section19ComputationalWorkbench").then(module => module.Section19ComputationalWorkbench), { loading: VisualLoading });
const Section20FurtherProgrammingWorkbench = dynamic(() => import("./Section20FurtherProgrammingWorkbench").then(module => module.Section20FurtherProgrammingWorkbench), { loading: VisualLoading });

export function VisualStage({ lesson, locale }: { readonly lesson: Paper3Lesson; readonly locale: Locale }) {
  return <div className={styles.visualStage} data-visual-stage>
    <CambridgeVisualPrimer kind={lesson.visual.kind} locale={locale} />
    <div className={styles.visualTask}>{lesson.visual.task[locale]}</div>
    <details className={styles.conventions}><summary>{locale === "vi" ? "Quy ước của minh họa" : "Conventions for this visual"}</summary><ul>{lesson.visual.conventions.map((convention, index) => <li key={index}>{convention[locale]}</li>)}</ul></details>
    {["paradigm-procedural", "addressing-modes", "assembly-workbench", "oop-encapsulation", "oop-relationships", "declarative-inference", "sequential-files", "random-files", "exception-flow"].includes(lesson.visual.kind) ? <Section20FurtherProgrammingWorkbench kind={lesson.visual.kind as Section20VisualKind} locale={locale} /> : ["linear-search", "binary-search", "bubble-sort", "insertion-sort", "stack-adt", "queue-adt", "linked-list", "binary-tree", "dictionary", "adt-implementation", "complexity-comparator", "recursion-trace", "call-stack-unwinding"].includes(lesson.visual.kind) ? <Section19ComputationalWorkbench kind={lesson.visual.kind as Section19VisualKind} locale={locale} /> : ["dijkstra-search", "astar-search", "learning-categories", "neural-network", "backpropagation", "regression"].includes(lesson.visual.kind) ? <Section18AIWorkbench kind={lesson.visual.kind as AIVisualKind} locale={locale} /> : ["key-ownership", "quantum-key-distribution", "tls-session", "certificate-signature"].includes(lesson.visual.kind) ? <Section17SecurityWorkbench kind={lesson.visual.kind as SecurityVisualKind} locale={locale} /> : ["process-states", "cpu-scheduling", "kernel-interrupts", "memory-addressing", "page-replacement", "translation-workflows", "compilation-pipeline", "bnf-explorer", "rpn-stack"].includes(lesson.visual.kind) ? <Section16Workbench kind={lesson.visual.kind as Section16Kind} locale={locale} /> : lesson.visual.kind === "pipeline-registers-interrupts" ? <HardwareWorkbench kind="pipeline-registers-interrupts" locale={locale} /> : lesson.visual.kind === "logic-circuit" ? <LogicWorkbench kind="logic-circuit" locale={locale} /> : ["risc-cisc", "flynn-parallelism", "virtual-machines"].includes(lesson.visual.kind) ? <HardwareScaleWorkbench kind={lesson.visual.kind as "risc-cisc" | "flynn-parallelism" | "virtual-machines"} locale={locale} /> : ["adders", "sr-jk-flip-flops", "boolean-simplification", "karnaugh-map"].includes(lesson.visual.kind) ? <LogicScaleWorkbench kind={lesson.visual.kind as "adders" | "sr-jk-flip-flops" | "boolean-simplification" | "karnaugh-map"} locale={locale} /> : lesson.visual.kind === "tcp-ip-stack" ? <NetworkWorkbench locale={locale} /> : ["application-protocols", "bittorrent", "packet-routing", "switching-methods"].includes(lesson.visual.kind) ? <NetworkTopicWorkbench kind={lesson.visual.kind as "application-protocols" | "bittorrent" | "packet-routing" | "switching-methods"} locale={locale} /> : lesson.visual.kind === "floating-conversion" ? <FloatWorkbench locale={locale} /> : ["enumeration", "pointers", "sets", "records"].includes(lesson.visual.kind) ? <ConceptWorkbench kind={lesson.visual.kind} locale={locale} /> : lesson.visual.kind === "file-organisation" || lesson.visual.kind === "hashing" || lesson.visual.kind === "collisions" ? <FileWorkbench kind={lesson.visual.kind} locale={locale} /> : <NumericWorkbench kind={lesson.visual.kind as "normalisation" | "precision-range" | "rounding-errors"} locale={locale} />}
  </div>;
}
