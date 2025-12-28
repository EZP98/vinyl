import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import './VinylCarousel3D.css'

// Album data with cover images
const albums = [
  {
    id: 1,
    title: 'Midnight Dreams',
    artist: 'Luna Nova',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
    color: '#ff4d4d'
  },
  {
    id: 2,
    title: 'Electric Soul',
    artist: 'The Voltage',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    color: '#4d4dff'
  },
  {
    id: 3,
    title: 'Golden Hour',
    artist: 'Sunset Collective',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    color: '#ffd700'
  },
  {
    id: 4,
    title: 'Neon Nights',
    artist: 'Cyber Dreams',
    cover: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
    color: '#ff00ff'
  },
  {
    id: 5,
    title: 'Ocean Waves',
    artist: 'Pacific Sound',
    cover: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=400&fit=crop',
    color: '#00bfff'
  },
  {
    id: 6,
    title: 'Velvet Underground',
    artist: 'Shadow Dance',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    color: '#8b008b'
  },
  {
    id: 7,
    title: 'Analog Love',
    artist: 'Retro Wave',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    color: '#ff6b6b'
  },
]

interface CardProps {
  position: [number, number, number]
  rotation: [number, number, number]
  album: typeof albums[0]
  index: number
  activeIndex: number
  onClick: () => void
}

// Single 3D Card
const Card3D = ({ position, rotation, album, index, activeIndex, onClick }: CardProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Load texture
  const texture = useLoader(TextureLoader, album.cover)

  const isActive = index === activeIndex
  const distance = Math.abs(index - activeIndex)

  useFrame(() => {
    if (!meshRef.current) return

    // Smooth hover animation
    const targetScale = hovered ? 1.08 : isActive ? 1.05 : 1 - distance * 0.05
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    )
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
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
      {/* Card geometry */}
      <boxGeometry args={[2, 2, 0.02]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.3}
        metalness={0.1}
      />

      {/* Glow effect for active card */}
      {isActive && (
        <pointLight
          position={[0, 0, 0.5]}
          intensity={0.5}
          color={album.color}
          distance={3}
        />
      )}
    </mesh>
  )
}

// Carousel Scene
const CarouselScene = ({
  activeIndex,
  onCardClick
}: {
  activeIndex: number
  onCardClick: (album: typeof albums[0]) => void
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  // Position camera
  useEffect(() => {
    camera.position.set(0, 0, 6)
    camera.lookAt(0, 0, 0)
  }, [camera])

  // Calculate card positions in a curved arc
  const cardPositions = useMemo(() => {
    return albums.map((_, i) => {
      const offset = i - activeIndex
      const x = offset * 2.5
      const z = -Math.abs(offset) * 1.5
      const rotationY = -offset * 0.3
      return {
        position: [x, 0, z] as [number, number, number],
        rotation: [0, rotationY, 0] as [number, number, number]
      }
    })
  }, [activeIndex])

  // Smooth transition animation
  useFrame(() => {
    if (!groupRef.current) return
    // Subtle floating animation
    groupRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.02
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <spotLight
        position={[0, 10, 10]}
        angle={0.5}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <pointLight position={[-5, 5, 5]} intensity={0.3} color="#ff4d4d" />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#4d4dff" />

      {albums.map((album, index) => (
        <Card3D
          key={album.id}
          position={cardPositions[index].position}
          rotation={cardPositions[index].rotation}
          album={album}
          index={index}
          activeIndex={activeIndex}
          onClick={() => onCardClick(album)}
        />
      ))}
    </group>
  )
}

// Main Component
const VinylCarousel3D = () => {
  const [activeIndex, setActiveIndex] = useState(3)
  const [selectedAlbum, setSelectedAlbum] = useState<typeof albums[0] | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)

  // Handle wheel scroll
  const handleWheel = (e: React.WheelEvent) => {
    const direction = e.deltaY > 0 ? 1 : -1
    setActiveIndex(prev => {
      const next = prev + direction
      return Math.max(0, Math.min(albums.length - 1, next))
    })
  }

  // Handle drag
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    startX.current = e.clientX
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const diff = startX.current - e.clientX
    if (Math.abs(diff) > 50) {
      const direction = diff > 0 ? 1 : -1
      setActiveIndex(prev => {
        const next = prev + direction
        return Math.max(0, Math.min(albums.length - 1, next))
      })
      startX.current = e.clientX
    }
  }

  const handlePointerUp = () => {
    isDragging.current = false
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight') {
        setActiveIndex(prev => Math.min(albums.length - 1, prev + 1))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const currentAlbum = albums[activeIndex]

  return (
    <section className="vinyl-carousel-section">
      <div
        ref={containerRef}
        className="carousel-canvas-container"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <Canvas
          camera={{ fov: 50, position: [0, 0, 6] }}
          gl={{ antialias: true, alpha: true }}
        >
          <CarouselScene
            activeIndex={activeIndex}
            onCardClick={setSelectedAlbum}
          />
        </Canvas>
      </div>

      {/* Album Info */}
      <div className="carousel-info">
        <span className="carousel-number">
          {String(activeIndex + 1).padStart(2, '0')} / {String(albums.length).padStart(2, '0')}
        </span>
        <h2 className="carousel-title">{currentAlbum.title}</h2>
        <p className="carousel-artist">{currentAlbum.artist}</p>
      </div>

      {/* Navigation dots */}
      <div className="carousel-dots">
        {albums.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        className="carousel-arrow prev"
        onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
        disabled={activeIndex === 0}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="carousel-arrow next"
        onClick={() => setActiveIndex(prev => Math.min(albums.length - 1, prev + 1))}
        disabled={activeIndex === albums.length - 1}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Modal */}
      {selectedAlbum && (
        <div className="carousel-modal-overlay" onClick={() => setSelectedAlbum(null)}>
          <div className="carousel-modal" onClick={e => e.stopPropagation()}>
            <button className="carousel-modal-close" onClick={() => setSelectedAlbum(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <img src={selectedAlbum.cover} alt={selectedAlbum.title} className="carousel-modal-image" />
            <div className="carousel-modal-content">
              <h3>{selectedAlbum.title}</h3>
              <p>{selectedAlbum.artist}</p>
              <button className="carousel-modal-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Play Album
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default VinylCarousel3D
