'use client'

import ThemeSelector from './ThemeSelector'
import LanguageToggle from './LanguageToggle'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.title}>Next.js Template</h1>
        <div className={styles.controls}>
          <ThemeSelector />
          <LanguageToggle />
        </div>
      </div>
    </header>
  )
}
