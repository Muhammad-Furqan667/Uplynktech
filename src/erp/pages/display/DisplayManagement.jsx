import React, { useState } from 'react'
import { FiUsers, FiBriefcase, FiGrid, FiLayers, FiBookOpen, FiMessageSquare } from 'react-icons/fi'
import ManageProjects from './ManageProjects'
import ManageCategories from './ManageCategories'
import ManageTeam from './ManageTeam'
import ManageServices from './ManageServices'
import ManageCourses from './ManageCourses'
import ManageReviews from './ManageReviews'
import './DisplayManagement.css'

const DisplayManagement = () => {
  const [activeTab, setActiveTab] = React.useState(localStorage.getItem('uplynk_mgmt_tab') || 'projects')

  React.useEffect(() => {
    localStorage.setItem('uplynk_mgmt_tab', activeTab)
  }, [activeTab])

  const tabs = [
    { id: 'projects', label: 'Projects', icon: FiBriefcase, component: ManageProjects },
    { id: 'categories', label: 'Categories', icon: FiGrid, component: ManageCategories },
    { id: 'team', label: 'Team', icon: FiUsers, component: ManageTeam },
    { id: 'services', label: 'Services', icon: FiLayers, component: ManageServices },
    { id: 'courses', label: 'Courses', icon: FiBookOpen, component: ManageCourses },
    { id: 'reviews', label: 'Reviews', icon: FiMessageSquare, component: ManageReviews },
  ]

  return (
    <div className="admin-panel display-mgmt">
      <div className="admin-header">
        <h1>Display <span className="gold-text">Architect</span></h1>
        <p>Manage public-facing engineering content and portfolio assets</p>
      </div>

      <div className="admin-tabs display-tabs">
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
        {tabs.map(tab => (
          <div 
            key={tab.id} 
            style={{ display: activeTab === tab.id ? 'block' : 'none' }}
          >
            <tab.component />
          </div>
        ))}
      </div>
    </div>
  )
}

export default DisplayManagement
