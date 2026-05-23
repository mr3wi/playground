import * as Dialog from '@radix-ui/react-dialog'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PANEL_ROUTES } from '@/lib/panelRoutes'
import { usePlaygroundStore } from '@/store/usePlaygroundStore'

const SEARCH_ITEMS = [
  ...PANEL_ROUTES.map((p) => ({ type: 'panel' as const, label: p.label, path: p.path })),
  { type: 'control' as const, label: 'Stiffness', path: '/spring' },
  { type: 'control' as const, label: 'Damping', path: '/spring' },
  { type: 'control' as const, label: 'Ease preset', path: '/easing' },
  { type: 'control' as const, label: 'Primary color', path: '/tokens' },
  { type: 'control' as const, label: 'Contrast checker', path: '/a11y' },
  { type: 'control' as const, label: 'FPS monitor', path: '/performance' },
]

export interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Fuzzy-search command palette (⌘K) for panels and controls. */
export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const showToast = usePlaygroundStore((s) => s.showToast)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SEARCH_ITEMS
    return SEARCH_ITEMS.filter((item) => item.label.toLowerCase().includes(q))
  }, [query])

  const select = (path: string, label: string) => {
    navigate(path)
    onOpenChange(false)
    setQuery('')
    showToast(`Navigated to ${label}`)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-[20%] z-50 w-full max-w-md -translate-x-1/2 rounded-xl border border-border bg-surface p-2 shadow-2xl dark:border-border-dark dark:bg-panel-dark">
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <input
            type="search"
            placeholder="Search panels and controls…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary dark:border-border-dark dark:bg-surface-dark"
            autoFocus
          />
          <ul className="mt-2 max-h-64 overflow-y-auto">
            {results.map((item) => (
              <li key={`${item.path}-${item.label}`}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-panel dark:hover:bg-gray-800"
                  onClick={() => select(item.path, item.label)}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-gray-400">{item.type}</span>
                </button>
              </li>
            ))}
            {results.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-gray-500">No results</li>
            )}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
