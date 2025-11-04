'use client'

import TopBar from './TopBar'
import styles from './Header.module.css'

export default function Header() {
  return (
    <>
      <TopBar />
      <header className={styles.header}>
        <div className={`container ${styles.container}`}>
          <h1 className={styles.title}>Next.js Template</h1>
        </div>
      </header>
    </>
  )
}

