export interface EasingPreset {
  name: string
  p1x: number
  p1y: number
  p2x: number
  p2y: number
}

export const EASING_PRESETS: EasingPreset[] = [
  { name: 'Ease', p1x: 0.25, p1y: 0.1, p2x: 0.25, p2y: 1 },
  { name: 'Ease-in', p1x: 0.42, p1y: 0, p2x: 1, p2y: 1 },
  { name: 'Ease-out', p1x: 0, p1y: 0, p2x: 0.58, p2y: 1 },
  { name: 'Ease-in-out', p1x: 0.42, p1y: 0, p2x: 0.58, p2y: 1 },
  { name: 'Linear', p1x: 0, p1y: 0, p2x: 1, p2y: 1 },
  { name: 'Snappy', p1x: 0.2, p1y: 0.8, p2x: 0.2, p2y: 1 },
  { name: 'Bouncy', p1x: 0.34, p1y: 1.56, p2x: 0.64, p2y: 1 },
  { name: 'Sharp', p1x: 0.4, p1y: 0, p2x: 0.6, p2y: 1 },
]
