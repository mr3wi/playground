import { TopBar } from '@/components/layout/TopBar'
import { usePlaygroundStore } from '@/store/usePlaygroundStore'
import { LiveComponent } from '@/panels/tokens/LiveComponent'
import { ContrastChecker } from './ContrastChecker'
import { FocusOrderVisualizer } from './FocusOrderVisualizer'

const COLOR_BLIND_FILTERS: Record<string, string> = {
  none: 'none',
  protanopia: 'url(#protanopia)',
  deuteranopia: 'url(#deuteranopia)',
  tritanopia: 'url(#tritanopia)',
  achromatopsia: 'grayscale(100%)',
}

function parseAriaTree(html: string): string[] {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const lines: string[] = []
  const walk = (el: Element, depth: number) => {
    const role = el.getAttribute('role') ?? el.tagName.toLowerCase()
    const type = el.getAttribute('type')
    const label = type ? `${role}[type=${type}]` : role
    lines.push(`${'  '.repeat(depth)}${label}`)
    if (el.tagName === 'IMG' && !el.getAttribute('alt')) lines.push(`${'  '.repeat(depth + 1)}⚠ missing alt`)
    if (el.tagName === 'BUTTON' && !el.textContent?.trim() && !el.getAttribute('aria-label'))
      lines.push(`${'  '.repeat(depth + 1)}⚠ missing aria-label on icon button`)
    Array.from(el.children).forEach((c) => walk(c, depth + 1))
  }
  Array.from(doc.body.children).forEach((c) => walk(c, 0))
  return lines
}

export default function A11yPanel() {
  const store = usePlaygroundStore()
  const tree = parseAriaTree(store.htmlSnippet)
  const filter =
    store.colorBlindness === 'achromatopsia'
      ? COLOR_BLIND_FILTERS.achromatopsia
      : store.colorBlindness !== 'none'
        ? COLOR_BLIND_FILTERS[store.colorBlindness]
        : undefined

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar onReset={store.resetA11y} />
      <div className="grid flex-1 gap-4 overflow-y-auto p-4 lg:grid-cols-2">
        <div className="space-y-4">
          <ContrastChecker
            fg={store.fgColor}
            bg={store.bgColor}
            onFgChange={(v) => store.setA11y({ fgColor: v })}
            onBgChange={(v) => store.setA11y({ bgColor: v })}
          />
          <FocusOrderVisualizer
            showOrder={store.showFocusOrder}
            onToggle={(v) => store.setA11y({ showFocusOrder: v })}
          />
          <section className="space-y-2 rounded-lg border border-border p-4 dark:border-border-dark">
            <h2 className="text-sm font-semibold">ARIA role inspector</h2>
            <textarea
              value={store.htmlSnippet}
              onChange={(e) => store.setA11y({ htmlSnippet: e.target.value })}
              className="h-24 w-full rounded border border-border bg-panel p-2 font-mono text-xs dark:border-border-dark"
              aria-label="HTML snippet to inspect"
            />
            <pre className="max-h-32 overflow-auto rounded bg-code p-2 font-mono text-xs text-gray-300">
              {tree.join('\n')}
            </pre>
          </section>
          <label className="block text-sm">
            Color blindness simulator
            <select
              value={store.colorBlindness}
              onChange={(e) =>
                store.setA11y({
                  colorBlindness: e.target.value as typeof store.colorBlindness,
                })
              }
              className="mt-1 w-full rounded border border-border px-2 py-1 dark:border-border-dark"
            >
              <option value="none">None</option>
              <option value="protanopia">Protanopia</option>
              <option value="deuteranopia">Deuteranopia</option>
              <option value="tritanopia">Tritanopia</option>
              <option value="achromatopsia">Achromatopsia</option>
            </select>
          </label>
        </div>
        <LiveComponent
          colorPrimary={store.colorPrimary}
          colorAccent={store.colorAccent}
          colorSurface={store.colorSurface}
          radiusBase={store.radiusBase}
          spacingBase={store.spacingBase}
          fontSizeBase={store.fontSizeBase}
          filter={filter}
        />
      </div>
    </div>
  )
}
