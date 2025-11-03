/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize for SSG/ISR by default
  // Pages are static by default in App Router
  // Use ISR when needed: export const revalidate = 3600 in page files
  // Force SSR only when needed: export const dynamic = 'force-dynamic'
}

module.exports = nextConfig
