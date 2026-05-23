import { useCallback, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { TopBar } from '@/components/layout/TopBar'
import { usePlaygroundStore } from '@/store/usePlaygroundStore'
import { useClipboard } from '@/hooks/useClipboard'
import { EventLogger, type LogEntry } from './EventLogger'

export default function GesturesPanel() {
  const { filter, setGestures, resetGestures } = usePlaygroundStore()
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [velocity, setVelocity] = useState(0)
  const [peakPressure, setPeakPressure] = useState(0)
  const [pointerType, setPointerType] = useState('mouse')
  const lastPos = useRef({ x: 0, y: 0, t: 0 })
  const { copy } = useClipboard()
  const areaRef = useRef<HTMLDivElement>(null)

  const log = useCallback((type: string, data: Record<string, unknown>) => {
    setEntries((prev) => {
      const next = [...prev, { id: crypto.randomUUID(), timestamp: Date.now(), type, data }]
      return next.slice(-50)
    })
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    setPointerType(e.pointerType)
    lastPos.current = { x: e.clientX, y: e.clientY, t: Date.now() }
    if (e.pressure) setPeakPressure((p) => Math.max(p, e.pressure))
    log('pointerdown', { x: e.clientX, y: e.clientY, pressure: e.pressure })
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const dt = (Date.now() - lastPos.current.t) / 1000
    const vx = ((e.clientX - lastPos.current.x) / dt) | 0
    const vy = ((e.clientY - lastPos.current.y) / dt) | 0
    const v = Math.round(Math.hypot(vx, vy))
    setVelocity(v)
    log('pointerup', { x: e.clientX, y: e.clientY, velocity: v })
  }

  return (
    <div className="flex h-full flex-col">
      <TopBar onReset={resetGestures} />
      <div className="flex flex-wrap gap-4 border-b border-border px-4 py-2 text-sm dark:border-border-dark">
        <span>Velocity: <strong>{velocity}</strong> px/s</span>
        <span>Peak pressure: <strong>{peakPressure.toFixed(2)}</strong></span>
        <span>Pointer: <strong>{pointerType}</strong></span>
      </div>
      <div
        ref={areaRef}
        className="relative m-4 flex h-[300px] items-center justify-center rounded-xl border border-dashed border-border bg-panel dark:border-border-dark dark:bg-panel-dark"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={(e) => log('pointermove', { x: e.clientX, y: e.clientY })}
        onPointerEnter={(e) => log('pointerenter', { x: e.clientX, y: e.clientY })}
        onPointerLeave={(e) => log('pointerleave', { x: e.clientX, y: e.clientY })}
        onClick={(e) => log('click', { x: e.clientX, y: e.clientY })}
        onKeyDown={(e) => log('keydown', { key: e.key })}
        onWheel={(e) => log('wheel', { deltaY: e.deltaY })}
      >
        <motion.div
          drag
          dragConstraints={areaRef}
          className="h-20 w-20 cursor-grab rounded-xl bg-primary active:cursor-grabbing"
          whileDrag={{ scale: 1.05 }}
        />
      </div>
      <div className="px-4 pb-4">
        <EventLogger
          entries={entries}
          filter={filter}
          onFilterChange={(f) => setGestures({ filter: f })}
          onClear={() => setEntries([])}
          onCopy={() => copy(JSON.stringify(entries, null, 2))}
        />
      </div>
    </div>
  )
}
