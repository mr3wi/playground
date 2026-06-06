import { useState } from 'react'
import { motion, useSpring } from 'motion/react'
import { TopBar } from '@/components/layout/TopBar'
import { SliderRow } from '@/components/ui/SliderRow'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Badge } from '@/components/ui/Badge'
import { usePlaygroundStore } from '@/store/usePlaygroundStore'
import { useUrlState } from '@/hooks/useUrlState'
import { useClipboard } from '@/hooks/useClipboard'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { SpringCurveCanvas } from './SpringCurveCanvas'
import { useSpringPhysics } from './useSpringPhysics'

export default function SpringPanel() {
  const { stiffness, damping, mass, setSpring, resetSpring } = usePlaygroundStore()
  const [trigger, setTrigger] = useState(0)
  const { copy } = useClipboard()
  const reduced = useReducedMotionSafe()
  const stats = useSpringPhysics(stiffness, damping, mass)

  const x = useSpring(0, { stiffness, damping, mass })

  useUrlState(
    'spring',
    { stiffness, damping, mass },
    (parsed) => {
      setSpring({
        stiffness: Number(parsed.stiffness) || stiffness,
        damping: Number(parsed.damping) || damping,
        mass: Number(parsed.mass) || mass,
      })
    },
  )

  const runAnimation = () => {
    setTrigger((t) => t + 1)
    x.set(120)
    setTimeout(() => x.set(0), reduced ? 0 : 50)
  }

  const code = `// Motion (Framer Motion)
const spring = { stiffness: ${stiffness}, damping: ${damping}, mass: ${mass} }
<motion.div animate={{ x: 0 }} transition={{ type: "spring", ...spring }} />

// React Spring
useSpring({ config: { tension: ${stiffness}, friction: ${damping}, mass: ${mass} } })

// CSS approximation
transition: transform ${stats.cssDuration}ms cubic-bezier(${stats.cssBezier});`

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar
        onCopySnippet={() => copy(code)}
        onReset={() => {
          resetSpring()
          setTrigger(0)
        }}
      />
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 md:p-5 lg:flex-row">
        <div className="panel-card w-full space-y-3 lg:w-72">
          <p className="section-label">Spring physics</p>
          <SliderRow label="Stiffness" value={stiffness} min={10} max={800} onChange={(v) => setSpring({ stiffness: v })} />
          <SliderRow label="Damping" value={damping} min={1} max={100} onChange={(v) => setSpring({ damping: v })} />
          <SliderRow label="Mass" value={mass} min={0.1} max={10} step={0.1} onChange={(v) => setSpring({ mass: v })} />
          <p className="section-label pt-1">Preview</p>
          <div className="panel-stage relative flex h-24 items-center overflow-hidden">
            <motion.div
              key={trigger}
              style={{ x }}
              className="h-[60px] w-[60px] shrink-0 rounded-full bg-primary shadow-lg shadow-primary/25"
            />
          </div>
          <button
            type="button"
            onClick={runAnimation}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Trigger animation
          </button>
        </div>
        <div className="panel-card flex-1 space-y-4">
          <p className="section-label">Displacement curve</p>
          <SpringCurveCanvas stiffness={stiffness} damping={damping} mass={mass} />
          <div className="flex flex-wrap gap-2">
            <Badge>{stats.duration}ms</Badge>
            <Badge variant="muted">Bounce: {stats.bounce}</Badge>
            <Badge variant="muted">Feel: {stats.feel}</Badge>
          </div>
          <CodeBlock code={code} language="typescript" />
        </div>
      </div>
    </div>
  )
}
