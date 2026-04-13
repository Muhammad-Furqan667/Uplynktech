import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

const BackButton = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Do not show on Home page or Admin Panel
  const isHome = location.pathname === '/'
  const isAdmin = location.pathname.includes('/erp/admin')
  const isDisplay = location.pathname.includes('/erp/display')
  const isSettings = location.pathname.includes('/erp/settings')

  if (isHome || isAdmin || isDisplay || isSettings) return null

  return (
    <button 
      className="golden-back-btn" 
      onClick={() => navigate(-1)}
      title="Go Back"
    >
      <FiArrowLeft />
      <span>Back</span>
    </button>
  )
}

export default BackButton
