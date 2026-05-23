import { useEffect } from 'react'
import { usePlaygroundStore } from '@/store/usePlaygroundStore'

const STORAGE_KEY = 'playground-theme'

/** Persists theme to localStorage and toggles `dark` class on `<html>`. */
export function useTheme() {
  const theme = usePlaygroundStore((s) => s.theme)
  const setTheme = usePlaygroundStore((s) => s.setTheme)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
    }
  }, [setTheme])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' }
}
