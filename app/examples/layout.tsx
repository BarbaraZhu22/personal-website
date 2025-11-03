import Link from 'next/link'
import styles from './layout.module.css'

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <nav className={styles.nav}>
        <div className={`container ${styles.container}`}>
          <Link href="/" className={`text-primary hover:underline ${styles.backLink}`}>
            ← Back to Home
          </Link>
          <div className={styles.links}>
            <Link href="/examples/isr-example" className={`hover:underline ${styles.link}`}>
              ISR Example
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
