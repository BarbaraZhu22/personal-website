'use client'

import { useLanguageStore } from '@/store'
import { t } from '@/lib/i18n'
import styles from './Footer.module.css'

const currentYear = new Date().getFullYear()

export default function Footer() {
  const { language } = useLanguageStore()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <p className={styles.copyright}>
            © {currentYear} {t('yourName', language) || 'Frontend Developer'}. {t('rightsReserved', language) || 'All rights reserved.'}
          </p>
          <div className={styles.links}>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.link} hover-color transition-colors`}
            >
              GitHub
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.link} hover-color transition-colors`}
            >
              LinkedIn
            </a>
            <a 
              href="/contact"
              className={`${styles.link} hover-color transition-colors`}
            >
              {t('contact', language) || 'Contact'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

