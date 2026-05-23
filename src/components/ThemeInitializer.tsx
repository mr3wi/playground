import { useTheme } from '@/hooks/useTheme'

/** Applies persisted theme on mount. */
export function ThemeInitializer() {
  useTheme()
  return null
}
