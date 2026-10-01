import type { Locale } from "@/app/lib/paper3/catalog";
import type { Paper3VisualCatalogEntry } from "@/app/lib/paper3/visual-catalog";
import styles from "./LessonPage.module.css";

export function VisualUsageNote({
  entry,
  locale,
}: {
  readonly entry: Paper3VisualCatalogEntry;
  readonly locale: Locale;
}) {
  const headingId = `visual-usage-${entry.topicId.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <aside
      className={styles.visualUsageNote}
      aria-labelledby={headingId}
      data-visual-usage-note={entry.visualKind}
      data-visual-topic={entry.topicId}
    >
      <div>
        <span>{locale === "vi" ? "VISUAL TRONG BÀI HỌC" : "VISUAL IN THIS LESSON"}</span>
        <h3 id={headingId}>{entry.lessonTitle[locale]}</h3>
      </div>
      <dl>
        <div>
          <dt>{locale === "vi" ? "Dùng để" : "Use it to"}</dt>
          <dd>{entry.usage[locale]}</dd>
        </div>
        <div>
          <dt>{locale === "vi" ? "Tập trung quan sát" : "Focus your attention on"}</dt>
          <dd>{entry.learningFocus[locale]}</dd>
        </div>
      </dl>
    </aside>
  );
}
