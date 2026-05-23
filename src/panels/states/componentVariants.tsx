import type { ReactNode } from 'react'

export type ComponentType = 'button' | 'input' | 'badge' | 'card' | 'toggle' | 'select'

export interface StateDef {
  name: string
  selector: string
  props?: Record<string, string | boolean>
  className?: string
}

export const COMPONENT_STATES: StateDef[] = [
  { name: 'Default', selector: ':default' },
  { name: 'Hover', selector: ':hover', className: 'ring-2 ring-primary/30' },
  { name: 'Focus', selector: ':focus-visible', className: 'ring-2 ring-primary' },
  { name: 'Active', selector: ':active', className: 'scale-95 opacity-90' },
  { name: 'Disabled', selector: '[disabled]', props: { disabled: true } },
  { name: 'Loading', selector: '[aria-busy="true"]', props: { 'aria-busy': true } },
  { name: 'Error', selector: '[aria-invalid="true"]', props: { 'aria-invalid': true } },
  { name: 'Success', selector: '.success', className: 'border-accent text-accent' },
]

export function renderVariant(type: ComponentType, state: StateDef, interactive: boolean): ReactNode {
  const forcedClass = !interactive ? state.className ?? '' : ''
  const base = 'transition-all'

  switch (type) {
    case 'button':
      return (
        <button
          type="button"
          className={`${base} rounded-lg bg-primary px-4 py-2 text-sm text-white ${forcedClass}`}
          {...(state.props ?? {})}
        >
          Button
        </button>
      )
    case 'input':
      return (
        <input
          className={`${base} rounded-lg border border-border px-3 py-2 text-sm dark:border-border-dark ${forcedClass}`}
          placeholder="Email"
          {...(state.props ?? {})}
        />
      )
    case 'badge':
      return (
        <span className={`${base} rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary ${forcedClass}`}>
          Badge
        </span>
      )
    case 'card':
      return (
        <div className={`${base} rounded-lg border border-border p-4 dark:border-border-dark ${forcedClass}`}>
          <p className="font-medium">Card title</p>
          <p className="text-sm text-gray-500">Description</p>
        </div>
      )
    case 'toggle':
      return (
        <button
          type="button"
          role="switch"
          aria-checked={state.name === 'Active'}
          className={`${base} h-6 w-11 rounded-full bg-gray-300 dark:bg-gray-600 ${forcedClass}`}
          {...(state.props ?? {})}
        />
      )
    case 'select':
      return (
        <select className={`${base} rounded-lg border border-border px-3 py-2 text-sm dark:border-border-dark ${forcedClass}`} {...(state.props ?? {})}>
          <option>Option A</option>
        </select>
      )
    default:
      return null
  }
}
