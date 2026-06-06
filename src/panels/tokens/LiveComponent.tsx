export interface LiveComponentProps {
  colorPrimary: string
  colorAccent: string
  colorSurface: string
  radiusBase: number
  spacingBase: number
  fontSizeBase: number
  filter?: string
}

/** Profile card preview driven by design tokens. */
export function LiveComponent({
  colorPrimary,
  colorAccent,
  colorSurface,
  radiusBase,
  spacingBase,
  fontSizeBase,
  filter,
}: LiveComponentProps) {
  const style = {
    '--color-primary': colorPrimary,
    '--color-accent': colorAccent,
    '--color-surface': colorSurface,
    '--radius-base': `${radiusBase}px`,
    '--spacing-base': `${spacingBase}px`,
    '--font-size-base': `${fontSizeBase}px`,
    filter: filter && filter !== 'none' ? filter : undefined,
  } as React.CSSProperties

  return (
    <div
      className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-border p-6 dark:border-border-dark"
      style={{
        ...style,
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <div
        className="w-full max-w-sm bg-white shadow-lg dark:bg-gray-900 dark:shadow-black/40"
        style={{
          borderRadius: 'var(--radius-base)',
          padding: 'calc(var(--spacing-base) * 1.5)',
          fontSize: 'var(--font-size-base)',
        }}
      >
        <div className="flex items-center gap-3" style={{ marginBottom: 'var(--spacing-base)' }}>
          <div
            className="h-12 w-12 rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <div>
            <p className="font-semibold" style={{ color: 'var(--color-primary)' }}>
              Alex Rivera
            </p>
            <p className="text-gray-500 dark:text-gray-400">Design Engineer</p>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300" style={{ marginBottom: 'var(--spacing-base)' }}>
          Building interaction systems and design tooling.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="font-medium text-white"
            style={{
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'calc(var(--radius-base) * 0.5)',
              padding: 'calc(var(--spacing-base) * 0.5) var(--spacing-base)',
            }}
          >
            Follow
          </button>
          <button
            type="button"
            className="font-medium"
            style={{
              color: 'var(--color-accent)',
              border: `1px solid var(--color-accent)`,
              borderRadius: 'calc(var(--radius-base) * 0.5)',
              padding: 'calc(var(--spacing-base) * 0.5) var(--spacing-base)',
            }}
          >
            Message
          </button>
          <span
            className="ml-auto self-center text-xs font-medium"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: '#fff',
              borderRadius: 'var(--radius-base)',
              padding: '2px 8px',
            }}
          >
            Pro
          </span>
        </div>
      </div>
    </div>
  )
}
