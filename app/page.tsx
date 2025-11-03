'use client'

import { Header, Card, Button, ColorPreview } from '@/components'
import { useTranslation } from '@/hooks'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <div className="space-y-6">
          <Card title={t('welcome')}>
            <p className="text-text-muted mb-4">
              This is a Next.js template with TypeScript, Zustand state management,
              theme switching, and internationalization support.
            </p>
            <div className="flex gap-2">
              <Button variant="primary">Primary Button</Button>
              <Button variant="default">Default Button</Button>
            </div>
          </Card>

          <Card title="Theme Colors">
            <p className="text-text-muted mb-4">
              Click on a color to change the theme color scheme:
            </p>
            <ColorPreview />
            <p className="text-sm text-text-muted mt-4">
              You can also use the theme controls in the header to change both mode (Light/Dark/System) and color scheme.
            </p>
          </Card>

          <Card title="Features">
            <ul className="list-disc list-inside space-y-2 text-text-muted">
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
            <p className="text-text-muted mb-4">
              This project uses SSG + ISR by default. Check out these examples:
            </p>
            <div className="flex gap-2 flex-wrap">
              <a href="/examples/ssg-example" className="btn">SSG Example</a>
              <a href="/examples/isr-example" className="btn">ISR Example</a>
              <a href="/examples/ssr-example" className="btn">SSR Example</a>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
