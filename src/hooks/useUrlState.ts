import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

/** Debounced URL search param sync for panel state. */
export function useUrlState(
  panelKey: string,
  values: Record<string, string | number | boolean>,
  onRestore: (parsed: Record<string, string>) => void,
) {
  const [searchParams, setSearchParams] = useSearchParams()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const restored: Record<string, string> = {}
    searchParams.forEach((v, k) => {
      if (k.startsWith(`${panelKey}.`)) {
        restored[k.slice(panelKey.length + 1)] = v
      }
    })
    if (Object.keys(restored).length > 0) onRestore(restored)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      Object.entries(values).forEach(([k, v]) => {
        next.set(`${panelKey}.${k}`, String(v))
      })
      setSearchParams(next, { replace: true })
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [panelKey, values, searchParams, setSearchParams])
}
