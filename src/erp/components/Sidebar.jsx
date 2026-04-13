import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiHome, FiUsers, FiBriefcase, FiMail, FiShield, FiSettings, FiLogOut, FiChevronRight, FiAirplay } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import './Sidebar.css'

const Sidebar = () => {
  const { profile, isSenior, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isContactHandler = 
    profile?.role === 'Admin' || 
    profile?.email === 'contactus@uplynktech.com' || 
    profile?.designation === 'Contact Officer'

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/erp/dashboard', show: true },
    { icon: FiBriefcase, label: 'Subordinates', path: '/erp/subordinates', show: isSenior },
    { icon: FiUsers, label: 'Team', path: '/erp/team', show: true },
    { icon: FiMail, label: 'Mail Hub', path: '/erp/mail', show: true }, // Unlocked for all
    { icon: FiAirplay, label: 'Display', path: '/erp/display', show: profile?.role === 'Admin' },
    { icon: FiShield, label: 'Admin', path: '/erp/admin', show: profile?.role === 'Admin' },
    { icon: FiSettings, label: 'Settings', path: '/erp/settings', show: profile?.role === 'Admin' },
  ]

  return (
    <aside className="erp-sidebar">

      <div className="sidebar-user">
        <div className="user-avatar">
          {profile?.full_name?.charAt(0) || 'U'}
        </div>
        <div className="user-info">
          <span className="user-name">{profile?.full_name || 'User'}</span>
          <span className="user-designation">{profile?.designation || 'Member'}</span>
          <span className="user-emp-id">{profile?.emp_id}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.filter(item => item.show).map((item, idx) => (
            <li key={idx} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <item.icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {location.pathname === item.path && <FiChevronRight className="nav-active-indicator" />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleSignOut}>
          <FiLogOut className="nav-icon" />
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
