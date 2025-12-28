import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import './CardStack3D.css'

// Rock album covers (music-themed imagery)
const albums = [
  { id: 1, cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=512&h=512&fit=crop' }, // Electric guitar
  { id: 2, cover: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=512&h=512&fit=crop' }, // Rock concert
  { id: 3, cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=512&h=512&fit=crop' }, // Concert lights
  { id: 4, cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=512&h=512&fit=crop' }, // Guitarist
  { id: 5, cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=512&h=512&fit=crop' }, // Concert crowd
  { id: 6, cover: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=512&h=512&fit=crop' }, // Stage lights
  { id: 7, cover: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=512&h=512&fit=crop' }, // Concert
  { id: 8, cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=512&h=512&fit=crop' }, // Music vibes
  { id: 9, cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=512&h=512&fit=crop' }, // Festival
  { id: 10, cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=512&h=512&fit=crop' }, // DJ/Music
]

// Create vinyl disc texture
const createVinylTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  // Black vinyl
  ctx.fillStyle = '#0a0a0a'
  ctx.beginPath()
  ctx.arc(256, 256, 256, 0, Math.PI * 2)
  ctx.fill()

  // Grooves
  for (let r = 60; r < 240; r += 3) {
    ctx.beginPath()
    ctx.arc(256, 256, r, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(30, 30, 30, ${0.3 + Math.random() * 0.3})`
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // Shine highlight
  const gradient = ctx.createLinearGradient(100, 100, 400, 400)
  gradient.addColorStop(0, 'rgba(255,255,255,0.1)')
  gradient.addColorStop(0.5, 'rgba(255,255,255,0)')
  gradient.addColorStop(1, 'rgba(255,255,255,0.05)')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(256, 256, 250, 0, Math.PI * 2)
  ctx.fill()

  // Center label
  ctx.beginPath()
  ctx.arc(256, 256, 50, 0, Math.PI * 2)
  ctx.fillStyle = '#ff4d4d'
  ctx.fill()

  // Center hole
  ctx.beginPath()
  ctx.arc(256, 256, 8, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

interface CardProps {
  index: number
  scrollY: number
  cover: string
  totalCards: number
  vinylTexture: THREE.Texture
}

// Vinyl record with sleeve
const VinylCard = ({ index, scrollY, cover, totalCards, vinylTexture }: CardProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const vinylRef = useRef<THREE.Mesh>(null)
  const coverTexture = useLoader(TextureLoader, cover)

  useFrame(() => {
    if (!groupRef.current) return

    const cardSpacing = 0.5
    const baseY = index * cardSpacing
    const scrollOffset = scrollY * 0.3

    let y = baseY - scrollOffset
    const totalHeight = totalCards * cardSpacing

    // Infinite wrap
    while (y < -3) y += totalHeight
    while (y > totalHeight - 3) y -= totalHeight

    // Pyramid depth - closer cards are in front
    const normalizedY = y / 3
    const z = -Math.pow(Math.abs(normalizedY), 1.5) * 2

    // X spread - slight fan effect
    const x = normalizedY * 0.3

    // Rotation - tilt back
    const rotX = 0.6
    const rotY = normalizedY * 0.1

    groupRef.current.position.set(x, y * 0.8, z)
    groupRef.current.rotation.set(rotX, rotY, 0)

    // Scale based on depth
    const scale = THREE.MathUtils.mapLinear(z, -4, 0, 0.5, 1.1)
    groupRef.current.scale.setScalar(Math.max(0.3, scale))

    // Vinyl rotation (spinning effect for front cards)
    if (vinylRef.current && Math.abs(y) < 1) {
      vinylRef.current.rotation.z += 0.01 * (1 - Math.abs(normalizedY))
    }

    // Opacity
    const opacity = THREE.MathUtils.clamp(1 - Math.abs(normalizedY) * 0.4, 0.1, 1)
    groupRef.current.children.forEach(child => {
      if ((child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
        if (mat.opacity !== undefined) mat.opacity = opacity
      }
    })
  })

  return (
    <group ref={groupRef}>
      {/* Album cover sleeve */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshStandardMaterial
          map={coverTexture}
          transparent
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Vinyl disc peeking out */}
      <mesh ref={vinylRef} position={[0.3, 0, 0]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.75, 64]} />
        <meshStandardMaterial
          map={vinylTexture}
          transparent
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Sleeve edge shadow */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1.82, 1.82]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

// Scene
const StackScene = ({ scrollY }: { scrollY: number }) => {
  const { camera } = useThree()
  const vinylTexture = useRef(createVinylTexture())

  useEffect(() => {
    camera.position.set(0, 2, 5)
    camera.lookAt(0, 0, -1)
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight
        position={[0, 10, 8]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        castShadow
      />
      <pointLight position={[-3, 3, 3]} intensity={0.3} color="#ff4d4d" />
      <pointLight position={[3, 3, 3]} intensity={0.3} color="#4d4dff" />

      {albums.map((album, index) => (
        <VinylCard
          key={album.id}
          index={index}
          scrollY={scrollY}
          cover={album.cover}
          totalCards={albums.length}
          vinylTexture={vinylTexture.current}
        />
      ))}
    </>
  )
}

// Main Component
const CardStack3D = () => {
  const [scrollY, setScrollY] = useState(0)
  const scrollRef = useRef(0)
  const targetRef = useRef(0)
  const velocityRef = useRef(0)
  const isDragging = useRef(false)
  const lastY = useRef(0)
  const lastTime = useRef(Date.now())

  // Smooth animation with better easing
  useEffect(() => {
    let animationId: number

    const animate = () => {
      const now = Date.now()
      const delta = Math.min((now - lastTime.current) / 16, 2)
      lastTime.current = now

      if (!isDragging.current) {
        // Apply momentum with smooth deceleration
        velocityRef.current *= 0.92
        targetRef.current += velocityRef.current * delta

        // Stop when very slow
        if (Math.abs(velocityRef.current) < 0.0001) {
          velocityRef.current = 0
        }
      }

      // Smooth interpolation (lerp)
      const diff = targetRef.current - scrollRef.current
      scrollRef.current += diff * 0.12 * delta

      setScrollY(scrollRef.current)
      animationId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationId)
  }, [])

  // Wheel with better sensitivity
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY * 0.001
    velocityRef.current += delta
    targetRef.current += delta * 0.5
  }

  // Touch/mouse drag
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    lastY.current = e.clientY
    velocityRef.current = 0
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return

    const deltaY = (lastY.current - e.clientY) * 0.008
    targetRef.current += deltaY
    velocityRef.current = deltaY * 0.5
    lastY.current = e.clientY
  }

  const handlePointerUp = () => {
    isDragging.current = false
  }

  return (
    <div
      className="card-stack-container"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas
        camera={{ fov: 45, position: [0, 2, 5] }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 3, 10]} />
        <Suspense fallback={null}>
          <StackScene scrollY={scrollY} />
        </Suspense>
      </Canvas>

      <div className="stack-gradient-top" />
      <div className="stack-gradient-bottom" />

      <div className="stack-scroll-hint">
        <span>Scroll to explore</span>
        <div className="scroll-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default CardStack3D
