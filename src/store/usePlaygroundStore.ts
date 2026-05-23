import { create } from 'zustand'

export interface SpringSlice {
  stiffness: number
  damping: number
  mass: number
  setSpring: (partial: Partial<Pick<SpringSlice, 'stiffness' | 'damping' | 'mass'>>) => void
  resetSpring: () => void
}

export interface EasingSlice {
  p1x: number
  p1y: number
  p2x: number
  p2y: number
  setEasing: (partial: Partial<Pick<EasingSlice, 'p1x' | 'p1y' | 'p2x' | 'p2y'>>) => void
  resetEasing: () => void
}

export interface TokenSlice {
  colorPrimary: string
  colorAccent: string
  colorSurface: string
  radiusBase: number
  spacingBase: number
  fontSizeBase: number
  setTokens: (partial: Partial<Omit<TokenSlice, 'setTokens' | 'resetTokens'>>) => void
  resetTokens: () => void
}

export interface StatesSlice {
  component: 'button' | 'input' | 'badge' | 'card' | 'toggle' | 'select'
  interactive: boolean
  lockedState: string | null
  setStates: (partial: Partial<Omit<StatesSlice, 'setStates' | 'resetStates'>>) => void
  resetStates: () => void
}

export interface GesturesSlice {
  filter: 'all' | 'pointer' | 'touch' | 'keyboard'
  setGestures: (partial: Partial<Pick<GesturesSlice, 'filter'>>) => void
  resetGestures: () => void
}

export interface A11ySlice {
  fgColor: string
  bgColor: string
  colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
  showFocusOrder: boolean
  htmlSnippet: string
  setA11y: (partial: Partial<Omit<A11ySlice, 'setA11y' | 'resetA11y'>>) => void
  resetA11y: () => void
}

export interface PerfSlice {
  animatedProperty: string
  stressLevel: 'idle' | 'light' | 'medium' | 'heavy'
  setPerf: (partial: Partial<Pick<PerfSlice, 'animatedProperty' | 'stressLevel'>>) => void
  resetPerf: () => void
}

export interface UISlice {
  sidebarCollapsed: boolean
  codePanelOpen: boolean
  theme: 'light' | 'dark'
  toastMessage: string | null
  toggleSidebar: () => void
  setCodePanelOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  showToast: (message: string) => void
  clearToast: () => void
}

export type PlaygroundStore = SpringSlice &
  EasingSlice &
  TokenSlice &
  StatesSlice &
  GesturesSlice &
  A11ySlice &
  PerfSlice &
  UISlice

const defaultSpring = { stiffness: 200, damping: 20, mass: 1 }
const defaultEasing = { p1x: 0.34, p1y: 1.56, p2x: 0.64, p2y: 1 }
const defaultTokens = {
  colorPrimary: '#7C3AED',
  colorAccent: '#059669',
  colorSurface: '#F8F7FF',
  radiusBase: 8,
  spacingBase: 12,
  fontSizeBase: 14,
}

/** Global Zustand store with one slice per panel. */
export const usePlaygroundStore = create<PlaygroundStore>((set) => ({
  ...defaultSpring,
  setSpring: (partial) => set((s) => ({ ...s, ...partial })),
  resetSpring: () => set(defaultSpring),

  ...defaultEasing,
  setEasing: (partial) => set((s) => ({ ...s, ...partial })),
  resetEasing: () => set(defaultEasing),

  ...defaultTokens,
  setTokens: (partial) => set((s) => ({ ...s, ...partial })),
  resetTokens: () => set(defaultTokens),

  component: 'button',
  interactive: false,
  lockedState: null,
  setStates: (partial) => set((s) => ({ ...s, ...partial })),
  resetStates: () =>
    set({ component: 'button', interactive: false, lockedState: null }),

  filter: 'all',
  setGestures: (partial) => set((s) => ({ ...s, ...partial })),
  resetGestures: () => set({ filter: 'all' }),

  fgColor: '#1A1A2E',
  bgColor: '#F8F7FF',
  colorBlindness: 'none',
  showFocusOrder: false,
  htmlSnippet: '<button type="button"><span class="sr-only">Menu</span></button>',
  setA11y: (partial) => set((s) => ({ ...s, ...partial })),
  resetA11y: () =>
    set({
      fgColor: '#1A1A2E',
      bgColor: '#F8F7FF',
      colorBlindness: 'none',
      showFocusOrder: false,
      htmlSnippet: '<button type="button"><span class="sr-only">Menu</span></button>',
    }),

  animatedProperty: 'transform',
  stressLevel: 'idle',
  setPerf: (partial) => set((s) => ({ ...s, ...partial })),
  resetPerf: () => set({ animatedProperty: 'transform', stressLevel: 'idle' }),

  sidebarCollapsed: false,
  codePanelOpen: true,
  theme: 'dark',
  toastMessage: null,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCodePanelOpen: (open) => set({ codePanelOpen: open }),
  setTheme: (theme) => set({ theme }),
  showToast: (message) => set({ toastMessage: message }),
  clearToast: () => set({ toastMessage: null }),
}))
