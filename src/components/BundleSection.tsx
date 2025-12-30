import { useState } from 'react'
import './BundleSection.css'

interface Album {
  title: string
  artist: string
  year: string
  description: string
  backgroundColor: string
  textColor: string
  cover: string
  tracklist: string[]
}

interface AlbumCardProps {
  album: Album
  onClick: () => void
}

interface DetailModalProps {
  album: Album
  onClose: () => void
}

// Detail Modal
const DetailModal = ({ album, onClose }: DetailModalProps) => {
  return (
    <div className="detail-overlay" onClick={onClose}>
      <div
        className="detail-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          '--bg': album.backgroundColor,
          '--text': album.textColor
        } as React.CSSProperties}
      >
        <button className="detail-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="detail-content">
          {/* Album Cover */}
          <div className="detail-cover">
            <img src={album.cover} alt={album.title} />
          </div>

          {/* Album Info */}
          <div className="detail-info">
            <span className="detail-year">{album.year}</span>
            <h2 className="detail-title">{album.title}</h2>
            <h3 className="detail-artist">{album.artist}</h3>
            <p className="detail-description">{album.description}</p>

            <div className="detail-tracklist">
              <h4>Tracklist</h4>
              <ol>
                {album.tracklist.map((track, i) => (
                  <li key={i}>{track}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Album Card - Stripe Press style
const AlbumCard = ({ album, onClick }: AlbumCardProps) => {
  return (
    <button
      className="album-card"
      onClick={onClick}
      style={{
        '--bg': album.backgroundColor,
        '--text': album.textColor
      } as React.CSSProperties}
    >
      <div className="album-card-text">
        <h2 className="album-card-title">{album.title}</h2>
        <h3 className="album-card-artist">{album.artist}</h3>
      </div>
    </button>
  )
}

const BundleSection = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)

  const albums: Album[] = [
    {
      title: 'Abbey Road',
      artist: 'The Beatles',
      year: '1969',
      description: 'The eleventh studio album by the English rock band the Beatles, released on 26 September 1969. Named after the street where EMI Studios is located, it was the last album recorded by the group.',
      backgroundColor: '#87CEEB',
      textColor: '#1a1a1a',
      cover: '/albums/abbey-road.jpg',
      tracklist: ['Come Together', 'Something', 'Maxwell\'s Silver Hammer', 'Oh! Darling', 'Octopus\'s Garden', 'I Want You', 'Here Comes the Sun', 'Because', 'Golden Slumbers']
    },
    {
      title: 'Paranoid',
      artist: 'Black Sabbath',
      year: '1970',
      description: 'The second studio album by the English rock band Black Sabbath. It was released on 18 September 1970 and is often cited as one of the most influential heavy metal albums of all time.',
      backgroundColor: '#FF6B35',
      textColor: '#1a1a1a',
      cover: '/albums/paranoid.jpg',
      tracklist: ['War Pigs', 'Paranoid', 'Planet Caravan', 'Iron Man', 'Electric Funeral', 'Hand of Doom', 'Rat Salad', 'Fairies Wear Boots']
    },
    {
      title: 'Ramones',
      artist: 'Ramones',
      year: '1976',
      description: 'The debut studio album by the American punk rock band Ramones. Released on April 23, 1976, it is widely considered one of the most influential albums in punk rock history.',
      backgroundColor: '#1a1a1a',
      textColor: '#ffffff',
      cover: '/albums/ramones.jpg',
      tracklist: ['Blitzkrieg Bop', 'Beat on the Brat', 'Judy Is a Punk', 'I Wanna Be Your Boyfriend', 'Chain Saw', 'Now I Wanna Sniff Some Glue', '53rd & 3rd', 'Let\'s Dance']
    },
    {
      title: '(What\'s the Story) Morning Glory?',
      artist: 'Oasis',
      year: '1995',
      description: 'The second studio album by English rock band Oasis. It was released on 2 October 1995 and became one of the best-selling albums in UK chart history.',
      backgroundColor: '#E8E4D9',
      textColor: '#2d2d2d',
      cover: '/albums/morning-glory.jpg',
      tracklist: ['Hello', 'Roll with It', 'Wonderwall', 'Don\'t Look Back in Anger', 'Hey Now!', 'Some Might Say', 'Cast No Shadow', 'She\'s Electric', 'Morning Glory', 'Champagne Supernova']
    },
    {
      title: 'Americana',
      artist: 'The Offspring',
      year: '1998',
      description: 'The fifth studio album by American rock band the Offspring. Released on November 17, 1998, it became one of their best-selling albums worldwide.',
      backgroundColor: '#C41E3A',
      textColor: '#ffffff',
      cover: '/albums/offspring.jpg',
      tracklist: ['Welcome', 'Have You Ever', 'Staring at the Sun', 'Pretty Fly (for a White Guy)', 'The Kids Aren\'t Alright', 'Feelings', 'She\'s Got Issues', 'Walla Walla', 'Why Don\'t You Get a Job?', 'Americana', 'Pay the Man']
    },
    {
      title: 'Vol. 4',
      artist: 'Black Sabbath',
      year: '1972',
      description: 'The fourth studio album by English rock band Black Sabbath. Released on 25 September 1972, it marked a shift in the band\'s sound with more experimental and introspective themes.',
      backgroundColor: '#4A3728',
      textColor: '#E8C547',
      cover: '/albums/black-sabbath-due.jpg',
      tracklist: ['Wheels of Confusion', 'Tomorrow\'s Dream', 'Changes', 'FX', 'Supernaut', 'Snowblind', 'Cornucopia', 'Laguna Sunrise', 'St. Vitus Dance', 'Under the Sun']
    },
  ]

  return (
    <section className="press-section">
      <div className="press-container">
        {/* Header */}
        <header className="press-header">
          <h1 className="press-name">Vinile</h1>
          <h2 className="press-tagline">Music for progress</h2>
        </header>

        {/* Album List */}
        <div className="press-list">
          {albums.map((album, index) => (
            <AlbumCard
              key={index}
              album={album}
              onClick={() => setSelectedAlbum(album)}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAlbum && (
        <DetailModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
      )}
    </section>
  )
}

export default BundleSection
