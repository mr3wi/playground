import { useState } from 'react'
import { motion } from 'motion/react'
import * as Tabs from '@radix-ui/react-tabs'
import { TopBar } from '@/components/layout/TopBar'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { usePlaygroundStore } from '@/store/usePlaygroundStore'
import { useUrlState } from '@/hooks/useUrlState'
import { useClipboard } from '@/hooks/useClipboard'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { BezierCanvas } from './BezierCanvas'
import { EASING_PRESETS } from './easingPresets'

export default function EasingPanel() {
  const { p1x, p1y, p2x, p2y, setEasing, resetEasing } = usePlaygroundStore()
  const [previewKey, setPreviewKey] = useState(0)
  const { copy } = useClipboard()
  const reduced = useReducedMotionSafe()

  useUrlState('easing', { p1x, p1y, p2x, p2y }, (parsed) => {
    setEasing({
      p1x: Number(parsed.p1x) || p1x,
      p1y: Number(parsed.p1y) || p1y,
      p2x: Number(parsed.p2x) || p2x,
      p2y: Number(parsed.p2y) || p2y,
    })
  })

  const css = `cubic-bezier(${p1x.toFixed(2)}, ${p1y.toFixed(2)}, ${p2x.toFixed(2)}, ${p2y.toFixed(2)})`
  const motionCode = `transition={{ ease: [${p1x}, ${p1y}, ${p2x}, ${p2y}], duration: 0.4 }}`
  const gsapCode = `gsap.to(el, { ease: "cubic-bezier(${p1x}, ${p1y}, ${p2x}, ${p2y})" })`

  const demos = ['button', 'pill', 'card', 'icon', 'text'] as const

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar onCopySnippet={() => copy(css)} onReset={resetEasing} />
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 md:p-5 lg:flex-row">
        <div className="panel-card space-y-4 lg:w-80">
          <p className="section-label">Bezier curve</p>
          <BezierCanvas p1x={p1x} p1y={p1y} p2x={p2x} p2y={p2y} onChange={(a, b, c, d) => setEasing({ p1x: a, p1y: b, p2x: c, p2y: d })} />
          <div className="flex flex-wrap gap-2">
            {EASING_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setEasing({ p1x: preset.p1x, p1y: preset.p1y, p2x: preset.p2x, p2y: preset.p2y })}
                className="rounded-full border border-border px-3 py-1 text-xs hover:bg-primary/10 dark:border-border-dark"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
        <div className="panel-card flex-1 space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            {demos.map((d) => (
              <motion.div
                key={`${d}-${previewKey}`}
                initial={{ x: 0 }}
                animate={{ x: reduced ? 0 : 48 }}
                transition={{ ease: [p1x, p1y, p2x, p2y], duration: reduced ? 0 : 0.4 }}
                className={
                  d === 'button'
                    ? 'rounded-lg bg-primary px-3 py-1.5 text-xs text-white'
                    : d === 'pill'
                      ? 'rounded-full bg-accent/20 px-3 py-1 text-xs'
                      : d === 'card'
                        ? 'h-12 w-16 rounded-lg border border-border bg-panel dark:border-border-dark'
                        : d === 'icon'
                          ? 'h-8 w-8 rounded bg-gray-200 dark:bg-gray-700'
                          : 'text-sm font-medium'
                }
              >
                {d === 'text' ? 'Aa' : ''}
              </motion.div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPreviewKey((k) => k + 1)}
            className="rounded-lg border border-border px-4 py-2 text-sm dark:border-border-dark"
          >
            Preview
          </button>
          <Tabs.Root defaultValue="css">
            <Tabs.List className="flex gap-1 rounded-lg border border-border bg-panel p-1 dark:border-border-dark dark:bg-surface-dark">
              {(['css', 'motion', 'gsap'] as const).map((tab) => (
                <Tabs.Trigger key={tab} value={tab} className="tab-trigger">
                  {tab}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            <Tabs.Content value="css" className="pt-3">
              <CodeBlock code={css} language="css" />
            </Tabs.Content>
            <Tabs.Content value="motion" className="pt-3">
              <CodeBlock code={motionCode} language="typescript" />
            </Tabs.Content>
            <Tabs.Content value="gsap" className="pt-3">
              <CodeBlock code={gsapCode} language="javascript" />
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </div>
  )
}
