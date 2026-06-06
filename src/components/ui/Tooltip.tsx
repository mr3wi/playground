import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'

export interface TooltipProps {
  children: ReactNode
  content: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}

/** Radix-based accessible tooltip (requires TooltipProvider in app root). */
export function Tooltip({ children, content, side = 'top' }: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className="z-50 rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg dark:bg-gray-100 dark:text-gray-900"
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-gray-900 dark:fill-gray-100" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}

/** App-level tooltip provider — mount once near the root. */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <TooltipPrimitive.Provider delayDuration={200} skipDelayDuration={0}>
      {children}
    </TooltipPrimitive.Provider>
  )
}
