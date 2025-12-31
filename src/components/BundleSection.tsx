import { useRef } from 'react'
import './BundleSection.css'

const vinyls = [
  { src: '/vinyl1.png', alt: 'Vinyl 1' },
  { src: '/vinyl2.png', alt: 'Vinyl 2' },
  { src: '/vinyl3.png', alt: 'Vinyl 3' },
  { src: '/vinyl4.png', alt: 'Vinyl 4' },
  { src: '/vinyl5.png', alt: 'Vinyl 5' },
]

const VinylCard = ({ src, alt }: { src: string; alt: string }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
  }

  return (
    <div
      className="vinyl-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img src={src} alt={alt} className="vinyl-image" />
    </div>
  )
}

const BundleSection = () => {
  return (
    <div className="vinyl-showcase">
      <div className="vinyl-track">
        <div className="vinyl-slider">
          {vinyls.map((vinyl, index) => (
            <VinylCard key={index} src={vinyl.src} alt={vinyl.alt} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BundleSection
