import './Header.css'

const Header = () => {
  return (
    <header className="header">
      <a href="/" className="logo">VINYL</a>

      <nav className="nav">
        <a href="#collection" className="nav-link">
          <span className="nav-text">RECORDS</span>
          <span className="nav-text-hover">RECORDS</span>
        </a>
        <a href="#about" className="nav-link">
          <span className="nav-text">LISTEN</span>
          <span className="nav-text-hover">LISTEN</span>
        </a>
        <a href="#contact" className="nav-link">
          <span className="nav-text">SPIN</span>
          <span className="nav-text-hover">SPIN</span>
        </a>
      </nav>
    </header>
  )
}

export default Header
