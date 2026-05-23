import { useEffect, useRef, useState } from 'react'

export interface FocusOrderVisualizerProps {
  showOrder: boolean
  onToggle: (v: boolean) => void
}

/** Mini-form with numbered focus order badges. */
export function FocusOrderVisualizer({ showOrder, onToggle }: FocusOrderVisualizerProps) {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])
  const order = ['name', 'email', 'password', 'submit', 'cancel']

  useEffect(() => {
    const onFocusIn = () => {
      const idx = refs.current.findIndex((el) => el === document.activeElement)
      if (idx >= 0) setFocusedIndex(idx)
    }
    document.addEventListener('focusin', onFocusIn)
    return () => document.removeEventListener('focusin', onFocusIn)
  }, [])

  const violations: string[] = []
  if (showOrder && focusedIndex > 2) {
    violations.push('Tab order may not match visual layout after password field')
  }

  return (
    <section className="space-y-4 rounded-lg border border-border p-4 dark:border-border-dark">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Focus order</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showOrder} onChange={(e) => onToggle(e.target.checked)} />
          Show focus order
        </label>
      </div>
      <form className="relative max-w-sm space-y-3" onSubmit={(e) => e.preventDefault()}>
        {order.map((id, i) => (
          <div key={id} className="relative">
            {showOrder && (
              <span
                className={`absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
                  focusedIndex === i ? 'bg-primary scale-110' : 'bg-gray-500'
                }`}
              >
                {i + 1}
              </span>
            )}
            {id === 'cancel' ? (
              <a
                href="#"
                ref={(el) => {
                  refs.current[i] = el
                }}
                className="text-sm text-primary underline"
                onClick={(e) => e.preventDefault()}
              >
                Cancel
              </a>
            ) : (
              <input
                ref={(el) => {
                  refs.current[i] = el
                }}
                type={id === 'password' ? 'password' : id === 'email' ? 'email' : 'text'}
                placeholder={id.charAt(0).toUpperCase() + id.slice(1)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm dark:border-border-dark"
              />
            )}
          </div>
        ))}
        <button type="submit" ref={(el) => { refs.current[3] = el }} className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
          Submit
        </button>
      </form>
      {violations.length > 0 && (
        <ul className="text-sm text-amber-600 dark:text-amber-400">
          {violations.map((v) => (
            <li key={v}>⚠ {v}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
