"use client";

import { useMemo } from "react";
import type { LocalizedWorkContent } from "@/content/work";
import { useTranslation } from "@/hooks";
import ProjectGrid from "./ProjectGrid";
import styles from "./page.module.css";

interface WorkPageClientProps {
  workContentByLanguage: LocalizedWorkContent;
}

export default function WorkPageClient({
  workContentByLanguage,
}: WorkPageClientProps) {
  const { language } = useTranslation();

  const workContent = useMemo(() => {
    return (
      workContentByLanguage[language] ?? workContentByLanguage.en
    );
  }, [language, workContentByLanguage]);

  return (
    <div className={`container ${styles.container} page-enter`}>
      <div className={styles.header}>
        <h1 className={styles.title}>{workContent.title}</h1>
        {workContent.subtitle ? (
          <p className={styles.subtitle}>{workContent.subtitle}</p>
        ) : null}
      </div>

      <ProjectGrid projects={workContent.projects} />
    </div>
  );
}


