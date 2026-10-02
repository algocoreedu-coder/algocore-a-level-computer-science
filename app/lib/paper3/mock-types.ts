import type { Localized } from "./catalog";

export interface MockQuestion {
  readonly id: string;
  readonly number: string;
  readonly sectionIds: readonly string[];
  readonly commandWords: readonly string[];
  readonly ao: "AO1" | "AO2";
  readonly marks: number;
  readonly prompt: Localized;
  readonly scenario?: Localized;
  readonly data?: unknown;
  readonly markingPoints: readonly { readonly id: string; readonly mark: number; readonly en: string; readonly vi: string }[];
  readonly workedSolution: Localized;
  readonly sourcePatternIds: readonly string[];
}

export interface MockPaper {
  readonly schemaVersion: 1;
  readonly id: string;
  readonly examYear: 2026;
  readonly paper: 3;
  readonly title: Localized;
  readonly emphasis: Localized;
  readonly authorship: {
    readonly origin: "algocore-authored";
    readonly officialCambridgePaper: false;
    readonly notice: Localized;
  };
  readonly durationMinutes: 90;
  readonly totalMarks: 75;
  readonly aoTargets: { readonly AO1: 45; readonly AO2: 30 };
  readonly sectionIds: readonly string[];
  readonly instructions: Localized;
  readonly questions: readonly MockQuestion[];
}
