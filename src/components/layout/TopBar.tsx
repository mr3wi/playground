import { Moon, Sun, Copy, RotateCcw } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useLocation } from 'react-router-dom'
import { PANEL_ROUTES } from '@/lib/panelRoutes'

export interface TopBarProps {
  onCopySnippet?: () => void
  onReset?: () => void
  extra?: React.ReactNode
}

/** Panel title bar with theme toggle, copy, and reset actions. */
export function TopBar({ onCopySnippet, onReset, extra }: TopBarProps) {
  const { toggleTheme, isDark } = useTheme()
  const location = useLocation()
  const panel = PANEL_ROUTES.find((p) => location.pathname.startsWith(p.path))

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-panel px-4 dark:border-border-dark dark:bg-panel-dark">
      <h1 className="text-sm font-semibold tracking-tight">{panel?.label ?? 'Playground'}</h1>
      <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 dark:border-border-dark">
        {extra}
        {onCopySnippet && (
          <button
            type="button"
            onClick={onCopySnippet}
            className="rounded-md p-2 text-muted hover:bg-primary/10 hover:text-primary"
            aria-label="Copy panel output"
            title="Copy snippet (⌘⇧C)"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-md p-2 text-muted hover:bg-surface hover:text-gray-900 dark:hover:bg-surface-dark dark:hover:text-gray-100"
            aria-label="Reset panel to defaults"
            title="Reset (R)"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-md p-2 text-muted hover:bg-surface hover:text-gray-900 dark:hover:bg-surface-dark dark:hover:text-gray-100"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  )
}
