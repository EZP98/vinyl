import { useState, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import './BundleSection.css'

// Music Note Shape Component
const MusicNote = ({ position, scale, speed, rotationSpeed }: {
  position: [number, number, number]
  scale: number
  speed: number
  rotationSpeed: number
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const initialY = position[1]

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const time = clock.getElapsedTime()

    // Floating motion
    meshRef.current.position.y = initialY + Math.sin(time * speed) * 0.3
    meshRef.current.position.x = position[0] + Math.sin(time * speed * 0.5) * 0.1

    // Gentle rotation
    meshRef.current.rotation.z = Math.sin(time * rotationSpeed) * 0.2
    meshRef.current.rotation.y += 0.005
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.15}
      />
    </mesh>
  )
}

// Sparkle particle
const Sparkle = ({ position, delay }: {
  position: [number, number, number]
  delay: number
}) => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const time = clock.getElapsedTime() + delay

    // Twinkle effect
    const twinkle = Math.sin(time * 3) * 0.5 + 0.5
    meshRef.current.scale.setScalar(twinkle * 0.15 + 0.05)

    // Slow drift
    meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.05, 6, 6]} />
      <meshBasicMaterial
        color="#ff6b6b"
        transparent
        opacity={0.4}
      />
    </mesh>
  )
}

// Main particles scene
const MusicParticlesScene = () => {
  const groupRef = useRef<THREE.Group>(null)

  // Generate random positions for music notes
  const musicNotes = useMemo(() => {
    const notes = []
    for (let i = 0; i < 15; i++) {
      notes.push({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 3 - 2
        ] as [number, number, number],
        scale: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 0.5 + 0.3,
        rotationSpeed: Math.random() * 0.3 + 0.1
      })
    }
    return notes
  }, [])

  // Generate sparkles
  const sparkles = useMemo(() => {
    const s = []
    for (let i = 0; i < 30; i++) {
      s.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 4 - 1
        ] as [number, number, number],
        delay: Math.random() * 10
      })
    }
    return s
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    // Very slow rotation of entire group
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.1
  })

  return (
    <group ref={groupRef}>
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />

      {/* Music notes */}
      {musicNotes.map((note, i) => (
        <MusicNote key={`note-${i}`} {...note} />
      ))}

      {/* Sparkles */}
      {sparkles.map((sparkle, i) => (
        <Sparkle key={`sparkle-${i}`} {...sparkle} />
      ))}

      {/* Floating rings (vinyl grooves effect) */}
      {[1, 1.5, 2, 2.5].map((radius, i) => (
        <mesh key={`ring-${i}`} rotation={[Math.PI / 2, 0, 0]} position={[0, -1, -3]}>
          <ringGeometry args={[radius, radius + 0.02, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.05 - i * 0.01}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// WebGL Background Canvas
const ParticlesCanvas = () => {
  return (
    <div className="particles-canvas">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <MusicParticlesScene />
        </Suspense>
      </Canvas>
    </div>
  )
}

interface ProductProps {
  cover: string
  vinylColor: 'black' | 'white' | 'clear'
  label: string
  isHovered: boolean
  onHover: (hover: boolean) => void
}

// CSS-based vinyl disc
const VinylDisc = ({ color }: { color: 'black' | 'white' | 'clear' }) => {
  const colors = {
    black: { main: '#1a1a1a', groove: '#0a0a0a', label: '#333' },
    white: { main: '#e8e8e8', groove: '#d0d0d0', label: '#f5f5f5' },
    clear: { main: 'rgba(200,200,200,0.3)', groove: 'rgba(150,150,150,0.3)', label: 'rgba(255,255,255,0.5)' }
  }
  const c = colors[color]

  return (
    <svg viewBox="0 0 200 200" className="vinyl-svg">
      {/* Main disc */}
      <circle cx="100" cy="100" r="98" fill={c.main} />
      {/* Grooves */}
      {[90, 80, 70, 60, 50].map((r, i) => (
        <circle key={i} cx="100" cy="100" r={r} fill="none" stroke={c.groove} strokeWidth="0.5" />
      ))}
      {/* Label area */}
      <circle cx="100" cy="100" r="35" fill={c.label} />
      {/* Center hole */}
      <circle cx="100" cy="100" r="4" fill="#0a0a0a" />
      {/* Shine effect */}
      <ellipse cx="70" cy="70" rx="40" ry="30" fill="rgba(255,255,255,0.05)" transform="rotate(-45 70 70)" />
    </svg>
  )
}

const VinylProduct = ({ cover, vinylColor, label, isHovered, onHover }: ProductProps) => {
  return (
    <div
      className="vinyl-product"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="vinyl-product-inner">
        {/* Vinyl disc - slides out on hover */}
        <div className={`vinyl-disc ${isHovered ? 'slide-out' : ''}`}>
          <VinylDisc color={vinylColor} />
        </div>

        {/* Album cover */}
        <div className="album-cover">
          <img src={cover} alt={label} />
        </div>
      </div>
      <span className="product-label">{label}</span>
    </div>
  )
}

const PlusIcon = () => (
  <div className="plus-icon">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 0v18M0 9h18" stroke="currentColor" strokeWidth="1" />
    </svg>
  </div>
)

const BundleSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const products: { cover: string; vinylColor: 'black' | 'white' | 'clear'; label: string }[] = [
    {
      cover: '/albums/abbey-road.jpg',
      vinylColor: 'white',
      label: 'Édition Limitée'
    },
    {
      cover: '/albums/paranoid.jpg',
      vinylColor: 'black',
      label: 'Édition Standard'
    },
    {
      cover: '/albums/ramones.jpg',
      vinylColor: 'clear',
      label: 'Vinyle Instrumental'
    }
  ]

  return (
    <section className="bundle-section">
      {/* WebGL Particles Background */}
      <ParticlesCanvas />

      <div className="bundle-container">
        {/* Products row */}
        <div className="bundle-products">
          {products.map((product, index) => (
            <div key={index} className="product-wrapper">
              <VinylProduct
                cover={product.cover}
                vinylColor={product.vinylColor}
                label={product.label}
                isHovered={hoveredIndex === index}
                onHover={(hover) => setHoveredIndex(hover ? index : null)}
              />
              {index < products.length - 1 && <PlusIcon />}
            </div>
          ))}
        </div>

        {/* Bundle info */}
        <div className="bundle-info">
          <h2 className="bundle-title">VINYL EXPERIENCE</h2>
          <p className="bundle-subtitle">
            ÉDITION LIMITÉE ABBEY ROAD + PARANOID + RAMONES
          </p>
          <button className="bundle-cta">
            Aggiungi al carrello (36€)
          </button>
        </div>
      </div>
    </section>
  )
}

export default BundleSection
