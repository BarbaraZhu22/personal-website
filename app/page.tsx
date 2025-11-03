'use client'

import { Header } from '@/layouts'
import { Card, Button, ColorPreview } from '@/components'
import { useTranslation } from '@/hooks'
import styles from './page.module.css'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen">
      <Header />
      <main className={`container ${styles.main}`}>
        <div className={styles.content}>
          <Card title={t('welcome')}>
            <p className={`text-text-muted ${styles.paragraph}`}>
              This is a Next.js template with TypeScript, Zustand state management,
              theme switching, and internationalization support.
            </p>
            <div className={styles.buttonGroup}>
              <Button variant="primary" className={styles.button}>Primary Button</Button>
              <Button variant="default" className={styles.button}>Default Button</Button>
            </div>
          </Card>

          <Card title="Theme Colors">
            <p className={`text-text-muted ${styles.paragraph}`}>
              Click on a color to change the theme color scheme:
            </p>
            <ColorPreview />
            <p className={`text-text-muted ${styles.paragraphSmall}`}>
              You can also use the theme controls in the header to change both mode (Light/Dark/System) and color scheme.
            </p>
          </Card>

          <Card title="Features">
            <ul className={`list-disc list-inside text-text-muted ${styles.list}`}>
              <li>Next.js 14 with App Router</li>
              <li>TypeScript support</li>
              <li>Zustand for state management</li>
              <li>Multiple color themes (Blue, Green, Purple, Orange, Pink, Indigo)</li>
              <li>Theme switching (Light/Dark/System)</li>
              <li>Multi-language support (i18n)</li>
              <li>Tailwind CSS for styling</li>
              <li>SSG + ISR rendering strategy</li>
              <li>Vercel deployment ready</li>
            </ul>
          </Card>

          <Card title="Rendering Examples">
            <p className={`text-text-muted ${styles.paragraph}`}>
              This project uses SSG + ISR by default. Check out the example:
            </p>
            <div className={styles.buttonGroup}>
              <a href="/examples/isr-example" className={`btn ${styles.buttonLink}`}>ISR Example</a>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
