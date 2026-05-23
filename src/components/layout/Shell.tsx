import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { usePlaygroundStore } from '@/store/usePlaygroundStore';
import { PANEL_ROUTES } from '@/lib/panelRoutes';
import { NavLink } from 'react-router-dom';

export interface ShellProps {
  children?: React.ReactNode;
}

/** Two-column layout: sidebar + main panel area. */
export function Shell({ children }: ShellProps) {
  const sidebarCollapsed = usePlaygroundStore((s) => s.sidebarCollapsed);

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="hidden md:flex">
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="flex shrink-0 overflow-x-auto border-t border-border bg-panel md:hidden dark:border-border-dark dark:bg-panel-dark"
        aria-label="Mobile panel navigation"
      >
        {PANEL_ROUTES.slice(0, 5).map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex-1 px-2 py-2 text-center text-xs ${isActive ? 'text-primary font-medium' : 'text-gray-500'}`
            }
          >
            {item.label.split(' ')[0]}
          </NavLink>
        ))}
      </nav>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children ?? <Outlet />}</main>
    </div>
  );
}
