# Next.js + TypeScript Template

A modern Next.js template with TypeScript, Zustand state management, theme switching, and internationalization support.

## Features

- ⚡️ Next.js 14 with App Router
- 📘 TypeScript
- 🗄️ Zustand for state management
- 🎨 Theme switching (Light/Dark/System)
- 🌍 Multi-language support (i18n)
- 💅 Tailwind CSS for styling
- 🚀 Vercel deployment ready

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utility functions (i18n, theme)
├── store/           # Zustand stores
├── styles/          # Global styles
└── public/          # Static assets
```

## State Management

The project uses Zustand for state management with two main stores:

- **Theme Store** (`store/themeStore.ts`): Manages theme state (light/dark/system)
- **Language Store** (`store/languageStore.ts`): Manages language preference

## Theme System

The theme system supports:
- Light mode
- Dark mode
- System preference (automatically follows OS settings)

Theme preferences are persisted in localStorage.

## Internationalization

The i18n system supports multiple languages:
- English (en)
- Chinese (zh)
- Spanish (es)
- French (fr)

You can extend the translations in `lib/i18n.ts`.

## Rendering Strategy

This project uses **SSG + ISR** (Static Site Generation + Incremental Static Regeneration) by default, which provides:

- ⚡️ Best performance (static HTML from CDN)
- 💰 Lower server costs
- 🔍 Better SEO
- ✨ Works perfectly with client-side state (Zustand)

See example pages at:
- `/examples/ssg-example` - Pure SSG
- `/examples/isr-example` - SSG with ISR
- `/examples/ssr-example` - SSR (when needed)

For more details, see [docs/RENDERING_STRATEGY.md](docs/RENDERING_STRATEGY.md)

## Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect the Next.js project and deploy it

The SSG strategy means your site will be fast and cost-effective on Vercel!

## License

MIT
