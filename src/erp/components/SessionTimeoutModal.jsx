import React from 'react'
import { FiClock, FiShield, FiLogOut } from 'react-icons/fi'
import './SessionTimeoutModal.css'

const SessionTimeoutModal = ({ timeLeft, onExtend, onLogout }) => {
  // Convert milliseconds to MM:SS
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="session-timeout-overlay">
      <div className="session-timeout-card">
        <div className="session-timeout-header">
          <div className="warning-icon-wrapper">
            <FiClock className="warning-icon-pulse" />
          </div>
          <h2>Session Expiring</h2>
          <p>For your security, you will be logged out due to inactivity.</p>
        </div>

        <div className="session-timeout-timer">
          <div className="timer-display">
            <span className="timer-value">{formatTime(timeLeft)}</span>
            <span className="timer-label">Remaining</span>
          </div>
          <div className="timer-progress">
            <div 
              className="timer-progress-bar" 
              style={{ width: `${(timeLeft / 5000) * 100}%` }}
            />
          </div>
        </div>

        <div className="session-timeout-actions">
          <button className="extend-btn" onClick={onExtend}>
            <FiShield /> Stay Logged In
          </button>
          <button className="logout-btn-text" onClick={onLogout}>
            <FiLogOut /> Logout Now
          </button>
        </div>

        <div className="session-timeout-footer">
          <p>Maximum session life is 5 days (120 hours). This timer resets upon activity.</p>
        </div>
      </div>
    </div>
  )
}

export default SessionTimeoutModal
