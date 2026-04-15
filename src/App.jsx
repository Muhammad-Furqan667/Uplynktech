import { useEffect } from 'react'
import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackButton from './components/BackButton'
import ProtectedRoute from './erp/components/ProtectedRoute'
import { AuthProvider } from './erp/contexts/AuthContext'
import './App.css'

// Lazy loaded pages to optimize build chunk size
const Home = lazy(() => import('./pages/Home'))
const Team = lazy(() => import('./pages/Team'))
const Services = lazy(() => import('./pages/Services'))
const Career = lazy(() => import('./pages/Career'))
const CoursesPage = lazy(() => import('./pages/CoursesPage'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Contact = lazy(() => import('./pages/Contact'))
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'))
const Consultation = lazy(() => import('./pages/Consultation'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectCategory = lazy(() => import('./pages/ProjectCategory'))
const CoursePage = lazy(() => import('./pages/CoursePage'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))

// Auth
const Login = lazy(() => import('./erp/pages/Login'))

// ERP Pages
const ERPLayout = lazy(() => import('./erp/layouts/ERPLayout'))
const ERPDashboard = lazy(() => import('./erp/pages/Dashboard'))
const Subordinates = lazy(() => import('./erp/pages/Subordinates'))
const ERPTeam = lazy(() => import('./erp/pages/Team'))
const Mail = lazy(() => import('./erp/pages/Mail'))
const AdminPanel = lazy(() => import('./erp/pages/admin/AdminPanel'))
const DisplayManagement = lazy(() => import('./erp/pages/display/DisplayManagement'))

// Custom component to handle scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// Fallback loader for deep routes
const PageLoader = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b', color: '#d4af37' }}>
    Loading Secure Environment...
  </div>
)

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
          <Suspense fallback={<PageLoader />}>
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
              <Route path="/signin" element={<Login />} />
              
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
                  <ProtectedRoute allowedRoles={['Admin', 'Front-end']}>
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
          </Suspense>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
