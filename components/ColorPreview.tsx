'use client'

import { useThemeStore } from '@/store'
import { colorSchemes, ColorScheme } from '@/lib/themes'

export default function ColorPreview() {
  const { colorScheme, setColorScheme } = useThemeStore()

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(colorSchemes).map(([key, scheme]) => {
        const isActive = key === colorScheme
        return (
          <button
            key={key}
            onClick={() => setColorScheme(key as ColorScheme)}
            className={`
              w-10 h-10 rounded-full border-2 transition-all
              ${isActive ? 'border-foreground scale-110 ring-2 ring-primary' : 'border-transparent hover:scale-105'}
            `}
            style={{
              backgroundColor: scheme.light,
            }}
            title={scheme.name}
            aria-label={`Select ${scheme.name} theme`}
          />
        )
      })}
    </div>
  )
}
