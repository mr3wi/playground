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
      className={`flex shrink-0 flex-col border-r border-border bg-panel dark:border-border-dark dark:bg-panel-dark ${
        isCollapsed ? 'w-14 md:w-14' : 'w-[220px]'
      }`}
      aria-label="Panel navigation"
    >
      <div className="border-b border-border px-3 py-3 dark:border-border-dark">
        {!isCollapsed && (
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Playground
          </span>
        )}
      </div>
      <ul className="flex-1 space-y-0.5 p-2">
        {PANEL_ROUTES.map((item) => (
          <li key={item.id}>
            <Tooltip content={`⌘${item.shortcut}`} side="right">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors ${
                    isActive
                      ? 'border-l-2 border-primary bg-primary/10 font-medium text-primary'
                      : 'border-l-2 border-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                {!isCollapsed && <span>{item.label}</span>}
                {isCollapsed && (
                  <span className="text-xs font-mono">{item.shortcut}</span>
                )}
                {!isCollapsed && (
                  <Badge variant="muted" className="ml-auto opacity-0 group-hover:opacity-100">
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
