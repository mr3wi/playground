export interface LogEntry {
  id: string
  timestamp: number
  type: string
  data: Record<string, unknown>
}

export interface EventLoggerProps {
  entries: LogEntry[]
  filter: 'all' | 'pointer' | 'touch' | 'keyboard'
  onFilterChange: (f: 'all' | 'pointer' | 'touch' | 'keyboard') => void
  onClear: () => void
  onCopy: () => void
}

const FILTERS = ['all', 'pointer', 'touch', 'keyboard'] as const

/** Real-time gesture event log with filters. */
export function EventLogger({ entries, filter, onFilterChange, onClear, onCopy }: EventLoggerProps) {
  const filtered =
    filter === 'all'
      ? entries
      : entries.filter((e) => {
          if (filter === 'pointer') return e.type.startsWith('pointer') || e.type === 'click'
          if (filter === 'touch') return e.type.startsWith('touch')
          return e.type.startsWith('key')
        })

  return (
    <div className="rounded-lg border border-border dark:border-border-dark">
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-2 dark:border-border-dark">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onFilterChange(f)}
            className={`rounded-full px-2 py-0.5 text-xs capitalize ${
              filter === f ? 'bg-primary text-white' : 'bg-panel dark:bg-gray-800'
            }`}
          >
            {f}
          </button>
        ))}
        <button type="button" onClick={onClear} className="ml-auto text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
          Clear log
        </button>
        <button type="button" onClick={onCopy} className="text-xs text-primary">
          Copy log as JSON
        </button>
      </div>
      <ul className="scrollbar-thin max-h-48 overflow-y-auto p-2 font-mono text-xs">
        {filtered.map((e) => (
          <li key={e.id} className="border-b border-border/50 py-1 dark:border-border-dark/50">
            <span className="text-gray-500">[{new Date(e.timestamp).toLocaleTimeString()}]</span>{' '}
            <span className="text-primary">{e.type}</span> — {JSON.stringify(e.data)}
          </li>
        ))}
        {filtered.length === 0 && <li className="py-4 text-center text-gray-500">No events yet</li>}
      </ul>
    </div>
  )
}
