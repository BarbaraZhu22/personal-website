// This page uses SSR (Server-Side Rendering)
// Rendered on each request - use only when necessary!

import styles from '../page.module.css'

export const metadata = {
  title: 'SSR Example',
  description: 'This page uses Server-Side Rendering',
}

// Force SSR - renders on every request
export const dynamic = 'force-dynamic'

async function getServerData() {
  // This runs on every request
  // Use for user-specific data, authentication, etc.
  const timestamp = new Date().toISOString()
  
  // Simulate server-only data fetching
  // In real app: database queries, API calls with auth, etc.
  
  return {
    timestamp,
    serverTime: new Date().toLocaleTimeString(),
  }
}

export default async function SSRExample() {
  const data = await getServerData()

  return (
    <div className={`container ${styles.container}`}>
      <h1 className={styles.title}>SSR Example Page</h1>
      <div className="card">
        <p className={styles.paragraph}>
          <strong>Rendering Strategy:</strong> Server-Side Rendering (SSR)
        </p>
        <p className={styles.paragraph}>
          <strong>Rendered at:</strong> {data.timestamp}
        </p>
        <p className={styles.paragraph}>
          <strong>Server time:</strong> {data.serverTime}
        </p>
        <div className={`bg-muted rounded ${styles.warningBox}`}>
          <p className={styles.warningTitle}>⚠️ When to use SSR:</p>
          <ul className={`list-disc list-inside text-text-muted ${styles.warningList}`}>
            <li>User-specific content (dashboards, profiles)</li>
            <li>Real-time data that changes per request</li>
            <li>Content requiring authentication checks</li>
            <li>Pages with cookies/session data</li>
          </ul>
          <p className={`text-text-muted ${styles.warningText}`}>
            <strong>Note:</strong> SSR is slower and costs more. Use SSG/ISR when possible!
          </p>
        </div>
      </div>
    </div>
  )
}
