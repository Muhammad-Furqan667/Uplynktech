import React from 'react'
import { FiClock, FiShield } from 'react-icons/fi'
import './SecurityOverlay.css'

const SecurityOverlay = ({ timeLeft, onExtend }) => {
  // Convert milliseconds to seconds for display
  const secondsLeft = Math.ceil(timeLeft / 1000)

  return (
    <div className="security-glass-overlay">
      <div className="security-glass-card">
        <div className="security-glass-pulse-icon">
          <FiClock />
        </div>
        
        <h2>Security Protocol</h2>
        <p>Inactivity timeout detected. For your protection, session will expire soon.</p>

        <div className="security-glass-timer">
          {secondsLeft}s
        </div>

        <div className="security-glass-actions">
          <button className="security-glass-btn-primary" onClick={onExtend}>
            <FiShield /> Reset Security Timer
          </button>
        </div>
      </div>
    </div>
  )
}

export default SecurityOverlay
