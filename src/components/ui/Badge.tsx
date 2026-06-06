import type { ReactNode } from 'react'

export interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'muted'
  className?: string
}

const variants = {
  default: 'bg-primary/10 text-primary dark:bg-primary/20',
  success: 'bg-accent/10 text-accent dark:text-accent',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  muted: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

/** Metric (default), status (success/error/warning), or meta (muted) chip. */
export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium font-mono ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
