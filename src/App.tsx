import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Shell } from '@/components/layout/Shell'
import { CommandPalette } from '@/components/CommandPalette'
import { ToastProvider } from '@/components/ui/ToastProvider'
import { ThemeInitializer } from '@/components/ThemeInitializer'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { usePlaygroundStore } from '@/store/usePlaygroundStore'
import { PANEL_ROUTES } from '@/lib/panelRoutes'

const SpringPanel = lazy(() => import('@/panels/spring/SpringPanel'))
const EasingPanel = lazy(() => import('@/panels/easing/EasingPanel'))
const TokenPanel = lazy(() => import('@/panels/tokens/TokenPanel'))
const StatesPanel = lazy(() => import('@/panels/states/StatesPanel'))
const GesturesPanel = lazy(() => import('@/panels/gestures/GesturesPanel'))
const A11yPanel = lazy(() => import('@/panels/accessibility/A11yPanel'))
const PerfPanel = lazy(() => import('@/panels/performance/PerfPanel'))

function PanelFallback() {
  return (
    <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
      Loading panel…
    </div>
  )
}

function GlobalShortcuts() {
  const navigate = useNavigate()
  const toggleSidebar = usePlaygroundStore((s) => s.toggleSidebar)
  const setCodePanelOpen = usePlaygroundStore((s) => s.setCodePanelOpen)
  const codePanelOpen = usePlaygroundStore((s) => s.codePanelOpen)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const panelShortcuts = PANEL_ROUTES.map((p, i) => ({
    key: String(i + 1),
    meta: true,
    handler: () => navigate(p.path),
  }))

  useKeyboardShortcut([
    ...panelShortcuts,
    { key: 'b', meta: true, handler: () => toggleSidebar() },
    { key: 'k', meta: true, handler: () => setPaletteOpen(true) },
    { key: '/', meta: true, handler: () => setCodePanelOpen(!codePanelOpen) },
  ])

  return <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/spring" replace />} />
      <Route
        path="/spring"
        element={
          <Suspense fallback={<PanelFallback />}>
            <SpringPanel />
          </Suspense>
        }
      />
      <Route
        path="/easing"
        element={
          <Suspense fallback={<PanelFallback />}>
            <EasingPanel />
          </Suspense>
        }
      />
      <Route
        path="/tokens"
        element={
          <Suspense fallback={<PanelFallback />}>
            <TokenPanel />
          </Suspense>
        }
      />
      <Route
        path="/states"
        element={
          <Suspense fallback={<PanelFallback />}>
            <StatesPanel />
          </Suspense>
        }
      />
      <Route
        path="/gestures"
        element={
          <Suspense fallback={<PanelFallback />}>
            <GesturesPanel />
          </Suspense>
        }
      />
      <Route
        path="/a11y"
        element={
          <Suspense fallback={<PanelFallback />}>
            <A11yPanel />
          </Suspense>
        }
      />
      <Route
        path="/performance"
        element={
          <Suspense fallback={<PanelFallback />}>
            <PerfPanel />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/spring" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeInitializer />
      <Shell>
        <GlobalShortcuts />
        <AppRoutes />
      </Shell>
      <ToastProvider />
    </BrowserRouter>
  )
}
