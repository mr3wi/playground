import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { getHighlighter } from '@/lib/shiki'
import { useClipboard } from '@/hooks/useClipboard'
import { useTheme } from '@/hooks/useTheme'
import { Badge } from './Badge'

export interface CodeBlockProps {
  code: string
  language: 'typescript' | 'css' | 'json' | 'javascript'
  label?: string
}

/** Shiki syntax-highlighted code block with copy button. */
export function CodeBlock({ code, language, label }: CodeBlockProps) {
  const [html, setHtml] = useState('')
  const { isDark } = useTheme()
  const { copy, copied } = useClipboard()

  useEffect(() => {
    let cancelled = false
    getHighlighter().then((h) => {
      if (cancelled) return
      const out = h.codeToHtml(code, {
        lang: language,
        theme: isDark ? 'github-dark' : 'github-light',
      })
      setHtml(out)
    })
    return () => {
      cancelled = true
    }
  }, [code, language, isDark])

  const langLabel = label ?? language.toUpperCase()

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-code text-gray-100 dark:border-border-dark dark:bg-code">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <Badge variant="muted" className="!bg-white/10 !text-gray-300">
          {langLabel}
        </Badge>
        <button
          type="button"
          onClick={() => copy(code)}
          className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <div
        className="overflow-x-auto p-3 text-sm [&_pre]:!bg-transparent [&_pre]:!m-0 [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: html || `<pre><code>${code}</code></pre>` }}
      />
    </div>
  )
}
