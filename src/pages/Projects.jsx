import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import '../styles/Projects.css'
import { FiCpu, FiGlobe, FiPenTool, FiArrowRight, FiFilter, FiActivity, FiLayers, FiShield, FiSend } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import { resolveImageUrl } from '../lib/utils'

const categoryFilters = [
  { id: 'all', label: 'All Projects', icon: FiFilter },
  { id: 'ai-ml', label: 'AI / ML', icon: FiCpu, color: '#7c3aed' },
  { id: 'web-dev', label: 'Web Development', icon: FiGlobe, color: '#0ea5e9' },
  { id: 'graphic-design', label: 'Graphic Design', icon: FiPenTool, color: '#ec4899' }
]

const projectPhases = [
  { id: 1, title: 'Discovery & Audit', description: 'Deep tech audit and architectural discovery.', icon: FiActivity },
  { id: 2, title: 'System Architecture', description: 'Engineering the technical blueprint.', icon: FiLayers },
  { id: 3, title: 'Development Cycle', description: 'High-performance sprint-based engineering.', icon: FiCpu },
  { id: 4, title: 'Security Hardening', description: 'Vulnerability scanning and perimeter audits.', icon: FiShield },
  { id: 5, title: 'Global Deployment', description: 'Production rollout and auto-scaling logic.', icon: FiSend }
]

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useSEO({
    title: 'Precision Engineering Projects - UPLYNK Tech',
    description: 'Explore the UPLYNK technical ecosystem. Discover our AI/ML, web development, and graphic design project portfolios.',
    canonical: 'https://uplynktech.com/projects'
  })

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('display_projects')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        setProjects(data)
      } catch (err) {
        console.error('Error fetching projects:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()

    // Realtime Subscription
    const channel = supabase
      .channel('projects-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'display_projects'
        },
        async (payload) => {
          console.log('Realtime Project Update:', payload)
          // Refetch to ensure grouping/filtering is correct
          const { data } = await supabase
            .from('display_projects')
            .select('*')
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
          setProjects(data)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category?.toLowerCase() === activeFilter.toLowerCase())

  return (
    <div className="projects-page">
      <section className="projects-hero">
        <div className="container">
          <div className="badge">Technical Portfolio</div>
          <h1 className="title">Precision <br /><span className="highlight">Engineering Hub.</span></h1>
          <p className="subtitle">From Discovery to Deployment, we engineer solutions that rewrite the rules of industry efficiency.</p>

          {/* Category Navigation Cards */}
          <div className="projects-category-nav">
            <div
              className="cat-nav-card"
              style={{ '--cat-color': '#7c3aed' }}
              onClick={() => navigate('/projects/ai-ml')}
            >
              <FiCpu className="cat-nav-icon" />
              <span>AI / ML Projects</span>
              <FiArrowRight className="cat-nav-arrow" />
            </div>
            <div
              className="cat-nav-card"
              style={{ '--cat-color': '#0ea5e9' }}
              onClick={() => navigate('/projects/web-dev')}
            >
              <FiGlobe className="cat-nav-icon" />
              <span>Web Development</span>
              <FiArrowRight className="cat-nav-arrow" />
            </div>
            <div
              className="cat-nav-card"
              style={{ '--cat-color': '#ec4899' }}
              onClick={() => navigate('/projects/graphic-design')}
            >
              <FiPenTool className="cat-nav-icon" />
              <span>Graphic Design</span>
              <FiArrowRight className="cat-nav-arrow" />
            </div>
          </div>
        </div>
      </section>

      {/* Project Lifecycle Phases */}
      <section className="phases-section">
        <div className="container">
          <h2 className="section-title">The Delivery Lifecycle</h2>
          <div className="phases-grid">
            {projectPhases.map((phase) => (
              <div key={phase.id} className="phase-card">
                <div className="phase-index">0{phase.id}</div>
                <div className="phase-icon-box">
                  <phase.icon className="phase-icon" />
                </div>
                <h3 className="phase-title">{phase.title}</h3>
                <p className="phase-text">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Showcase with Filters */}
      <section className="portfolio-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Industrial Successes</h2>
            <p className="section-desc">Selected works that define our engineering standard.</p>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            {categoryFilters.map(f => (
              <button
                key={f.id}
                className={`filter-tab ${activeFilter === f.id ? 'active' : ''}`}
                style={f.color ? { '--tab-color': f.color } : {}}
                onClick={() => setActiveFilter(f.id)}
              >
                <f.icon />
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="projects-loading">
              <div className="loader"></div>
              <p>Synchronizing Portfolio Assets...</p>
            </div>
          ) : (
            <div className="portfolio-grid">
              {filtered.map((project) => (
                <div key={project.id} className="project-flexible-card">
                  <div className="image-wrapper">
                    {project.image ? (
                      <img src={resolveImageUrl(project.image)} alt={project.title} />
                    ) : (
                      <div className="project-no-img"><FiLayers /></div>
                    )}
                    <div className="project-overlay">
                      <span className="client-tag">{project.client}</span>
                    </div>
                  </div>
                  <div className="project-body">
                    <h3 className="project-name">{project.title}</h3>
                    <div className="project-impact">
                      <span className="impact-label">Result:</span>
                      <span className="impact-value">{project.impact}</span>
                    </div>
                    <div className="project-tech-stack">
                      {(project.tech || []).slice(0, 3).map((t, i) => (
                        <span key={i} className="mini-tech-pill">{t}</span>
                      ))}
                      {project.tech?.length > 3 && <span className="mini-tech-pill">+{project.tech.length - 3}</span>}
                    </div>
                    <button
                      className="view-case"
                      onClick={() => navigate(`/projects/${project.category}`)}
                    >
                      View Category <FiArrowRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Scale Call to Action */}
      <section className="scale-cta">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Engineer <br />the Next Standard?</h2>
            <button className="btn-primary" onClick={() => window.location.href = '/consultation'}>
              Start Your Discovery Phase
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
