import { Card } from '@/components'
import { workContent } from '@/content'
import styles from './page.module.css'

// ISR: Revalidate every 300 seconds
export const revalidate = 300

export default async function Work() {
  return (
    <div className={`container ${styles.container} page-enter`}>
      <div className={styles.header}>
        <h1 className={styles.title}>{workContent.title}</h1>
        <p className={styles.subtitle}>{workContent.subtitle}</p>
      </div>

      <div className={styles.projects}>
        {workContent.projects.map((project) => (
          <Card 
            key={project.id} 
            className={`${styles.projectCard} ${project.featured ? styles.featured : ''} hover-lift transition-all`}
          >
            <div className={styles.projectContent}>
              <div className={styles.projectImage}>
                <div className={styles.imagePlaceholder}>
                  {project.title.charAt(0)}
                </div>
              </div>
              <div className={styles.projectInfo}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
                <div className={styles.technologies}>
                  {project.technologies.map((tech) => (
                    <span key={tech} className={`${styles.techTag} hover-scale transition-transform`}>
                      {tech}
                    </span>
                  ))}
                </div>
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`${styles.projectLink} hover-color transition-colors`}
                >
                  View Project →
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

