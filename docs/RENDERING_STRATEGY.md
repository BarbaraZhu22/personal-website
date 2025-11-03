# Rendering Strategy: SSG + ISR

## Current Architecture

This project uses **Static Site Generation (SSG) + Incremental Static Regeneration (ISR)** as the default rendering strategy, which is optimal for:

- ✅ Better performance (static files served from CDN)
- ✅ Lower server costs
- ✅ Better SEO
- ✅ Works perfectly with client-side state (Zustand)
- ✅ Fast page loads

## How It Works

### App Router Default Behavior

In Next.js 14 App Router:
- Pages are **SSG by default** (static at build time)
- Server Components render on the server and are pre-rendered
- Client Components (`'use client'`) are hydrated on the client
- This hybrid approach gives you the best of both worlds

### When to Use ISR

Use ISR when you have pages that need periodic updates:

```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 3600 // Revalidate every hour

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetch(`https://api.example.com/posts/${params.slug}`).then(r => r.json())
  return <article>{post.content}</article>
}
```

### When to Use SSR

Only use SSR when you need:

1. **User-specific content**:
```typescript
import { cookies } from 'next/headers'

export default async function UserDashboard() {
  const cookieStore = cookies()
  const session = cookieStore.get('session')
  // Fetch user-specific data
  return <div>Welcome, {session.user.name}</div>
}
```

2. **Dynamic routes that change frequently**:
```typescript
// Force SSR by using dynamic functions
export const dynamic = 'force-dynamic'
```

## Best Practices for This Project

1. **Keep static content in Server Components** (default)
2. **Use Client Components only for interactivity** (`'use client'`)
3. **Use ISR for content that changes occasionally**
4. **Use SSR only when absolutely necessary**

## Performance Comparison

| Strategy | First Load | Subsequent Loads | Build Time | Server Cost |
|----------|------------|------------------|-------------|-------------|
| SSG      | Fast ⚡    | Very Fast ⚡⚡    | Longer      | None 💰     |
| SSG+ISR  | Fast ⚡    | Very Fast ⚡⚡    | Shorter     | Low 💰💰    |
| SSR      | Slow 🐌   | Slow 🐌         | Fast        | High 💰💰💰 |
