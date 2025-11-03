// This page is SSG by default (Static Site Generation)
// Generated at build time, served as static HTML

export const metadata = {
  title: 'SSG Example',
  description: 'This page is statically generated at build time',
}

// Optional: Add ISR (Incremental Static Regeneration)
// Uncomment to revalidate this page every hour
// export const revalidate = 3600

export default function SSGExample() {
  // This runs at build time, not on each request
  const buildTime = new Date().toISOString()

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">SSG Example Page</h1>
      <div className="card">
        <p className="mb-2">
          <strong>Rendering Strategy:</strong> Static Site Generation (SSG)
        </p>
        <p className="mb-2">
          <strong>Generated at:</strong> {buildTime}
        </p>
        <p className="text-text-muted">
          This page was pre-rendered at build time and served as static HTML.
          It&apos;s fast, SEO-friendly, and works perfectly with client-side state.
        </p>
      </div>
    </div>
  )
}
