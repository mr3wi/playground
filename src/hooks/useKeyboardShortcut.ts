import { useEffect } from 'react'

export interface ShortcutConfig {
  key: string
  meta?: boolean
  shift?: boolean
  alt?: boolean
  handler: (e: KeyboardEvent) => void
  preventDefault?: boolean
}

/** Registers global keyboard shortcuts (meta = ⌘ on Mac, Ctrl on Windows/Linux). */
export function useKeyboardShortcut(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      for (const s of shortcuts) {
        const meta = s.meta ?? false
        const shift = s.shift ?? false
        const alt = s.alt ?? false
        const metaKey = e.metaKey || e.ctrlKey

        if (
          e.key.toLowerCase() === s.key.toLowerCase() &&
          metaKey === meta &&
          e.shiftKey === shift &&
          e.altKey === alt
        ) {
          if (s.preventDefault !== false) e.preventDefault()
          s.handler(e)
          return
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [shortcuts])
}
