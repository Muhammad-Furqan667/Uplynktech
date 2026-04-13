import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Team from './pages/Team'
import Services from './pages/Services'
import Career from './pages/Career'
import CoursesPage from './pages/CoursesPage'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import AboutUsPage from './pages/AboutUsPage'
import Consultation from './pages/Consultation'
import Projects from './pages/Projects'
import ProjectCategory from './pages/ProjectCategory'
import CoursePage from './pages/CoursePage'
import ServiceDetail from './pages/ServiceDetail'
import { AuthProvider } from './erp/contexts/AuthContext'
import Login from './erp/pages/Login'
import ProtectedRoute from './erp/components/ProtectedRoute'
import ERPLayout from './erp/layouts/ERPLayout'
import ERPDashboard from './erp/pages/Dashboard'
import Subordinates from './erp/pages/Subordinates'
import ERPTeam from './erp/pages/Team'
import Mail from './erp/pages/Mail'
import AdminPanel from './erp/pages/admin/AdminPanel'
import DisplayManagement from './erp/pages/display/DisplayManagement'
import BackButton from './components/BackButton'
import './App.css'

// Custom component to handle scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  useEffect(() => {
    // Add organization structured data
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'UPLYNK Tech',
      url: 'https://uplynktech.com',
      logo: 'https://uplynktech.com/logo.png',
      description: 'UPLYNK Tech empowers students with valuable skills and delivers reliable digital solutions',
      sameAs: [
        'https://www.facebook.com/uplynktech',
        'https://www.twitter.com/uplynktech',
        'https://www.linkedin.com/company/uplynktech'
      ]
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(organizationSchema)
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <div className="app">
          <Navbar />
          <BackButton />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/services" element={<Services />} />
            <Route path="/career" element={<Career />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:category" element={<ProjectCategory />} />
            <Route path="/courses/:slug" element={<CoursePage />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            
            {/* ERP Routes (Protected) */}
            <Route path="/erp" element={<ProtectedRoute><ERPLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<ERPDashboard />} />
              <Route path="subordinates" element={<Subordinates />} />
              <Route path="team" element={<ERPTeam />} />
              <Route path="mail" element={<Mail />} />
              <Route path="admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPanel defaultTab="users" />
                </ProtectedRoute>
              } />
              <Route path="display" element={
                <ProtectedRoute requireAdmin={true}>
                  <DisplayManagement />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPanel defaultTab="settings" />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
