export type TaskStatus = 'In Progress' | 'Planned' | 'Active' | 'Done' | 'Blocked' | 'Review'

export interface Task {
  id: number
  category: string
  title: string
  desc: string
  status: TaskStatus
  date: string
  color: string
}

export interface CardGeometry {
  width: number
  height: number
  depth: number
  cornerRadius: number
  roughness: number
  metalness: number
  baseColor: string
}

export interface LayoutSettings {
  gap: number
  cardCount: number
  scrollSpeed: number
}

export interface AnimationSettings {
  rotationSpeed: number
  paused: boolean
}

export interface LightingSettings {
  ambientIntensity: number
  directionalIntensity: number
  pointIntensity: number
  envIntensity: number
}

export interface ExperimentSettings {
  geometry: CardGeometry
  layout: LayoutSettings
  animation: AnimationSettings
  lighting: LightingSettings
}

export interface DragState {
  taskId: number | null
  offsetX: number
  pointerX: number
}

export const DEFAULT_SETTINGS: ExperimentSettings = {
  geometry: {
    width: 2.2,
    height: 3,
    depth: 0.18,
    cornerRadius: 0.14,
    roughness: 0.22,
    metalness: 0.65,
    baseColor: '#14141f',
  },
  layout: {
    gap: 0.55,
    cardCount: 8,
    scrollSpeed: 0.35,
  },
  animation: {
    rotationSpeed: 0.18,
    paused: false,
  },
  lighting: {
    ambientIntensity: 0.35,
    directionalIntensity: 1.4,
    pointIntensity: 0.9,
    envIntensity: 0.85,
  },
}
