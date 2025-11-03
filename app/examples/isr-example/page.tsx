// This page uses ISR (Incremental Static Regeneration)
// Statically generated, but revalidated every 60 seconds

import styles from '../page.module.css'

export const metadata = {
  title: 'ISR Example',
  description: 'This page uses Incremental Static Regeneration',
}

// ISR: Revalidate every 60 seconds
// After 60 seconds, the next request will trigger a regeneration
// The page will continue to be served statically until regeneration completes
export const revalidate = 60

async function getData() {
  // Simulate API call
  // In real app, fetch from your API
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    // Cache the fetch for the revalidate period
    next: { revalidate: 60 }
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  
  return res.json()
}

export default async function ISRExample() {
  const data = await getData()
  const timestamp = new Date().toISOString()

  return (
    <div className={`container ${styles.container}`}>
      <h1 className={styles.title}>ISR Example Page</h1>
      <div className={styles.content}>
        <div className="card">
          <p className={styles.paragraph}>
            <strong>Rendering Strategy:</strong> Incremental Static Regeneration (ISR)
          </p>
          <p className={styles.paragraph}>
            <strong>Revalidate interval:</strong> 60 seconds
          </p>
          <p className={styles.paragraph}>
            <strong>Page rendered at:</strong> {timestamp}
          </p>
          <p className={`text-text-muted ${styles.paragraph}`}>
            This page is statically generated but automatically regenerates every 60 seconds
            in the background. Users get fast static pages while content stays fresh.
          </p>
        </div>

        <div className="card">
          <h2 className={styles.heading}>{data.title}</h2>
          <p className={`text-text-muted ${styles.paragraph}`}>{data.body}</p>
        </div>
      </div>
    </div>
  )
}
