import { useState } from 'react'
import { FiUsers, FiLayers, FiSettings, FiShuffle } from 'react-icons/fi'
import AdminUsers from './AdminUsers'
import AdminHierarchy from './AdminHierarchy'
import AdminSettings from './AdminSettings'
import './AdminShared.css'
import './AdminPanel.css'

const AdminPanel = ({ defaultTab = 'users' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const tabs = [
    { id: 'users', label: 'User Management', icon: FiUsers, component: AdminUsers },
    { id: 'hierarchy', label: 'Hierarchy Mapper', icon: FiShuffle, component: AdminHierarchy },
    { id: 'settings', label: 'SMTP & Config', icon: FiSettings, component: AdminSettings },
  ]

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || AdminUsers

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Control <span className="gold-text">Center</span></h1>
        <p>Enterprise administration & system orchestration</p>
      </div>

      <div className="admin-tabs">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="admin-content-card">
        <ActiveComponent />
      </div>
    </div>
  )
}

export default AdminPanel
