import { useState } from 'react'
import './BundleSection.css'

interface Album {
  title: string
  artist: string
  description: string
  backgroundColor: string
  color: string
  cover: string
}

const BundleSection = () => {
  const [hoveredAlbum, setHoveredAlbum] = useState<Album | null>(null)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)

  const albums: Album[] = [
    {
      title: 'Abbey Road',
      artist: 'The Beatles',
      description: 'The eleventh studio album by the English rock band the Beatles, released on 26 September 1969. Named after the street where EMI Studios is located, it was the last album recorded by the group.',
      backgroundColor: '#87CEEB',
      color: '#1a1a1a',
      cover: '/albums/abbey-road.jpg'
    },
    {
      title: 'Paranoid',
      artist: 'Black Sabbath',
      description: 'The second studio album by the English rock band Black Sabbath. Released on 18 September 1970, it is often cited as one of the most influential heavy metal albums of all time.',
      backgroundColor: '#FF6B35',
      color: '#1a1a1a',
      cover: '/albums/paranoid.jpg'
    },
    {
      title: 'Ramones',
      artist: 'Ramones',
      description: 'The debut studio album by the American punk rock band Ramones. Released on April 23, 1976, it is widely considered one of the most influential albums in punk rock history.',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      cover: '/albums/ramones.jpg'
    },
    {
      title: "(What's the Story) Morning Glory?",
      artist: 'Oasis',
      description: 'The second studio album by English rock band Oasis. Released on 2 October 1995, it became one of the best-selling albums in UK chart history.',
      backgroundColor: '#E8E4D9',
      color: '#2d2d2d',
      cover: '/albums/morning-glory.jpg'
    },
    {
      title: 'Americana',
      artist: 'The Offspring',
      description: 'The fifth studio album by American rock band the Offspring. Released on November 17, 1998, it became one of their best-selling albums worldwide.',
      backgroundColor: '#C41E3A',
      color: '#ffffff',
      cover: '/albums/offspring.jpg'
    },
    {
      title: 'Vol. 4',
      artist: 'Black Sabbath',
      description: 'The fourth studio album by English rock band Black Sabbath. Released on 25 September 1972, it marked a shift in the band\'s sound with more experimental themes.',
      backgroundColor: '#4A3728',
      color: '#E8C547',
      cover: '/albums/black-sabbath-due.jpg'
    },
  ]

  return (
    <div className="PressHomepageProductList__container">
      <header className="PressHomepageProductListHeader">
        <h1 className="PressHomepageProductListHeader__name">Vinile</h1>
        <h2 className="PressHomepageSectionTitle">Music for progress</h2>
      </header>

      <div className="PressHomepageProductList">
        {albums.map((album, index) => (
          <button
            key={index}
            className="PressHomepageBook"
            style={{
              '--backgroundColor': album.backgroundColor,
              '--color': album.color
            } as React.CSSProperties}
            onMouseEnter={() => setHoveredAlbum(album)}
            onMouseLeave={() => setHoveredAlbum(null)}
            onClick={() => setSelectedAlbum(album)}
          >
            <div className="PressHomepageBook__text">
              <h2 className="PressHomepageBook__title">{album.title}</h2>
              <h3 className="PressHomepageBook__author">{album.artist}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* Description tooltip */}
      {hoveredAlbum && (
        <div className="PressHomepageBook__description">
          {hoveredAlbum.description}
        </div>
      )}

      {/* Detail Modal */}
      {selectedAlbum && (
        <div className="detail-overlay" onClick={() => setSelectedAlbum(null)}>
          <div
            className="detail-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              '--backgroundColor': selectedAlbum.backgroundColor,
              '--color': selectedAlbum.color
            } as React.CSSProperties}
          >
            <button className="detail-close" onClick={() => setSelectedAlbum(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="detail-content">
              <div className="detail-cover">
                <img src={selectedAlbum.cover} alt={selectedAlbum.title} />
              </div>
              <div className="detail-info">
                <h2 className="detail-title">{selectedAlbum.title}</h2>
                <h3 className="detail-artist">{selectedAlbum.artist}</h3>
                <p className="detail-description">{selectedAlbum.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BundleSection
