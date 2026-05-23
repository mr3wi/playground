import { createHighlighter, type Highlighter } from 'shiki'

let highlighterPromise: Promise<Highlighter> | null = null

/** Singleton Shiki highlighter — loaded once for all CodeBlock instances. */
export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['typescript', 'css', 'json', 'javascript'],
    })
  }
  return highlighterPromise
}
