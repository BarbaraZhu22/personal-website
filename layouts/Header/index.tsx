'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks'
import TopBar from './TopBar'
import styles from './Header.module.css'

export default function Header() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/work', label: t('work') },
    { href: '/contact', label: t('contact') },
  ]

  return (
    <>
      <TopBar />
      <header className={styles.header}>
        <div className={`container ${styles.container}`}>
          <nav className={styles.nav}>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                >
                  <span className={styles.navLinkText}>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </header>
    </>
  )
}

