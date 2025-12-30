import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './BundleSection.css'

gsap.registerPlugin(ScrollTrigger)

const vinyls = [
  { src: '/vinyl1.png', alt: 'Vinyl 1' },
  { src: '/vinyl2.png', alt: 'Vinyl 2' },
  { src: '/vinyl3.png', alt: 'Vinyl 3' },
  { src: '/vinyl4.png', alt: 'Vinyl 4' },
  { src: '/vinyl5.png', alt: 'Vinyl 5' },
]

const BundleSection = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const needleRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.vinyl-card')

      // Each vinyl card animates on scroll into view
      cards.forEach((card, i) => {
        const img = card.querySelector('.vinyl-image') as HTMLElement

        // Entry effect - Vinyl Spin Drop with 3D perspective
        gsap.fromTo(img,
          {
            scale: 0.2,
            opacity: 0,
            rotation: -360 - (i * 90),
            x: -200,
            rotateY: -60,
            filter: 'blur(12px)'
          },
          {
            scale: 1,
            opacity: 1,
            rotation: (i % 2 === 0 ? 3 : -3),
            x: 0,
            rotateY: 0,
            filter: 'blur(0px)',
            ease: 'elastic.out(1, 0.6)',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 40%',
              scrub: 1.2,
            }
          }
        )

        // Exit effect - Vinyl Spin Out
        gsap.to(img, {
          scale: 0.5,
          opacity: 0,
          rotation: 180 + (i * 60),
          x: 150,
          rotateY: 45,
          filter: 'blur(8px)',
          ease: 'power3.in',
          scrollTrigger: {
            trigger: card,
            start: 'bottom 30%',
            end: 'bottom -20%',
            scrub: 1.2,
          }
        })
      })

      // Needle subtle rotation based on scroll progress
      if (needleRef.current) {
        gsap.to(needleRef.current, {
          rotation: 110,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 2,
          }
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="vinyl-showcase" ref={containerRef}>
      <img
        ref={needleRef}
        src="/needle.png"
        alt="Turntable needle"
        className="needle"
      />
      <div className="vinyl-track">
        <div className="vinyl-slider">
          {vinyls.map((vinyl, index) => (
            <div key={index} className="vinyl-card">
              <img src={vinyl.src} alt={vinyl.alt} className="vinyl-image" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BundleSection
