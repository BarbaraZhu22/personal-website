"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Button, Card, VideoModal } from "@/components";
import type { WorkProject } from "@/content/work";
import { useTranslation } from "@/hooks";
import styles from "./page.module.css";

interface ProjectGridProps {
  projects: WorkProject[];
}

const COLLAPSED_DETAIL_THRESHOLD = 3;
const COLLAPSED_DETAIL_HEIGHT = 176;

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const { t } = useTranslation();
  const [expandedProjects, setExpandedProjects] = useState<
    Record<string, boolean>
  >({});
  const [activeVideoProjectId, setActiveVideoProjectId] = useState<
    string | null
  >(null);

  const activeProject = useMemo(
    () =>
      projects.find((project) => project.id === activeVideoProjectId) ?? null,
    [activeVideoProjectId, projects]
  );

  const toggleDetail = (projectId: string) => {
    setExpandedProjects((current) => ({
      ...current,
      [projectId]: !current[projectId],
    }));
  };

  const closeVideo = () => setActiveVideoProjectId(null);

  return (
    <>
      <div className={styles.projects}>
        {projects.map((project, index) => {
          const [summary, ...descriptionDetail] = project.description;
          const isExpanded = Boolean(expandedProjects[project.id]);
          const combinedDetail = [...descriptionDetail, ...project.detail];
          const detailItems = combinedDetail;
          const shouldShowDetailToggle =
            combinedDetail.length >= COLLAPSED_DETAIL_THRESHOLD;

          return (
            <Card
              key={project.id}
              className={`${styles.projectCard} hover-lift transition-all`}
            >
              <div
                className={styles.projectMedia}
                onClick={() => setActiveVideoProjectId(project.id)}
              >
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={`${project.title} cover`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className={styles.projectMediaImage}
                    priority={index === 0}
                  />
                ) : (
                  <div className={styles.mediaFallback}>
                    {project.title.charAt(0)}
                  </div>
                )}
              </div>

              <div className={styles.projectBody}>
                <h3 className={styles.projectTitle}>{project.title}</h3>

                {summary ? (
                  <p className={styles.projectSummary}>
                    {summary.replace(/^目的[:：]?\s*/, "")}
                  </p>
                ) : null}

                {combinedDetail.length ? (
                  <div className={styles.projectDetail}>
                    <ul
                      className={styles.detailList}
                      data-expanded={isExpanded}
                      data-scrollable={!isExpanded}
                      style={
                        isExpanded
                          ? undefined
                          : {
                              maxHeight: COLLAPSED_DETAIL_HEIGHT,
                              overflowY: "auto",
                            }
                      }
                    >
                      {detailItems.map((detail, index) => (
                        <li
                          key={`${project.id}-detail-${index}`}
                          className={styles.detailItem}
                        >
                          {detail}
                        </li>
                      ))}
                    </ul>

                    {shouldShowDetailToggle ? (
                      <Button
                        type="button"
                        className={styles.detailToggle}
                        onClick={() => toggleDetail(project.id)}
                      >
                        {isExpanded ? t("collapseDetail") : t("extendDetail")}
                      </Button>
                    ) : null}
                  </div>
                ) : null}

                {project.technologies.length ? (
                  <div className={styles.technologies}>
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className={`${styles.techTag} hover-scale transition-transform`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className={styles.projectActions}>
                  {project.isLink && project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.projectLink} hover-color transition-colors`}
                    >
                      {t("viewProject")} →
                    </a>
                  ) : project.video ? (
                    <Button
                      type="button"
                      variant="primary"
                      className={styles.videoButton}
                      onClick={() => setActiveVideoProjectId(project.id)}
                    >
                      {t("watchVideo")}
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <VideoModal
        open={Boolean(activeProject && activeProject.video)}
        onClose={closeVideo}
        videoSrc={
          activeProject?.video?.startsWith("/videos/")
            ? `/api/videos?file=${encodeURIComponent(
                activeProject.video.replace(/^\/videos\//, "")
              )}`
            : activeProject?.video
        }
        title={activeProject?.title}
      />
    </>
  );
}
