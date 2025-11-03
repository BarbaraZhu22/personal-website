// This page uses SSR (Server-Side Rendering)
// Rendered on each request - use only when necessary!

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
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">SSR Example Page</h1>
      <div className="card">
        <p className="mb-2">
          <strong>Rendering Strategy:</strong> Server-Side Rendering (SSR)
        </p>
        <p className="mb-2">
          <strong>Rendered at:</strong> {data.timestamp}
        </p>
        <p className="mb-2">
          <strong>Server time:</strong> {data.serverTime}
        </p>
        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm font-semibold mb-2">⚠️ When to use SSR:</p>
          <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
            <li>User-specific content (dashboards, profiles)</li>
            <li>Real-time data that changes per request</li>
            <li>Content requiring authentication checks</li>
            <li>Pages with cookies/session data</li>
          </ul>
          <p className="text-sm text-text-muted mt-2">
            <strong>Note:</strong> SSR is slower and costs more. Use SSG/ISR when possible!
          </p>
        </div>
      </div>
    </div>
  )
}
