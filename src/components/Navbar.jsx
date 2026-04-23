import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FiMenu, FiX, FiChevronDown, FiTerminal, FiCpu, FiLayout, FiBook, FiAward, FiStar, FiMonitor, FiLayers, FiZap, FiUser, FiGlobe, FiPenTool, FiMoon, FiSun } from 'react-icons/fi'
import { useAuth } from '../erp/contexts/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Apply dark mode class to body globally, but NOT on ERP or Auth pages
  useEffect(() => {
    const isErpOrAuth = location.pathname.startsWith('/erp') || location.pathname.startsWith('/auth')
    
    if (isErpOrAuth) {
      document.body.classList.remove('dark-mode')
      return;
    }

    if (isDarkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [isDarkMode, location.pathname])

  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [location])

  const servicesLinks = [
    { label: 'Web Development',       to: '/services#web' },
    { label: 'App Development',       to: '/services#app' },
    { label: 'Graphic Designing',     to: '/services#design' },
    { label: 'Social Media Marketing',to: '/services#smm' },
    { label: 'AI Solutions',          to: '/services#ai' },
  ]

  const aboutLinks = [
    { label: 'Our Story',      to: '/about#our-story' },
    { label: 'Our Values',     to: '/about#our-values' },
    { label: 'Meet the Team',  to: '/about#meet-the-team' },
    { label: 'Why Choose Us',  to: '/about#why-choose-us' },
  ]

  const isErpPage = location.pathname.startsWith('/erp')

  // Completely hide Navbar on ERP pages
  if (isErpPage) {
    return null
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        
        <Link to="/" className="navbar-brand">
          <img src="/img/logo.png" alt="UPLYNK Tech Logo" className="brand-logo-img" />
          <span className="brand-text">UPLYNK <span className="brand-accent">TECH</span></span>
        </Link>
        
        <div className="navbar-right">
          <ul className="nav-menu">
            {!isErpPage ? (
              <>
                {/* Services Dropdown */}
                <li 
                  className="nav-item-dropdown"
                  onMouseEnter={() => setActiveDropdown('services')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>
                    Services <FiChevronDown className={`chevron ${activeDropdown === 'services' ? 'rotate' : ''}`} />
                  </Link>
                  <div className={`simple-dropdown ${activeDropdown === 'services' ? 'show' : ''}`}>
                    {servicesLinks.map((item, i) => (
                      <Link key={i} to={item.to} className="simple-dropdown-item">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </li>

                {/* About Us Dropdown */}
                <li
                  className="nav-item-dropdown"
                  onMouseEnter={() => setActiveDropdown('about')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
                    About Us <FiChevronDown className={`chevron ${activeDropdown === 'about' ? 'rotate' : ''}`} />
                  </Link>
                  <div className={`simple-dropdown ${activeDropdown === 'about' ? 'show' : ''}`}>
                    {aboutLinks.map((item, i) => (
                      <Link key={i} to={item.to} className="simple-dropdown-item">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </li>
                
                <li><Link to="/consultation" className="nav-btn">Free Consultation</Link></li>
              </>
            ) : (
              <li className="erp-indicator">
                <span className="indicator-dot"></span>
                Secure Workspace
              </li>
            )}
          </ul>

          {/* Hamburger Toggle */}
          <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>

          <button className="theme-toggle-btn" onClick={() => setIsDarkMode(!isDarkMode)} title="Toggle Night Mode">
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/consultation" className="mobile-consult-link">Consultation</Link></li>
        </ul>
      </div>
    </nav>
  )
}
