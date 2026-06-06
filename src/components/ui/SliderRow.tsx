export interface SliderRowProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
}

/** Label + range input + live value display. */
export function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
}: SliderRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={`slider-${label}`}
          className="text-xs font-medium uppercase tracking-wide text-muted"
        >
          {label}
        </label>
        <span className="font-mono text-xs tabular-nums text-primary">
          {value}
          {unit}
        </span>
      </div>
      <input
        id={`slider-${label}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-primary dark:bg-gray-700"
      />
    </div>
  )
}
