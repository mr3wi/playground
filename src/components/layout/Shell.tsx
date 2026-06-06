import { Outlet, NavLink } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { usePlaygroundStore } from '@/store/usePlaygroundStore';
import { PANEL_ROUTES, type PanelId } from '@/lib/panelRoutes';

const MOBILE_TAB_LABELS: Record<PanelId, string> = {
  spring: 'Spring',
  easing: 'Easing',
  tokens: 'Token',
  states: 'State',
  gestures: 'Gesture',
  a11y: 'A11y',
  performance: 'Perf',
};

const MOBILE_TAB_ICONS: Record<PanelId, string> = {
  spring: 'S',
  easing: 'E',
  tokens: 'T',
  states: 'St',
  gestures: 'G',
  a11y: 'A',
  performance: 'P',
};

export interface ShellProps {
  children?: React.ReactNode;
}

/** Two-column layout: sidebar + main panel area; bottom tabs on mobile. */
export function Shell({ children }: ShellProps) {
  const sidebarCollapsed = usePlaygroundStore((s) => s.sidebarCollapsed);

  return (
    <div className="flex h-dvh flex-col overflow-hidden md:flex-row">
      <div className="hidden h-full shrink-0 md:flex">
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      <main className="panel-accent-rail order-1 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-surface md:order-none dark:bg-surface-dark">
        <div className="flex min-h-0 flex-1 flex-col">{children ?? <Outlet />}</div>
      </main>

      <nav
        className="order-2 flex shrink-0 overflow-x-auto border-t border-border bg-panel/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_0_0_rgba(0,0,0,0.04)] backdrop-blur-sm md:hidden dark:border-border-dark dark:bg-panel-dark/95 dark:shadow-[0_-1px_0_0_rgba(255,255,255,0.06)]"
        aria-label="Mobile panel navigation"
      >
        {PANEL_ROUTES.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex min-h-11 min-w-[4.5rem] flex-1 flex-col items-center justify-center gap-0.5 border-t-2 px-2 py-2.5 text-xs transition-colors ${
                isActive
                  ? '-mt-px border-primary bg-primary/10 font-semibold text-primary'
                  : 'border-transparent text-muted'
              }`
            }
          >
            <span className="font-mono text-[10px] opacity-60" aria-hidden>
              {MOBILE_TAB_ICONS[item.id]}
            </span>
            {MOBILE_TAB_LABELS[item.id]}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
