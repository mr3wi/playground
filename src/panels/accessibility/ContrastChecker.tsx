import { Badge } from '@/components/ui/Badge'

function luminance(hex: string): number {
  const rgb = hex
    .replace('#', '')
    .match(/.{2}/g)
    ?.map((x) => {
      const c = parseInt(x, 16) / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    }) ?? [0, 0, 0]
  return 0.2126 * rgb[0]! + 0.7152 * rgb[1]! + 0.0722 * rgb[2]!
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(fg)
  const l2 = luminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export interface ContrastCheckerProps {
  fg: string
  bg: string
  onFgChange: (v: string) => void
  onBgChange: (v: string) => void
}

/** WCAG contrast ratio checker with AA/AAA badges. */
export function ContrastChecker({ fg, bg, onFgChange, onBgChange }: ContrastCheckerProps) {
  const ratio = contrastRatio(fg, bg)
  const aaNormal = ratio >= 4.5
  const aaaNormal = ratio >= 7
  const aaLarge = ratio >= 3
  const aaaLarge = ratio >= 4.5

  return (
    <section className="space-y-4 rounded-lg border border-border p-4 dark:border-border-dark">
      <h2 className="text-sm font-semibold">Contrast checker</h2>
      <div className="grid grid-cols-2 gap-4">
        <label className="text-sm">
          Foreground
          <input type="color" value={fg} onChange={(e) => onFgChange(e.target.value)} className="ml-2" aria-label="Foreground color" />
          <input type="text" value={fg} onChange={(e) => onFgChange(e.target.value)} className="ml-2 w-24 font-mono text-xs" />
        </label>
        <label className="text-sm">
          Background
          <input type="color" value={bg} onChange={(e) => onBgChange(e.target.value)} className="ml-2" aria-label="Background color" />
          <input type="text" value={bg} onChange={(e) => onBgChange(e.target.value)} className="ml-2 w-24 font-mono text-xs" />
        </label>
      </div>
      <p className="text-3xl font-bold">{ratio.toFixed(2)} : 1</p>
      <div className="flex flex-wrap gap-2">
        <Badge variant={aaNormal ? 'success' : 'error'}>AA normal {aaNormal ? 'pass' : 'fail'}</Badge>
        <Badge variant={aaaNormal ? 'success' : 'error'}>AAA normal {aaaNormal ? 'pass' : 'fail'}</Badge>
        <Badge variant={aaLarge ? 'success' : 'warning'}>AA large {aaLarge ? 'pass' : 'fail'}</Badge>
        <Badge variant={aaaLarge ? 'success' : 'warning'}>AAA large {aaaLarge ? 'pass' : 'fail'}</Badge>
      </div>
      {!aaaNormal && (
        <p className="text-sm text-gray-500">
          Tip: darken foreground or lighten background for AAA compliance.
        </p>
      )}
      <div className="space-y-2 rounded-lg p-4" style={{ backgroundColor: bg, color: fg }}>
        <p className="text-sm">Small text preview (14px)</p>
        <p className="text-lg font-semibold">Large text preview (18px+)</p>
      </div>
    </section>
  )
}
