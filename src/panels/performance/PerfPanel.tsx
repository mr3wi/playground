import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { TopBar } from '@/components/layout/TopBar'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Badge } from '@/components/ui/Badge'
import { usePlaygroundStore } from '@/store/usePlaygroundStore'
import { usePerfMonitor } from './usePerfMonitor'

const PROPERTIES = [
  { id: 'opacity', compositor: true, paint: false, layout: false, alt: 'opacity — compositor-friendly' },
  { id: 'transform', compositor: true, paint: false, layout: false, alt: 'transform: scaleX() instead of width' },
  { id: 'width', compositor: false, paint: true, layout: true, alt: 'transform: scaleX() instead of width' },
  { id: 'top', compositor: false, paint: true, layout: true, alt: 'transform: translateY() instead of top' },
  { id: 'background-color', compositor: false, paint: true, layout: false, alt: 'opacity on overlay instead of background-color' },
  { id: 'border-radius', compositor: false, paint: true, layout: false, alt: 'clip-path if possible' },
  { id: 'box-shadow', compositor: false, paint: true, layout: false, alt: 'filter: drop-shadow() on compositor in some browsers' },
] as const

const STRESS_COUNTS = { idle: 0, light: 5, medium: 50, heavy: 200 } as const

export default function PerfPanel() {
  const { animatedProperty, stressLevel, setPerf, resetPerf } = usePlaygroundStore()
  const active = stressLevel !== 'idle'
  const { fps, history } = usePerfMonitor(true)
  const [reflows, setReflows] = useState(0)
  const canvasRef = useRef<HTMLDivElement>(null)

  const prop = PROPERTIES.find((p) => p.id === animatedProperty) ?? PROPERTIES[0]
  const count = STRESS_COUNTS[stressLevel]

  useEffect(() => {
    if (!canvasRef.current || count === 0) return
    const ro = new ResizeObserver(() => setReflows((r) => r + 1))
    const mo = new MutationObserver(() => setReflows((r) => r + 1))
    ro.observe(canvasRef.current)
    mo.observe(canvasRef.current, { childList: true, subtree: true })
    const interval = setInterval(() => setReflows(0), 1000)
    return () => {
      ro.disconnect()
      mo.disconnect()
      clearInterval(interval)
    }
  }, [count])

  const fpsColor = fps >= 55 ? 'text-accent' : fps >= 30 ? 'text-amber-500' : 'text-red-500'

  useEffect(() => {
    if (!canvasRef.current || count === 0) return
    let cancelled = false
    import('d3').then((d3) => {
      if (cancelled || history.length < 2) return
      const canvas = document.getElementById('fps-sparkline') as HTMLCanvasElement | null
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const w = 200
      const h = 40
      canvas.width = w
      canvas.height = h
      const x = d3.scaleLinear().domain([0, history.length - 1]).range([0, w])
      const y = d3.scaleLinear().domain([0, 120]).range([h, 0])
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = '#7C3AED'
      ctx.beginPath()
      history.forEach((v, i) => {
        const px = x(i)
        const py = y(v)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.stroke()
    })
    return () => {
      cancelled = true
    }
  }, [history, count])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar onReset={resetPerf} />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="flex items-center gap-6">
          <div>
            <p className={`text-5xl font-bold ${fpsColor}`}>{fps}</p>
            <p className="text-sm text-gray-500">FPS (60-frame avg)</p>
          </div>
          <canvas id="fps-sparkline" role="img" aria-label="FPS sparkline" className="h-10 w-[200px]" />
          <Badge variant="muted">Reflows/s: {reflows}</Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="space-y-2 rounded-lg border border-border p-4 dark:border-border-dark">
            <label className="text-sm font-medium">Animated property</label>
            <select
              value={animatedProperty}
              onChange={(e) => setPerf({ animatedProperty: e.target.value })}
              className="w-full rounded border border-border px-2 py-1 text-sm dark:border-border-dark"
            >
              {PROPERTIES.map((p) => (
                <option key={p.id} value={p.id}>{p.id}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant={prop.compositor ? 'success' : 'muted'}>Compositor {prop.compositor ? '✓' : '✗'}</Badge>
              <Badge variant={!prop.paint ? 'success' : 'error'}>Paint {prop.paint ? '✗' : '✓'}</Badge>
              <Badge variant={!prop.layout ? 'success' : 'error'}>Layout {prop.layout ? '✗✗' : '✓'}</Badge>
            </div>
            <p className="text-sm text-gray-500">
              Animating `{animatedProperty}` {prop.layout ? 'triggers layout' : prop.paint ? 'triggers paint' : 'is compositor-friendly'}.
            </p>
            <CodeBlock code={`/* Safer alternative */\n${prop.alt}`} language="css" />
          </section>

          <section className="space-y-2">
            <p className="text-sm font-medium">Stress test</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(STRESS_COUNTS) as Array<keyof typeof STRESS_COUNTS>).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPerf({ stressLevel: level })}
                  className={`rounded-lg px-3 py-1.5 text-sm capitalize ${
                    stressLevel === level ? 'bg-primary text-white' : 'border border-border dark:border-border-dark'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div
              ref={canvasRef}
              className="relative flex h-48 flex-wrap gap-1 overflow-hidden rounded-lg border border-border bg-panel p-2 dark:border-border-dark"
            >
              {Array.from({ length: count }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-4 w-4 rounded bg-primary/60"
                  animate={
                    active
                      ? {
                          [animatedProperty === 'opacity' ? 'opacity' : 'scale']:
                            animatedProperty === 'opacity' ? [0.3, 1, 0.3] : [0.8, 1.2, 0.8],
                        }
                      : {}
                  }
                  transition={{ duration: 1, repeat: Infinity, delay: (i % 10) * 0.05 }}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
