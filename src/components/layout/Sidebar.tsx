import { NavLink } from 'react-router-dom'
import { PANEL_ROUTES } from '@/lib/panelRoutes'
import { Badge } from '@/components/ui/Badge'
import { Tooltip } from '@/components/ui/Tooltip'
import { usePlaygroundStore } from '@/store/usePlaygroundStore'

export interface SidebarProps {
  collapsed?: boolean
}

/** Left navigation with keyboard shortcut badges. */
export function Sidebar({ collapsed = false }: SidebarProps) {
  const sidebarCollapsed = usePlaygroundStore((s) => s.sidebarCollapsed)
  const isCollapsed = collapsed || sidebarCollapsed

  return (
    <nav
      className={`flex h-full shrink-0 flex-col border-r border-border bg-panel dark:border-border-dark dark:bg-panel-dark ${
        isCollapsed ? 'w-14' : 'w-[220px]'
      }`}
      aria-label="Panel navigation"
    >
      <div className="flex flex-col gap-0.5 border-b border-border px-3 py-3.5 dark:border-border-dark">
        {!isCollapsed ? (
          <>
            <span className="text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Frontend Playground
            </span>
            <span className="text-[11px] text-muted">Interaction panels</span>
          </>
        ) : (
          <span className="text-center font-mono text-xs font-semibold text-primary" title="Frontend Playground">
            FP
          </span>
        )}
      </div>
      <ul className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {PANEL_ROUTES.map((item) => (
          <li key={item.id}>
            <Tooltip content={`⌘${item.shortcut}`} side="right">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-2 rounded-lg py-2 text-sm transition-colors ${
                    isActive
                      ? 'border-l-2 border-primary bg-primary/10 pl-[calc(0.625rem-2px)] font-medium text-primary ring-1 ring-inset ring-primary/40'
                      : 'border-l-2 border-transparent px-2.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/80'
                  } ${isCollapsed ? 'justify-center border-l-0 px-2' : 'pr-2.5'}`
                }
              >
                {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                {isCollapsed && (
                  <span className="text-xs font-mono">{item.shortcut}</span>
                )}
                {!isCollapsed && (
                  <Badge
                    variant="muted"
                    className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    ⌘{item.shortcut}
                  </Badge>
                )}
              </NavLink>
            </Tooltip>
          </li>
        ))}
      </ul>
    </nav>
  )
}
