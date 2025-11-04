'use client'

import { Card } from '@/components'
import { contactContent } from '@/content'
import { useState } from 'react'
import styles from './page.module.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className={`container ${styles.container} page-enter`}>
      <div className={styles.header}>
        <h1 className={styles.title}>{contactContent.title}</h1>
        <p className={styles.subtitle}>{contactContent.subtitle}</p>
      </div>

      <div className={styles.content}>
        <Card className={`${styles.contactCard} hover-lift transition-all`}>
          <div className={styles.contactInfo}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email:</span>
              <a 
                href={`mailto:${contactContent.email}`}
                className={`${styles.infoValue} hover-color transition-colors`}
              >
                {contactContent.email}
              </a>
            </div>
            <div className={styles.social}>
              <h3 className={styles.socialTitle}>Connect with me:</h3>
              <div className={styles.socialLinks}>
                {contactContent.social.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.socialLink} hover-scale transition-transform`}
                    title={social.name}
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className={`${styles.formCard} hover-lift transition-all`}>
          <h2 className={styles.sectionTitle}>Send a Message</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`${styles.input} focus-ring transition-all`}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.input} focus-ring transition-all`}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className={`${styles.textarea} focus-ring transition-all`}
                required
              />
            </div>
            <button
              type="submit"
              className={`${styles.submitButton} btn-interactive transition-all`}
            >
              {submitted ? 'Message Sent!' : 'Send Message'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  )
}

