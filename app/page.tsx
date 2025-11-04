import { Header } from '@/layouts'
import { Card, Button } from '@/components'
import { getHomeContent } from '@/content/home'
import styles from './page.module.css'

// ISR: Revalidate every 300 seconds
export const revalidate = 300

export default async function Home() {
  const content = await getHomeContent()

  return (
    <div className="min-h-screen">
      <Header />
      <main className={`container ${styles.main}`}>
        <div className={styles.content}>
          <Card title={content.welcome.title}>
            <p className={`text-text-muted ${styles.paragraph}`}>
              {content.welcome.description}
            </p>
            <div className={styles.buttonGroup}>
              <Button variant="primary" className={styles.button}>Primary Button</Button>
              <Button variant="default" className={styles.button}>Default Button</Button>
            </div>
          </Card>

          <Card title="Theme Colors">
            <p className={`text-text-muted ${styles.paragraph}`}>
              Use the theme controls in the header to change both mode (Light/Dark) and color scheme.
            </p>
          </Card>

          <Card title="Features">
            <ul className={`list-disc list-inside text-text-muted ${styles.list}`}>
              {content.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </Card>
        </div>
      </main>
    </div>
  )
}
