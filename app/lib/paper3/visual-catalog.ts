import visualCatalogData from "@/content/paper3/visual-catalog.json";
import type { Localized } from "./catalog";
import type { VisualKind } from "./lesson-types";

export type VisualPriority = "required" | "recommended";

export type VisualRuntimeFamily =
  | "concept-workbench"
  | "file-workbench"
  | "float-workbench"
  | "numeric-workbench"
  | "network-workbench"
  | "network-topic-workbench"
  | "hardware-workbench"
  | "hardware-scale-workbench"
  | "logic-workbench"
  | "logic-scale-workbench"
  | "section16-workbench"
  | "section17-security-workbench"
  | "section18-ai-workbench"
  | "section19-computational-workbench"
  | "section20-further-programming-workbench";

export interface Paper3VisualCatalogEntry {
  readonly topicId: string;
  readonly sectionId: string;
  readonly slug: string;
  readonly lessonTitle: Localized;
  readonly visualKind: VisualKind;
  readonly runtimeFamily: VisualRuntimeFamily;
  readonly priority: VisualPriority;
  /** Student-facing note describing where the visual supports the lesson. */
  readonly usage: Localized;
  /** Student-facing observation target for the visual. */
  readonly learningFocus: Localized;
  /** Teacher-facing authoring note. Never render this in the learner lesson. */
  readonly teacherNote: Localized;
  readonly status: "implemented";
}

export interface Paper3VisualCatalog {
  readonly schemaVersion: 1;
  readonly examYear: 2026;
  readonly visuals: readonly Paper3VisualCatalogEntry[];
}

const visualCatalog = visualCatalogData as unknown as Paper3VisualCatalog;

export function getPaper3VisualCatalog(): Paper3VisualCatalog {
  return visualCatalog;
}

export function getVisualCatalogEntry(topicId: string): Paper3VisualCatalogEntry | undefined {
  return visualCatalog.visuals.find((entry) => entry.topicId === topicId);
}
