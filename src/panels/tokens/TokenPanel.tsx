import * as Tabs from '@radix-ui/react-tabs'
import { TopBar } from '@/components/layout/TopBar'
import { SliderRow } from '@/components/ui/SliderRow'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { usePlaygroundStore } from '@/store/usePlaygroundStore'
import { useUrlState } from '@/hooks/useUrlState'
import { useClipboard } from '@/hooks/useClipboard'
import { LiveComponent } from './LiveComponent'

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} color picker`}
          className="h-9 w-12 cursor-pointer rounded border border-border dark:border-border-dark"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded border border-border bg-panel px-2 font-mono text-sm dark:border-border-dark dark:bg-surface-dark"
          aria-label={`${label} hex value`}
        />
      </div>
    </div>
  )
}

export default function TokenPanel() {
  const tokens = usePlaygroundStore()
  const { copy } = useClipboard()

  useUrlState(
    'tokens',
    {
      colorPrimary: tokens.colorPrimary,
      colorAccent: tokens.colorAccent,
      radiusBase: tokens.radiusBase,
    },
    (parsed) => {
      tokens.setTokens({
        colorPrimary: parsed.colorPrimary ?? tokens.colorPrimary,
        colorAccent: parsed.colorAccent ?? tokens.colorAccent,
        radiusBase: Number(parsed.radiusBase) || tokens.radiusBase,
      })
    },
  )

  const css = `:root {
  --color-primary: ${tokens.colorPrimary};
  --color-accent: ${tokens.colorAccent};
  --color-surface: ${tokens.colorSurface};
  --radius-base: ${tokens.radiusBase}px;
  --spacing-base: ${tokens.spacingBase}px;
  --font-size-base: ${tokens.fontSizeBase}px;
}`

  const json = JSON.stringify(
    {
      colorPrimary: tokens.colorPrimary,
      colorAccent: tokens.colorAccent,
      colorSurface: tokens.colorSurface,
      radiusBase: tokens.radiusBase,
      spacingBase: tokens.spacingBase,
      fontSizeBase: tokens.fontSizeBase,
    },
    null,
    2,
  )

  const tailwind = `theme: {
  extend: {
    colors: {
      primary: '${tokens.colorPrimary}',
      accent: '${tokens.colorAccent}',
    },
    borderRadius: { DEFAULT: '${tokens.radiusBase}px' },
    spacing: { base: '${tokens.spacingBase}px' },
  },
}`

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar onReset={tokens.resetTokens} />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 lg:grid-cols-2">
        <div className="min-h-[260px] lg:col-start-2 lg:row-start-1 lg:min-h-0">
          <LiveComponent {...tokens} />
        </div>
        <div className="space-y-4 lg:col-start-1 lg:row-start-1">
          <ColorInput label="--color-primary" value={tokens.colorPrimary} onChange={(v) => tokens.setTokens({ colorPrimary: v })} />
          <ColorInput label="--color-accent" value={tokens.colorAccent} onChange={(v) => tokens.setTokens({ colorAccent: v })} />
          <ColorInput label="--color-surface" value={tokens.colorSurface} onChange={(v) => tokens.setTokens({ colorSurface: v })} />
          <SliderRow label="--radius-base" value={tokens.radiusBase} min={0} max={24} unit="px" onChange={(v) => tokens.setTokens({ radiusBase: v })} />
          <SliderRow label="--spacing-base" value={tokens.spacingBase} min={4} max={32} unit="px" onChange={(v) => tokens.setTokens({ spacingBase: v })} />
          <SliderRow label="--font-size-base" value={tokens.fontSizeBase} min={12} max={20} unit="px" onChange={(v) => tokens.setTokens({ fontSizeBase: v })} />
          <Tabs.Root defaultValue="css">
            <Tabs.List className="flex gap-1 rounded-lg border border-border bg-panel p-1 dark:border-border-dark dark:bg-surface-dark">
              {(['css', 'json', 'tailwind'] as const).map((t) => (
                <Tabs.Trigger key={t} value={t} className="tab-trigger">
                  {t}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            <Tabs.Content value="css" className="pt-2">
              <CodeBlock code={css} language="css" />
              <button type="button" className="mt-2 text-xs text-primary" onClick={() => copy(css)}>Copy CSS</button>
            </Tabs.Content>
            <Tabs.Content value="json" className="pt-2">
              <CodeBlock code={json} language="json" />
              <button type="button" className="mt-2 text-xs text-primary" onClick={() => copy(json)}>Copy JSON</button>
            </Tabs.Content>
            <Tabs.Content value="tailwind" className="pt-2">
              <CodeBlock code={tailwind} language="javascript" label="TAILWIND" />
              <button type="button" className="mt-2 text-xs text-primary" onClick={() => copy(tailwind)}>Copy Tailwind</button>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </div>
  )
}
