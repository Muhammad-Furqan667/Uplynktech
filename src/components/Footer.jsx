import { useState } from 'react'
import './Footer.css'
import { Link, useLocation } from 'react-router-dom'
import {
  FaInstagram,
  FaTiktok,
  FaLinkedin,
  FaWhatsapp,
  FaFacebook
} from 'react-icons/fa'
import { FiArrowRight } from 'react-icons/fi'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const location = useLocation()

  // Hide footer on ERP pages
  if (location.pathname.startsWith('/erp')) {
    return null
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="professional-footer">
      <div className="footer-top-grid">
        
        {/* Brand Column */}
        <div className="footer-brand-col">
          <div className="footer-logo">UPLYNK TECH</div>
          <p className="footer-brand-desc">
            Equipping modern enterprises with resilient software systems and transformative digital growth.
          </p>
          <div className="footer-socials">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram">
              <FaInstagram />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" title="TikTok">
              <FaTiktok />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook">
              <FaFacebook />
            </a>
            <a href="https://wa.me/" target="_blank" rel="noreferrer" title="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Real Links: Services */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Capabilities</h4>
          <ul>
            <li><Link to="/services">Software Engineering</Link></li>
            <li><Link to="/services">AI & Automation</Link></li>
            <li><Link to="/services">Cloud Infrastructure</Link></li>
            <li><Link to="/services">Enterprise UI/UX</Link></li>
          </ul>
        </div>

        {/* Real Links: Company */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/courses">The Academy</Link></li>
            <li><Link to="/team">Engineering Team</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter-col">
          <h4 className="footer-col-title">Industry Insights</h4>
          <p className="footer-newsletter-desc">
            Subscribe to our engineering newsletter for deep dives on scale and AI.
          </p>
          <form className="footer-subscribe-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Business Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">
              <FiArrowRight />
            </button>
          </form>
          {subscribed && <span className="subscribe-success">Request confirmed.</span>}
        </div>

      </div>

      <div className="footer-bottom-bar">
        <p className="footer-copyright">
          © {currentYear} UPLYNK Technologies. All rights reserved. Precision Engineering.
        </p>
        <div className="footer-legal-links">
          <Link to="#">Privacy Policy</Link>
          <span className="footer-legal-dot">•</span>
          <Link to="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
