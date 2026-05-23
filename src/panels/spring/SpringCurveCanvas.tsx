import { useEffect, useRef } from 'react'

export interface SpringCurveCanvasProps {
  stiffness: number
  damping: number
  mass: number
}

/** D3 displacement-over-time curve for spring physics. */
export function SpringCurveCanvas({ stiffness, damping, mass }: SpringCurveCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let cancelled = false
    const canvas = ref.current
    if (!canvas) return

    import('d3').then((d3) => {
      if (cancelled) return
      const width = 400
      const height = 120
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = width
      canvas.height = height

      const omega = Math.sqrt(stiffness / mass)
      const zeta = damping / (2 * Math.sqrt(stiffness * mass))

      const points: [number, number][] = []
      for (let i = 0; i <= 200; i++) {
        const t = (i / 200) * 3
        let y: number
        if (zeta < 1) {
          const wd = omega * Math.sqrt(1 - zeta * zeta)
          y = 1 - Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t))
        } else {
          y = 1 - Math.exp(-omega * t) * (1 + omega * t)
        }
        points.push([t, y])
      }

      const x = d3.scaleLinear().domain([0, 3]).range([40, width - 10])
      const y = d3.scaleLinear().domain([0, 1.4]).range([height - 20, 10])

      ctx.fillStyle = document.documentElement.classList.contains('dark')
        ? '#1A1A1A'
        : '#F8F8F8'
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = '#9CA3AF'
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(40, y(1))
      ctx.lineTo(width - 10, y(1))
      ctx.stroke()
      ctx.setLineDash([])

      ctx.strokeStyle = '#7C3AED'
      ctx.lineWidth = 2
      ctx.beginPath()
      points.forEach(([t, val], i) => {
        const px = x(t)
        const py = y(val)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.stroke()

      ctx.fillStyle = '#6B7280'
      ctx.font = '10px sans-serif'
      ctx.fillText('time →', width - 50, height - 4)
      ctx.save()
      ctx.translate(8, height / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText('displacement', 0, 0)
      ctx.restore()
    })

    return () => {
      cancelled = true
    }
  }, [stiffness, damping, mass])

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="Spring displacement over time curve"
      className="w-full max-w-[400px] rounded-lg border border-border dark:border-border-dark"
      style={{ aspectRatio: '400 / 120' }}
    />
  )
}
