import { Card } from '@/components'
import { Profile } from '@/components'
import styles from './page.module.css'

// ISR: Revalidate every 300 seconds
export const revalidate = 300

export default async function Home() {
  return (
    <div className={`container ${styles.container} page-enter`}>
      <Profile />
      <div className={styles.content}>
        <Card title="Featured Skills" className="hover-lift transition-all">
          <p className={`text-text-muted ${styles.paragraph}`}>
            Specialized in modern frontend technologies and best practices.
          </p>
          <div className={styles.skillsGrid}>
            <div className={`${styles.skillTag} hover-scale transition-transform`}>Next.js</div>
            <div className={`${styles.skillTag} hover-scale transition-transform`}>Vue</div>
            <div className={`${styles.skillTag} hover-scale transition-transform`}>TypeScript</div>
            <div className={`${styles.skillTag} hover-scale transition-transform`}>Three.js</div>
            <div className={`${styles.skillTag} hover-scale transition-transform`}>GLSL</div>
            <div className={`${styles.skillTag} hover-scale transition-transform`}>Agent-Based Interaction Design</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
