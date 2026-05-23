/** Estimates spring settle time and character from physics params. */
export function useSpringPhysics(stiffness: number, damping: number, mass: number) {
  const omega = Math.sqrt(stiffness / mass)
  const zeta = damping / (2 * Math.sqrt(stiffness * mass))
  const duration = zeta < 1 ? Math.ceil((4 / (zeta * omega)) * 1000) : Math.ceil((4 / omega) * 1000)

  let bounce: 'None' | 'Subtle' | 'Medium' | 'High' = 'None'
  if (zeta < 1) {
    if (zeta > 0.8) bounce = 'Subtle'
    else if (zeta > 0.5) bounce = 'Medium'
    else bounce = 'High'
  }

  let feel: 'Floaty' | 'Balanced' | 'Snappy' | 'Rigid' = 'Balanced'
  if (stiffness < 100 && damping < 15) feel = 'Floaty'
  else if (stiffness > 400 || damping > 40) feel = 'Rigid'
  else if (stiffness > 250) feel = 'Snappy'

  const cssBezier = zeta < 1 ? '0.34, 1.56, 0.64, 1' : '0.25, 0.1, 0.25, 1'
  const cssDuration = Math.min(Math.max(duration, 150), 800)

  return { duration, bounce, feel, zeta, cssBezier, cssDuration }
}
