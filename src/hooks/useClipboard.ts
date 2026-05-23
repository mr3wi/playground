import { useCallback, useState } from 'react'
import { usePlaygroundStore } from '@/store/usePlaygroundStore'

/** Copy text to clipboard with toast feedback and temporary "copied" state. */
export function useClipboard() {
  const [copied, setCopied] = useState(false)
  const showToast = usePlaygroundStore((s) => s.showToast)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        showToast('Copied to clipboard')
        setTimeout(() => setCopied(false), 1500)
        return true
      } catch {
        showToast('Failed to copy')
        return false
      }
    },
    [showToast],
  )

  return { copy, copied }
}
