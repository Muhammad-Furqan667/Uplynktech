import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import './ERPLayout.css'

const ERPLayout = () => {
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
              <div className="status-indicator">
                <span className="status-dot"></span>
                <span className="status-text">System Active</span>
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
