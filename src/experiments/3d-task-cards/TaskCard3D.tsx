import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { CardGeometry, Task } from './types'

const STATUS_STYLES: Record<Task['status'], string> = {
  'In Progress': 'bg-amber-500/20 text-amber-300 ring-amber-400/30',
  Planned: 'bg-sky-500/20 text-sky-300 ring-sky-400/30',
  Active: 'bg-emerald-500/20 text-emerald-300 ring-emerald-400/30',
  Done: 'bg-violet-500/20 text-violet-300 ring-violet-400/30',
  Blocked: 'bg-rose-500/20 text-rose-300 ring-rose-400/30',
  Review: 'bg-indigo-500/20 text-indigo-300 ring-indigo-400/30',
}

export interface TaskCard3DProps {
  task: Task
  geometry: CardGeometry
  position: THREE.Vector3
  rotation: THREE.Euler
  scale: number
  hovered: boolean
  dragging: boolean
  onHover: (hovered: boolean) => void
  onPointerDown: (e: ThreeEvent<PointerEvent>) => void
}

/** Single rounded cuboid card with HTML face overlay and spring-driven transforms. */
export function TaskCard3D({
  task,
  geometry,
  position,
  rotation,
  scale,
  hovered,
  dragging,
  onHover,
  onPointerDown,
}: TaskCard3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.MeshStandardMaterial>(null)
  const targetLift = hovered || dragging ? 0.35 : 0
  const targetGlow = hovered ? 0.45 : dragging ? 0.25 : 0
  const lift = useRef(0)
  const liftVel = useRef(0)
  const glow = useRef(0)
  const glowVel = useRef(0)
  const smoothScale = useRef(1)
  const scaleVel = useRef(0)

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    const dt = Math.min(delta, 0.05)
    const stiffness = dragging ? 280 : 180
    const damping = dragging ? 22 : 16

    const springStep = (current: number, target: number, vel: number) => {
      const force = -stiffness * (current - target) - damping * vel
      const nextVel = vel + force * dt
      return [current + nextVel * dt, nextVel] as const
    }

    ;[lift.current, liftVel.current] = springStep(lift.current, targetLift, liftVel.current)
    ;[glow.current, glowVel.current] = springStep(glow.current, targetGlow, glowVel.current)
    ;[smoothScale.current, scaleVel.current] = springStep(
      smoothScale.current,
      scale,
      scaleVel.current,
    )

    group.position.set(position.x, position.y + lift.current, position.z)
    group.rotation.copy(rotation)
    group.scale.setScalar(smoothScale.current)

    if (glowRef.current) {
      glowRef.current.emissiveIntensity = glow.current
    }
  })

  const { width, height, depth, cornerRadius, roughness, metalness, baseColor } = geometry

  return (
    <group ref={groupRef}>
      {/* Category accent bar */}
      <mesh position={[0, height / 2 - 0.08, depth / 2 + 0.002]}>
        <boxGeometry args={[width - 0.12, 0.06, 0.02]} />
        <meshStandardMaterial color={task.color} emissive={task.color} emissiveIntensity={0.35} />
      </mesh>

      <RoundedBox
        args={[width, height, depth]}
        radius={cornerRadius}
        smoothness={8}
        castShadow
        receiveShadow
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(true)
          document.body.style.cursor = 'grab'
        }}
        onPointerOut={() => {
          onHover(false)
          if (!dragging) document.body.style.cursor = 'auto'
        }}
        onPointerDown={(e) => {
          e.stopPropagation()
          onPointerDown(e)
          document.body.style.cursor = 'grabbing'
        }}
      >
        <meshStandardMaterial
          ref={glowRef}
          color={baseColor}
          roughness={roughness}
          metalness={metalness}
          emissive={task.color}
          envMapIntensity={1.2}
        />
      </RoundedBox>

      {/* Readable HTML overlay on card face */}
      <Html
        transform
        occlude
        distanceFactor={1.35}
        position={[0, 0, depth / 2 + 0.02]}
        style={{
          width: `${width * 118}px`,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div className="flex h-full flex-col rounded-xl px-3 py-3 text-left">
          <div
            className="mb-3 h-1 w-12 rounded-full"
            style={{ backgroundColor: task.color, boxShadow: `0 0 12px ${task.color}88` }}
          />
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
            {task.category}
          </p>
          <h3 className="mb-2 text-[15px] font-bold leading-tight text-white drop-shadow-md">
            {task.title}
          </h3>
          <p className="mb-auto text-[11px] leading-relaxed text-white/55">{task.desc}</p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ring-1 ${STATUS_STYLES[task.status]}`}
            >
              {task.status}
            </span>
            <span className="text-[10px] font-medium text-white/40">{task.date}</span>
          </div>
        </div>
      </Html>

      {/* Hover rim light */}
      {(hovered || dragging) && (
        <mesh position={[0, 0, depth / 2 + 0.03]}>
          <planeGeometry args={[width + 0.08, height + 0.08]} />
          <meshBasicMaterial
            color={task.color}
            transparent
            opacity={dragging ? 0.18 : 0.12}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  )
}
