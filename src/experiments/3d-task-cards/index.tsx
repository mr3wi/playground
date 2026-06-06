import { Suspense, useCallback, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ControlPanel } from './ControlPanel'
import { Scene } from './Scene'
import { tasks } from './data/tasks'
import { DEFAULT_SETTINGS, type DragState, type ExperimentSettings } from './types'

/** Main entry: full-viewport canvas + glassmorphic control panel. */
export default function TaskCards3DExperiment() {
  const [settings, setSettings] = useState<ExperimentSettings>(DEFAULT_SETTINGS)
  const [order, setOrder] = useState(() => tasks.map((t) => t.id))
  const [dragState, setDragState] = useState<DragState>({
    taskId: null,
    offsetX: 0,
    pointerX: 0,
  })

  const handleSettingsChange = useCallback((patch: Partial<ExperimentSettings>) => {
    setSettings((prev) => ({
      geometry: { ...prev.geometry, ...patch.geometry },
      layout: { ...prev.layout, ...patch.layout },
      animation: { ...prev.animation, ...patch.animation },
      lighting: { ...prev.lighting, ...patch.lighting },
    }))
  }, [])

  return (
    <div className="relative h-full min-h-0 flex-1 bg-[#050508]">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        className="touch-none"
      >
        <Suspense fallback={null}>
          <Scene
            tasks={tasks}
            settings={settings}
            order={order}
            onReorder={setOrder}
            dragState={dragState}
            setDragState={setDragState}
          />
        </Suspense>
      </Canvas>

      <ControlPanel
        settings={settings}
        onChange={handleSettingsChange}
        onReset={() => setSettings(DEFAULT_SETTINGS)}
      />

      <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/45 backdrop-blur-md">
        Drag cards to reorder · Hover for glow · Idle barrel scroll
      </div>
    </div>
  )
}
