'use client'

import ThemeSelector from './ThemeSelector'
import LanguageToggle from './LanguageToggle'

export default function Header() {
  return (
    <header className="border-b border-border py-4">
      <div className="container flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Next.js Template</h1>
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 w-full xl:w-auto">
          <ThemeSelector />
          <LanguageToggle />
        </div>
      </div>
    </header>
  )
}
