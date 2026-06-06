export const PANEL_ROUTES = [
  { id: 'spring', path: '/spring', label: 'Spring tuner', shortcut: '1' },
  { id: 'easing', path: '/easing', label: 'Easing editor', shortcut: '2' },
  { id: 'tokens', path: '/tokens', label: 'Token editor', shortcut: '3' },
  { id: 'states', path: '/states', label: 'State explorer', shortcut: '4' },
  { id: 'gestures', path: '/gestures', label: 'Gesture sandbox', shortcut: '5' },
  { id: 'a11y', path: '/a11y', label: 'Accessibility audit', shortcut: '6' },
  { id: 'performance', path: '/performance', label: 'Performance monitor', shortcut: '7' },
  { id: '3d-task-cards', path: '/3d-task-cards', label: '3D task cards', shortcut: '8' },
] as const

export type PanelId = (typeof PANEL_ROUTES)[number]['id']
