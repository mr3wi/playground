# Frontend Playground

A self-contained, single-page experimental playground for interaction design and design engineering. Equal parts Storybook, dev-tools panel, and physics sandbox — keyboard-first, copy-paste outputs, dark mode.

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Panels

| Shortcut | Panel | Route |
|----------|-------|-------|
| ⌘1 | Spring tuner | `/spring` |
| ⌘2 | Easing editor | `/easing` |
| ⌘3 | Token editor | `/tokens` |
| ⌘4 | State explorer | `/states` |
| ⌘5 | Gesture sandbox | `/gestures` |
| ⌘6 | Accessibility audit | `/a11y` |
| ⌘7 | Performance monitor | `/performance` |

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| ⌘1–7 | Jump to panel |
| ⌘B | Toggle sidebar |
| ⌘K | Command palette |
| ⌘/ | Toggle code panel |
| Space | Trigger animation (Spring / Easing) |
| R | Reset current panel |

Panel state is synced to URL search params (debounced 300ms) for shareable links.

## Tech stack

- React 18 + Vite + TypeScript (strict)
- Tailwind CSS v3
- Motion (Framer Motion v11)
- Radix UI primitives
- Zustand
- D3 v7 (Spring curve, FPS sparkline)
- Shiki
- React Router v6

## Adding a new panel

1. Create `src/panels/<name>/<Name>Panel.tsx` (default export for lazy loading).
2. Add a slice to `src/store/usePlaygroundStore.ts` if the panel needs persisted state.
3. Register the route in `src/lib/panelRoutes.ts` and `src/App.tsx` (`lazy` import + `<Route>`).
4. Add a nav item in `Sidebar.tsx` via `PANEL_ROUTES`.
5. Optional: wire `useUrlState` for URL persistence.

## License

MIT
