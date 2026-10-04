"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "algocore:paper3:learning-progress:v1";
const CHANGE_EVENT = "algocore:paper3:progress-change";

export interface Paper3LearningProgress {
  readonly lastVisitedSlug: string | null;
  readonly completedSlugs: readonly string[];
}
const emptyProgress: Paper3LearningProgress = { lastVisitedSlug: null, completedSlugs: [] };

function readProgress(): Paper3LearningProgress {
  if (typeof window === "undefined") return emptyProgress;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<Paper3LearningProgress> | null;
    return {
      lastVisitedSlug: typeof parsed?.lastVisitedSlug === "string" ? parsed.lastVisitedSlug : null,
      completedSlugs: Array.isArray(parsed?.completedSlugs)
        ? [...new Set(parsed.completedSlugs.filter((slug): slug is string => typeof slug === "string"))]
        : [],
    };
  } catch {
    return emptyProgress;
  }
}

function writeProgress(progress: Paper3LearningProgress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // Browsing modes that block storage should not prevent the lesson from working.
  }
}

export function usePaper3LearningProgress() {
  const [progress, setProgress] = useState<Paper3LearningProgress>(emptyProgress);

  useEffect(() => {
    const refresh = () => setProgress(readProgress());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(CHANGE_EVENT, refresh);
    };
  }, []);

  const visitLesson = useCallback((slug: string) => {
    const current = readProgress();
    if (current.lastVisitedSlug !== slug) writeProgress({ ...current, lastVisitedSlug: slug });
  }, []);

  const setLessonCompleted = useCallback((slug: string, completed: boolean) => {
    const current = readProgress();
    const completedSlugs = new Set(current.completedSlugs);
    if (completed) completedSlugs.add(slug);
    else completedSlugs.delete(slug);
    writeProgress({ lastVisitedSlug: slug, completedSlugs: [...completedSlugs] });
  }, []);

  return { progress, visitLesson, setLessonCompleted };
}
