import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  MeshReflectorMaterial,
  PerspectiveCamera,
} from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { TaskCard3D } from './TaskCard3D'
import type { DragState, ExperimentSettings, Task } from './types'

interface CardSlot {
  x: number
  y: number
  z: number
  rotY: number
}

interface AnimatedCard {
  task: Task
  slotIndex: number
  current: CardSlot
  velocity: CardSlot
}

export interface SceneProps {
  tasks: Task[]
  settings: ExperimentSettings
  order: number[]
  onReorder: (next: number[]) => void
  dragState: DragState
  setDragState: React.Dispatch<React.SetStateAction<DragState>>
}

const SPRING = { stiffness: 140, damping: 18 }

function springToward(current: number, target: number, velocity: number, dt: number) {
  const force = -SPRING.stiffness * (current - target) - SPRING.damping * velocity
  const nextVelocity = velocity + force * dt
  return [current + nextVelocity * dt, nextVelocity] as const
}

function slotFromBarrelOffset(offset: number, barrelFactor: number): CardSlot {
  const angle = offset * barrelFactor
  return {
    x: Math.sin(angle) * 1.6,
    y: Math.sin(angle * 0.5) * 0.08,
    z: -Math.cos(angle) * 1.4 + 1.4,
    rotY: -angle * 0.85,
  }
}

/** 3D scene: reflective floor, environment lighting, draggable card carousel. */
export function Scene({
  tasks,
  settings,
  order,
  onReorder,
  dragState,
  setDragState,
}: SceneProps) {
  const { geometry, layout, animation, lighting } = settings
  const spacing = geometry.width + layout.gap
  const scrollRef = useRef(0)
  const cardsRef = useRef<AnimatedCard[]>([])
  const [, tick] = useState(0)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const { camera, gl } = useThree()
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const pointer = useMemo(() => new THREE.Vector2(), [])
  const dragPlanePoint = useRef(new THREE.Vector3())

  const visibleTasks = useMemo(
    () =>
      order
        .slice(0, layout.cardCount)
        .map((id) => tasks.find((t) => t.id === id))
        .filter((t): t is Task => Boolean(t)),
    [order, tasks, layout.cardCount],
  )

  useEffect(() => {
    cardsRef.current = visibleTasks.map((task, slotIndex) => {
      const existing = cardsRef.current.find((c) => c.task.id === task.id)
      const offset = slotIndex - (visibleTasks.length - 1) / 2
      const target = slotFromBarrelOffset(offset * spacing, 0.12)
      return {
        task,
        slotIndex,
        current: existing?.current ?? { ...target },
        velocity: existing?.velocity ?? { x: 0, y: 0, z: 0, rotY: 0 },
      }
    })
    tick((n) => n + 1)
  }, [visibleTasks, spacing])

  const getSlotIndexFromWorldX = useCallback(
    (worldX: number) => {
      const centerOffset = ((visibleTasks.length - 1) / 2) * spacing
      const raw = (worldX + centerOffset + scrollRef.current) / spacing
      return Math.max(0, Math.min(visibleTasks.length - 1, Math.round(raw)))
    },
    [visibleTasks.length, spacing],
  )

  useEffect(() => {
    if (dragState.taskId === null) return

    const onMove = (event: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hit = new THREE.Vector3()
      if (!raycaster.ray.intersectPlane(plane, hit)) return

      setDragState((prev) => ({
        ...prev,
        offsetX: hit.x - dragPlanePoint.current.x,
        pointerX: hit.x,
      }))
    }

    const onUp = () => {
      setDragState((prev) => {
        if (prev.taskId === null) return prev
        const fromIndex = order.indexOf(prev.taskId)
        const targetIndex = getSlotIndexFromWorldX(prev.pointerX)
        if (fromIndex !== -1 && targetIndex !== fromIndex) {
          const next = [...order]
          const [moved] = next.splice(fromIndex, 1)
          next.splice(targetIndex, 0, moved)
          onReorder(next)
        }
        return { taskId: null, offsetX: 0, pointerX: 0 }
      })
      document.body.style.cursor = 'auto'
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [
    dragState.taskId,
    camera,
    gl,
    order,
    onReorder,
    plane,
    raycaster,
    pointer,
    setDragState,
    getSlotIndexFromWorldX,
  ])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.033)

    if (!animation.paused && dragState.taskId === null) {
      scrollRef.current += layout.scrollSpeed * dt * animation.rotationSpeed * 4
    }

    const centerOffset = ((visibleTasks.length - 1) / 2) * spacing

    cardsRef.current.forEach((card) => {
      let slotIndex = card.slotIndex
      const isDragging = dragState.taskId === card.task.id

      if (isDragging) {
        slotIndex = getSlotIndexFromWorldX(dragState.pointerX)
      }

      const baseOffset = slotIndex * spacing - centerOffset - scrollRef.current
      const target = slotFromBarrelOffset(baseOffset, 0.12)

      if (isDragging) {
        target.x = dragState.pointerX
        target.y = 0.25
        target.z = 0.6
        target.rotY = 0
      }

      ;(['x', 'y', 'z', 'rotY'] as const).forEach((key) => {
        const [next, vel] = springToward(
          card.current[key],
          target[key],
          card.velocity[key],
          dt,
        )
        card.current[key] = next
        card.velocity[key] = vel
      })
    })

    tick((n) => n + 1)
  })

  const startDrag = (taskId: number, e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    dragPlanePoint.current.copy(e.point)
    setDragState({ taskId, offsetX: 0, pointerX: e.point.x })
  }

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.8, 9]} fov={42} />
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 12, 28]} />

      <ambientLight intensity={lighting.ambientIntensity} />
      <directionalLight
        castShadow
        intensity={lighting.directionalIntensity}
        position={[6, 10, 4]}
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight intensity={lighting.pointIntensity} position={[-4, 3, 6]} color="#a78bfa" />
      <pointLight intensity={lighting.pointIntensity * 0.6} position={[5, 2, -2]} color="#38bdf8" />

      <Environment preset="city" environmentIntensity={lighting.envIntensity} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.65, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          blur={[320, 120]}
          resolution={1024}
          mixBlur={1}
          mixStrength={0.45}
          roughness={0.85}
          depthScale={0.6}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a12"
          metalness={0.35}
          mirror={0.55}
        />
      </mesh>

      <ContactShadows
        position={[0, -1.64, 0]}
        opacity={0.45}
        scale={22}
        blur={2.8}
        far={4}
        color="#000000"
      />

      {cardsRef.current.map((card) => (
        <TaskCard3D
          key={card.task.id}
          task={card.task}
          geometry={geometry}
          position={new THREE.Vector3(card.current.x, card.current.y, card.current.z)}
          rotation={new THREE.Euler(0, card.current.rotY, 0)}
          scale={hoveredId === card.task.id ? 1.04 : 1}
          hovered={hoveredId === card.task.id}
          dragging={dragState.taskId === card.task.id}
          onHover={(h) => setHoveredId(h ? card.task.id : null)}
          onPointerDown={(e) => startDrag(card.task.id, e)}
        />
      ))}
    </>
  )
}
