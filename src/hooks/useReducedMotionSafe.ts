import { useReducedMotion } from 'motion/react'

/** Returns true when user prefers reduced motion — skip animations. */
export function useReducedMotionSafe(): boolean {
  return useReducedMotion() ?? false
}
