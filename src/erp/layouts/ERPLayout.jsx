import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import './ERPLayout.css'

const ERPLayout = () => {
  const { timeLeft, showTimeoutWarning } = useAuth()
  const secondsLeft = Math.ceil(timeLeft / 1000)
  const isPersistent = localStorage.getItem('uplynk_stay_logged_in') === 'true'

  return (
    <div className="erp-layout">
      <Sidebar />
      <main className="erp-main">
        <header className="erp-header">
          <div className="erp-header-content">
            <div className="breadcrumb-nav">
              <span className="breadcrumb-root">ERP</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Management Hub</span>
            </div>
            
            <div className="header-status">
              <div className={`status-indicator ${showTimeoutWarning ? 'warning' : ''} ${isPersistent ? 'persistent' : ''}`}>
                <span className="status-dot"></span>
                <span className="status-text">
                  {isPersistent 
                    ? 'Session Secure' 
                    : 'Security Active'
                  }
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className="erp-content-scroll">
          <div className="erp-content">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}

export default ERPLayout
