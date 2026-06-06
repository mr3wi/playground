import { Pause, Play, RotateCcw, Sparkles } from 'lucide-react'
import { SliderRow } from '@/components/ui/SliderRow'
import type { ExperimentSettings } from './types'

export interface ControlPanelProps {
  settings: ExperimentSettings
  onChange: (patch: Partial<ExperimentSettings>) => void
  onReset: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
        {title}
      </h3>
      {children}
    </section>
  )
}

/** Glassmorphic floating panel for live 3D card tuning. */
export function ControlPanel({ settings, onChange, onReset }: ControlPanelProps) {
  const { geometry, layout, animation, lighting } = settings

  const patchGeometry = (patch: Partial<typeof geometry>) =>
    onChange({ geometry: { ...geometry, ...patch } })

  const patchLayout = (patch: Partial<typeof layout>) =>
    onChange({ layout: { ...layout, ...patch } })

  const patchAnimation = (patch: Partial<typeof animation>) =>
    onChange({ animation: { ...animation, ...patch } })

  const patchLighting = (patch: Partial<typeof lighting>) =>
    onChange({ lighting: { ...lighting, ...patch } })

  return (
    <aside className="pointer-events-auto absolute right-4 top-4 z-10 w-[min(100%,320px)] max-h-[calc(100%-2rem)] overflow-y-auto rounded-2xl border border-white/10 bg-black/40 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl scrollbar-thin">
      <div className="mb-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-white">3D Task Cards</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-white/10 p-1.5 text-white/50 transition hover:border-white/25 hover:text-white"
          aria-label="Reset settings"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-6 text-white">
        <Section title="Geometry">
          <SliderRow
            label="Width"
            value={geometry.width}
            min={1.4}
            max={3.2}
            step={0.05}
            onChange={(v) => patchGeometry({ width: v })}
          />
          <SliderRow
            label="Height"
            value={geometry.height}
            min={2}
            max={4}
            step={0.05}
            onChange={(v) => patchGeometry({ height: v })}
          />
          <SliderRow
            label="Depth"
            value={geometry.depth}
            min={0.05}
            max={0.4}
            step={0.01}
            onChange={(v) => patchGeometry({ depth: v })}
          />
          <SliderRow
            label="Corner Radius"
            value={geometry.cornerRadius}
            min={0.02}
            max={0.3}
            step={0.01}
            onChange={(v) => patchGeometry({ cornerRadius: v })}
          />
          <SliderRow
            label="Roughness"
            value={geometry.roughness}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => patchGeometry({ roughness: v })}
          />
          <SliderRow
            label="Metalness"
            value={geometry.metalness}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => patchGeometry({ metalness: v })}
          />
          <label className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-300">Base Color</span>
            <input
              type="color"
              value={geometry.baseColor}
              onChange={(e) => patchGeometry({ baseColor: e.target.value })}
              className="h-8 w-12 cursor-pointer rounded border border-white/10 bg-transparent"
            />
          </label>
        </Section>

        <Section title="Layout">
          <SliderRow
            label="Gap"
            value={layout.gap}
            min={0.2}
            max={1.2}
            step={0.05}
            onChange={(v) => patchLayout({ gap: v })}
          />
          <SliderRow
            label="Card Count"
            value={layout.cardCount}
            min={3}
            max={11}
            step={1}
            onChange={(v) => patchLayout({ cardCount: v })}
          />
          <SliderRow
            label="Scroll Speed"
            value={layout.scrollSpeed}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => patchLayout({ scrollSpeed: v })}
          />
        </Section>

        <Section title="Animation">
          <SliderRow
            label="Rotation Speed"
            value={animation.rotationSpeed}
            min={0}
            max={0.6}
            step={0.01}
            onChange={(v) => patchAnimation({ rotationSpeed: v })}
          />
          <button
            type="button"
            onClick={() => patchAnimation({ paused: !animation.paused })}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {animation.paused ? (
              <>
                <Play className="h-4 w-4" /> Resume idle scroll
              </>
            ) : (
              <>
                <Pause className="h-4 w-4" /> Pause idle scroll
              </>
            )}
          </button>
        </Section>

        <Section title="Lighting">
          <SliderRow
            label="Ambient"
            value={lighting.ambientIntensity}
            min={0}
            max={1.5}
            step={0.05}
            onChange={(v) => patchLighting({ ambientIntensity: v })}
          />
          <SliderRow
            label="Directional"
            value={lighting.directionalIntensity}
            min={0}
            max={3}
            step={0.05}
            onChange={(v) => patchLighting({ directionalIntensity: v })}
          />
          <SliderRow
            label="Point Lights"
            value={lighting.pointIntensity}
            min={0}
            max={2}
            step={0.05}
            onChange={(v) => patchLighting({ pointIntensity: v })}
          />
          <SliderRow
            label="Environment"
            value={lighting.envIntensity}
            min={0}
            max={2}
            step={0.05}
            onChange={(v) => patchLighting({ envIntensity: v })}
          />
        </Section>
      </div>
    </aside>
  )
}
