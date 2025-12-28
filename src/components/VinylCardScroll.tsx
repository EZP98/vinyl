import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import './VinylCardScroll.css'

// Vinyl album data
const vinylAlbums = [
  { id: 1, title: 'Midnight Dreams', artist: 'Luna Nova', color: '#ff4d4d', year: '2024' },
  { id: 2, title: 'Electric Soul', artist: 'The Voltage', color: '#4d4dff', year: '2023' },
  { id: 3, title: 'Golden Hour', artist: 'Sunset Collective', color: '#ffd700', year: '2024' },
  { id: 4, title: 'Neon Nights', artist: 'Cyber Dreams', color: '#ff00ff', year: '2023' },
  { id: 5, title: 'Ocean Waves', artist: 'Pacific Sound', color: '#00bfff', year: '2024' },
  { id: 6, title: 'Velvet Underground', artist: 'Shadow Dance', color: '#8b008b', year: '2022' },
  { id: 7, title: 'Analog Love', artist: 'Retro Wave', color: '#ff6b6b', year: '2024' },
  { id: 8, title: 'Chrome Future', artist: 'Digital Pulse', color: '#00ffff', year: '2023' },
]

interface VinylCardProps {
  position: [number, number, number]
  color: string
  title: string
  artist: string
  onClick: () => void
  scrollOffset: number
  totalCards: number
}

// Single vinyl card in 3D space
const VinylCard = ({
  position,
  color,
  title,
  artist,
  onClick,
  scrollOffset,
  totalCards
}: VinylCardProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Create card texture with canvas
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 512, 512)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, adjustColor(color, -40))
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)

    // Vinyl circle
    ctx.beginPath()
    ctx.arc(256, 200, 120, 0, Math.PI * 2)
    ctx.fillStyle = '#0a0a0a'
    ctx.fill()

    // Vinyl grooves
    for (let r = 30; r < 110; r += 5) {
      ctx.beginPath()
      ctx.arc(256, 200, r, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(40, 40, 40, 0.5)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Center label
    ctx.beginPath()
    ctx.arc(256, 200, 25, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()

    // Text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 32px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(title.length > 15 ? title.substring(0, 15) + '...' : title, 256, 380)

    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = '20px Inter, sans-serif'
    ctx.fillText(artist, 256, 420)

    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [color, title, artist])

  // Calculate position based on scroll
  useFrame(() => {
    if (!meshRef.current) return

    // Calculate card's current position in the infinite scroll
    const spacing = 3
    const totalLength = totalCards * spacing
    let currentZ = position[2] + scrollOffset * 2

    // Wrap around for infinite scroll
    while (currentZ > totalLength / 2) currentZ -= totalLength
    while (currentZ < -totalLength / 2) currentZ += totalLength

    meshRef.current.position.z = currentZ

    // Calculate distance from center for effects
    const distanceFromCenter = Math.abs(currentZ)
    const maxDistance = 8

    // Opacity based on distance
    const material = meshRef.current.material as THREE.MeshStandardMaterial
    material.opacity = THREE.MathUtils.lerp(0.3, 1, 1 - Math.min(distanceFromCenter / maxDistance, 1))

    // Scale based on distance
    const scale = THREE.MathUtils.lerp(0.6, 1, 1 - Math.min(distanceFromCenter / maxDistance, 1))
    meshRef.current.scale.setScalar(hovered ? scale * 1.05 : scale)

    // Rotation based on position
    meshRef.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI * 0.1, currentZ / maxDistance)

    // X offset based on position (cards spread out)
    meshRef.current.position.x = position[0] + currentZ * 0.05
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <RoundedBox args={[2, 2, 0.05]} radius={0.1} smoothness={4}>
        <meshStandardMaterial
          map={texture}
          transparent
          roughness={0.3}
          metalness={0.1}
        />
      </RoundedBox>
    </mesh>
  )
}

// Helper to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount))
  return `rgb(${r}, ${g}, ${b})`
}

// Scene with all cards
const CardScene = ({
  onCardClick,
  scrollOffset
}: {
  onCardClick: (album: typeof vinylAlbums[0]) => void
  scrollOffset: number
}) => {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 8)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ff4d4d" />
      <pointLight position={[5, -5, 5]} intensity={0.3} color="#4d4dff" />

      {vinylAlbums.map((album, index) => (
        <VinylCard
          key={album.id}
          position={[0, 0, index * 3 - (vinylAlbums.length * 3) / 2]}
          color={album.color}
          title={album.title}
          artist={album.artist}
          onClick={() => onCardClick(album)}
          scrollOffset={scrollOffset}
          totalCards={vinylAlbums.length}
        />
      ))}
    </>
  )
}

// Modal for selected card
interface CardModalProps {
  album: typeof vinylAlbums[0] | null
  onClose: () => void
}

const CardModal = ({ album, onClose }: CardModalProps) => {
  if (!album) return null

  return (
    <div className="card-modal-overlay" onClick={onClose}>
      <div className="card-modal" onClick={(e) => e.stopPropagation()}>
        <button className="card-modal-close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="card-modal-vinyl" style={{ background: album.color }}>
          <div className="card-modal-disc">
            <div className="card-modal-grooves" />
            <div className="card-modal-label" style={{ background: album.color }} />
            <div className="card-modal-hole" />
          </div>
        </div>

        <div className="card-modal-info">
          <span className="card-modal-year">{album.year}</span>
          <h2 className="card-modal-title">{album.title}</h2>
          <p className="card-modal-artist">{album.artist}</p>

          <div className="card-modal-actions">
            <button className="card-modal-btn primary">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Play Now
            </button>
            <button className="card-modal-btn secondary">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component
const VinylCardScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [selectedAlbum, setSelectedAlbum] = useState<typeof vinylAlbums[0] | null>(null)
  const targetScrollOffset = useRef(0)
  const isDragging = useRef(false)
  const lastY = useRef(0)

  // Handle wheel scroll
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    targetScrollOffset.current += e.deltaY * 0.003
  }, [])

  // Handle touch/mouse drag
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true
    lastY.current = e.clientY
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return
    const deltaY = e.clientY - lastY.current
    targetScrollOffset.current -= deltaY * 0.01
    lastY.current = e.clientY
  }, [])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  // Smooth scroll animation
  useEffect(() => {
    let animationId: number

    const animate = () => {
      // Smooth interpolation
      setScrollOffset((prev) => {
        const diff = targetScrollOffset.current - prev
        return prev + diff * 0.1
      })
      animationId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationId)
  }, [])

  // Add wheel listener
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  return (
    <section className="vinyl-card-scroll-section">
      <div className="vinyl-scroll-header">
        <span className="vinyl-scroll-label">Featured Collection</span>
        <h2 className="vinyl-scroll-title">Explore Our Vinyls</h2>
        <p className="vinyl-scroll-description">
          Scroll or drag to browse through our curated selection
        </p>
      </div>

      <div
        ref={containerRef}
        className="vinyl-card-scroll-container"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <Canvas
          camera={{ fov: 50, position: [0, 0, 8] }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <CardScene
            onCardClick={setSelectedAlbum}
            scrollOffset={scrollOffset}
          />
        </Canvas>

        {/* Scroll indicators */}
        <div className="scroll-hint top">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </div>
        <div className="scroll-hint bottom">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      <CardModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
    </section>
  )
}

export default VinylCardScroll
