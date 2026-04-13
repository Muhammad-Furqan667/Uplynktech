import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FiMenu, FiX, FiChevronDown, FiTerminal, FiCpu, FiLayout, FiBook, FiAward, FiStar, FiMonitor, FiLayers, FiZap, FiUser, FiGlobe, FiPenTool } from 'react-icons/fi'
import { useAuth } from '../erp/contexts/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [location])

  const dropdownData = {
    services: [
      { icon: FiTerminal, title: 'Core Engineering', desc: 'Scalable infrastructure & systems.', to: '/services/engineering' },
      { icon: FiCpu, title: 'Intelligent Automation', desc: 'Neural automation & predictive logic.', to: '/services/ai' },
      { icon: FiLayout, title: 'Market Dominance', desc: 'Strategic UI/UX & design systems.', to: '/services/growth' }
    ],
    projects: [
      { icon: FiCpu, title: 'AI / ML Projects', desc: 'Machine learning & computer vision.', to: '/projects/ai-ml' },
      { icon: FiGlobe, title: 'Web Development', desc: 'Full-stack apps & enterprise portals.', to: '/projects/web-dev' },
      { icon: FiPenTool, title: 'Graphic Design', desc: 'Brand identity & creative design.', to: '/projects/graphic-design' }
    ],
    academy: [
      { icon: FiCpu, title: 'AI / ML Course', desc: '12-week machine learning program.', to: '/courses/ai-ml' },
      { icon: FiGlobe, title: 'Web Dev Course', desc: '14-week full-stack engineering.', to: '/courses/web-dev' },
      { icon: FiPenTool, title: 'Graphic Design Course', desc: '10-week design & marketing.', to: '/courses/graphic-design' }
    ]
  }

  const isErpPage = location.pathname.startsWith('/erp')

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        
        <Link to="/" className="navbar-brand">
          <img src="/img/logo.png" alt="UPLYNK Tech Logo" className="brand-logo-img" />
          <span className="brand-text">UPLYNK <span className="brand-accent">TECH</span></span>
        </Link>
        
        {/* Desktop Menu - Conditionally Hidden in ERP */}
        <ul className="nav-menu">
          {!isErpPage ? (
            <>
              {/* Services with Megamenu */}
              <li 
                className="nav-item-dropdown"
                onMouseEnter={() => setActiveDropdown('services')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>
                  Services <FiChevronDown className={`chevron ${activeDropdown === 'services' ? 'rotate' : ''}`} />
                </Link>
                <div className={`megamenu ${activeDropdown === 'services' ? 'show' : ''}`}>
                  <div className="megamenu-grid">
                    {dropdownData.services.map((item, id) => (
                      <Link key={id} to={item.to} className="megamenu-card">
                        <item.icon className="card-icon" />
                        <div>
                          <h4>{item.title}</h4>
                          <p>{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              {/* Projects with Megamenu */}
              <li 
                className="nav-item-dropdown"
                onMouseEnter={() => setActiveDropdown('projects')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link to="/projects" className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}>
                  Projects <FiChevronDown className={`chevron ${activeDropdown === 'projects' ? 'rotate' : ''}`} />
                </Link>
                <div className={`megamenu ${activeDropdown === 'projects' ? 'show' : ''}`}>
                  <div className="megamenu-grid">
                    {dropdownData.projects.map((item, id) => (
                      <Link key={id} to={item.to} className="megamenu-card">
                        <item.icon className="card-icon" />
                        <div>
                          <h4>{item.title}</h4>
                          <p>{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              {/* Academy with Megamenu */}
              <li 
                className="nav-item-dropdown"
                onMouseEnter={() => setActiveDropdown('academy')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link to="/courses" className={`nav-link ${location.pathname === '/courses' ? 'active' : ''}`}>
                  Academy <FiChevronDown className={`chevron ${activeDropdown === 'academy' ? 'rotate' : ''}`} />
                </Link>
                <div className={`megamenu ${activeDropdown === 'academy' ? 'show' : ''}`}>
                  <div className="megamenu-grid">
                    {dropdownData.academy.map((item, id) => (
                      <Link key={id} to={item.to} className="megamenu-card">
                        <item.icon className="card-icon" />
                        <div>
                          <h4>{item.title}</h4>
                          <p>{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              <li><Link to="/team" className={`nav-link ${location.pathname === '/team' ? 'active' : ''}`}>Team</Link></li>
              
              {/* Auth Buttons Only shown on Marketing Page */}
              <li>
                <Link to="/auth/login" className="nav-btn signin-btn">
                  Sign In
                </Link>
              </li>
              
              <li><Link to="/consultation" className="nav-btn">Free Consultation</Link></li>
            </>
          ) : (
            /* Inside ERP: Only show Dashboard Indicator (Optional) or leave empty as per request */
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

      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/services/engineering" className="mobile-sub-link">— Core Engineering</Link></li>
          <li><Link to="/services/ai" className="mobile-sub-link">— Intelligent Automation</Link></li>
          <li><Link to="/services/growth" className="mobile-sub-link">— Market Dominance</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/projects/ai-ml" className="mobile-sub-link">— AI / ML Projects</Link></li>
          <li><Link to="/projects/web-dev" className="mobile-sub-link">— Web Development</Link></li>
          <li><Link to="/projects/graphic-design" className="mobile-sub-link">— Graphic Design</Link></li>
          <li><Link to="/courses">Academy</Link></li>
          <li><Link to="/courses/ai-ml" className="mobile-sub-link">— AI / ML Course</Link></li>
          <li><Link to="/courses/web-dev" className="mobile-sub-link">— Web Dev Course</Link></li>
          <li><Link to="/courses/graphic-design" className="mobile-sub-link">— Design Course</Link></li>
          <li><Link to="/team">Team</Link></li>
          <li><Link to="/auth/login" className="mobile-signin-link">Sign In</Link></li>
          <li><Link to="/consultation" className="mobile-consult-link">Consultation</Link></li>
        </ul>
      </div>
    </nav>
  )
}
