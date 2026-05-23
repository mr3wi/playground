import { useEffect, useRef, useState } from 'react'

/** Rolling FPS average via requestAnimationFrame. */
export function usePerfMonitor(active: boolean) {
  const [fps, setFps] = useState(60)
  const [history, setHistory] = useState<number[]>([])
  const framesRef = useRef<number[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!active) return
    let last = performance.now()
    const tick = (now: number) => {
      const delta = now - last
      last = now
      const instant = Math.min(120, Math.round(1000 / delta))
      framesRef.current.push(instant)
      if (framesRef.current.length > 120) framesRef.current.shift()
      if (framesRef.current.length % 10 === 0) {
        const avg = Math.round(
          framesRef.current.reduce((a, b) => a + b, 0) / framesRef.current.length,
        )
        setFps(avg)
        setHistory([...framesRef.current])
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  return { fps, history }
}
