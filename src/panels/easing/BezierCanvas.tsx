import { useCallback, useRef, useState } from 'react'
import { motion } from 'motion/react'

export interface BezierCanvasProps {
  p1x: number
  p1y: number
  p2x: number
  p2y: number
  onChange: (p1x: number, p1y: number, p2x: number, p2y: number) => void
}

const SIZE = 280
const PAD = 20

function toSvg(x: number, y: number) {
  return {
    sx: PAD + x * (SIZE - PAD * 2),
    sy: SIZE - PAD - y * (SIZE - PAD * 2),
  }
}

/** Draggable SVG cubic-bezier editor. */
export function BezierCanvas({ p1x, p1y, p2x, p2y, onChange }: BezierCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<1 | 2 | null>(null)

  const p0 = toSvg(0, 0)
  const p3 = toSvg(1, 1)
  const c1 = toSvg(p1x, p1y)
  const c2 = toSvg(p2x, p2y)

  const overshoot = p1y > 1 || p1y < 0 || p2y > 1 || p2y < 0

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const nx = Math.max(0, Math.min(1, (e.clientX - rect.left - PAD) / (SIZE - PAD * 2)))
      const ny = Math.max(-0.5, Math.min(1.5, 1 - (e.clientY - rect.top - PAD) / (SIZE - PAD * 2)))
      if (dragging === 1) onChange(nx, ny, p2x, p2y)
      else onChange(p1x, p1y, nx, ny)
    },
    [dragging, onChange, p1x, p1y, p2x, p2y],
  )

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-[280px] rounded-lg border border-border bg-panel dark:border-border-dark dark:bg-panel-dark"
      role="img"
      aria-label="Cubic bezier curve editor"
      onPointerMove={onPointerMove}
      onPointerUp={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
    >
      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={`g-${g}`}
          x1={PAD}
          y1={SIZE - PAD - g * (SIZE - PAD * 2)}
          x2={SIZE - PAD}
          y2={SIZE - PAD - g * (SIZE - PAD * 2)}
          stroke="currentColor"
          strokeOpacity={0.1}
        />
      ))}
      {overshoot && (
        <rect x={PAD} y={PAD} width={SIZE - PAD * 2} height={SIZE - PAD * 2} fill="none" stroke="#F59E0B" strokeDasharray="4 2" opacity={0.5} />
      )}
      <line x1={p0.sx} y1={p0.sy} x2={c1.sx} y2={c1.sy} stroke="#14B8A6" strokeWidth={1} opacity={0.6} />
      <line x1={p3.sx} y1={p3.sy} x2={c2.sx} y2={c2.sy} stroke="#A855F7" strokeWidth={1} opacity={0.6} />
      <path
        d={`M ${p0.sx} ${p0.sy} C ${c1.sx} ${c1.sy}, ${c2.sx} ${c2.sy}, ${p3.sx} ${p3.sy}`}
        fill="none"
        stroke="#7C3AED"
        strokeWidth={2}
      />
      <motion.circle
        cx={c1.sx}
        cy={c1.sy}
        r={8}
        fill="#14B8A6"
        className="cursor-grab"
        onPointerDown={() => setDragging(1)}
      />
      <motion.circle
        cx={c2.sx}
        cy={c2.sy}
        r={8}
        fill="#A855F7"
        className="cursor-grab"
        onPointerDown={() => setDragging(2)}
      />
    </svg>
  )
}
