import Link from 'next/link'

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-border bg-muted/50">
        <div className="container py-4">
          <Link href="/" className="text-primary hover:underline mr-4">
            ← Back to Home
          </Link>
          <div className="mt-2 flex gap-4">
            <Link href="/examples/ssg-example" className="text-sm hover:underline">
              SSG Example
            </Link>
            <Link href="/examples/isr-example" className="text-sm hover:underline">
              ISR Example
            </Link>
            <Link href="/examples/ssr-example" className="text-sm hover:underline">
              SSR Example
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
