import * as Switch from '@radix-ui/react-switch'
import { TopBar } from '@/components/layout/TopBar'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { usePlaygroundStore } from '@/store/usePlaygroundStore'
import { COMPONENT_STATES, renderVariant, type ComponentType } from './componentVariants'

const COMPONENTS: ComponentType[] = ['button', 'input', 'badge', 'card', 'toggle', 'select']

export default function StatesPanel() {
  const { component, interactive, lockedState, setStates } = usePlaygroundStore()

  const locked = COMPONENT_STATES.find((s) => s.name === lockedState)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar
        extra={
          <select
            value={component}
            onChange={(e) => setStates({ component: e.target.value as ComponentType })}
            className="rounded border border-border bg-panel px-2 py-1 text-sm dark:border-border-dark"
            aria-label="Component picker"
          >
            {COMPONENTS.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        }
        onReset={() => setStates({ component: 'button', interactive: false, lockedState: null })}
      />
      <div className="flex items-center gap-2 border-b border-border px-4 py-2 dark:border-border-dark">
        <label htmlFor="interactive" className="text-sm">
          Interactive mode
        </label>
        <Switch.Root
          id="interactive"
          checked={interactive}
          onCheckedChange={(v) => setStates({ interactive: v })}
          className="h-5 w-9 rounded-full bg-gray-300 data-[state=checked]:bg-primary dark:bg-gray-600"
        >
          <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white transition data-[state=checked]:translate-x-[18px]" />
        </Switch.Root>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {COMPONENT_STATES.map((state) => (
            <button
              key={state.name}
              type="button"
              onClick={() => setStates({ lockedState: state.name })}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 ${
                lockedState === state.name ? 'border-primary ring-2 ring-primary/30' : 'border-border dark:border-border-dark'
              }`}
            >
              {renderVariant(component, state, interactive)}
              <span className="text-xs font-medium">{state.name}</span>
              <code className="text-[10px] text-gray-500">{state.selector}</code>
            </button>
          ))}
        </div>
        {locked && (
          <div className="mt-6">
            <CodeBlock
              code={`/* ${locked.name} */\n.component${locked.selector} {\n  /* styles for ${locked.name.toLowerCase()} state */\n}`}
              language="css"
            />
          </div>
        )}
      </div>
    </div>
  )
}
