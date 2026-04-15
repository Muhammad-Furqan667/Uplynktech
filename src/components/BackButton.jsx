import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

const BackButton = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = React.useRef(0)

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling down past 50px
        setIsVisible(false)
      } else {
        // Scrolling up
        setIsVisible(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Do not show on Home page or any ERP page
  const isHome = location.pathname === '/'
  const isErpPage = location.pathname.startsWith('/erp')

  if (isHome || isErpPage) return null

  return (
    <button 
      className={`golden-back-btn ${!isVisible ? 'hidden' : ''}`}
      onClick={() => navigate(-1)}
      title="Go Back"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <FiArrowLeft />
      <span>Back</span>
    </button>
  )
}

export default BackButton
