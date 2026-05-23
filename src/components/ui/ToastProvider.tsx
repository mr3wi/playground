import * as Toast from '@radix-ui/react-toast'
import { useEffect } from 'react'
import { usePlaygroundStore } from '@/store/usePlaygroundStore'

/** Bottom-right toast notifications for copy/reset actions. */
export function ToastProvider() {
  const message = usePlaygroundStore((s) => s.toastMessage)
  const clearToast = usePlaygroundStore((s) => s.clearToast)

  useEffect(() => {
    if (!message) return
    const t = setTimeout(clearToast, 2000)
    return () => clearTimeout(t)
  }, [message, clearToast])

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={!!message}
        onOpenChange={(open) => !open && clearToast()}
        className="rounded-lg border border-border bg-surface px-4 py-3 shadow-lg dark:border-border-dark dark:bg-panel-dark"
      >
        <Toast.Title className="text-sm font-medium">{message}</Toast.Title>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2" />
    </Toast.Provider>
  )
}
