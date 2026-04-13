import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import '../styles/ProjectCategory.css'
import { supabase } from '../lib/supabase'
import { resolveIcon } from '../lib/icons'
import { resolveImageUrl } from '../lib/utils'
import { FiArrowLeft, FiArrowRight, FiZap } from 'react-icons/fi'

export default function ProjectCategory() {
  const { category } = useParams()
  const navigate = useNavigate()
  
  const [meta, setMeta] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useSEO({
    title: meta ? `${meta.title} — UPLYNK Tech` : 'Technical Engineering Portfolio | UPLYNK',
    description: meta ? meta.description : 'Explore specialized engineering solutions at UPLYNK Tech.',
    canonical: `https://uplynktech.com/projects/${category}`
  })

  useEffect(() => {
    async function fetchCategoryData() {
      try {
        const [metaRes, projectsRes] = await Promise.all([
          supabase
            .from('display_project_categories')
            .select('*')
            .eq('slug', category)
            .single(),
          supabase
            .from('display_projects')
            .select('*')
            .eq('category', category)
            .order('created_at', { ascending: false })
        ])

        if (metaRes.error) throw metaRes.error
        if (projectsRes.error) throw projectsRes.error

        setMeta(metaRes.data)
        setProjects(projectsRes.data)
      } catch (err) {
        console.error('Error fetching category data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryData()
  }, [category])

  if (loading) {
    return (
      <div className="pc-loading-screen">
        <div className="loader"></div>
        <p>Decoding Project Archives...</p>
      </div>
    )
  }

  if (!meta) {
    return (
      <div className="pc-not-found">
        <h2>Category Archives Not Found</h2>
        <button onClick={() => navigate('/projects')}>← Back to Engineering Hub</button>
      </div>
    )
  }

  const Icon = resolveIcon(meta.hero_icon || 'FiCpu')

  return (
    <div className="pc-page">
      {/* Hero */}
      <section className="pc-hero">
        <div className="pc-hero-inner">
          <button className="pc-back-btn" onClick={() => navigate('/projects')}>
            <FiArrowLeft /> All Projects
          </button>
          <div className="pc-hero-icon-wrap">
            <Icon className="pc-hero-icon" />
          </div>
          <p className="pc-hero-eyebrow">Technical Portfolio</p>
          <h1 className="pc-hero-title">{meta.title}</h1>
          <p className="pc-hero-tagline">"{meta.tagline}"</p>
          <p className="pc-hero-desc">{meta.description}</p>

          {/* Stats */}
          <div className="pc-stats-row">
            {(meta.stats || []).map((s, i) => (
              <div key={i} className="pc-stat">
                <span className="pc-stat-value">{s.value}</span>
                <span className="pc-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pc-hero-wave" />
      </section>

      {/* Projects Grid */}
      <section className="pc-projects-section">
        <div className="pc-container">
          <h2 className="pc-section-title">Case Studies & Technical Deliverables</h2>
          <div className="pc-grid">
            {projects.map((project) => (
              <div key={project.id} className="pc-card">
                <div className="pc-card-img-wrap">
                  {project.image ? (
                    <img src={resolveImageUrl(project.image)} alt={project.title} className="pc-card-img" />
                  ) : (
                    <div className="pc-card-no-img"><FiLayers /></div>
                  )}
                  <div className="pc-card-overlay">
                    <span className="pc-card-client">{project.client}</span>
                  </div>
                </div>
                <div className="pc-card-body">
                  <h3 className="pc-card-title">{project.title}</h3>
                  <p className="pc-card-desc">{project.description}</p>
                  <div className="pc-card-tech">
                    {(project.tech || []).map((t, i) => (
                      <span key={i} className="pc-tech-pill">{t}</span>
                    ))}
                  </div>
                  <div className="pc-card-result">
                    <FiZap className="pc-result-icon" />
                    <span><strong>Impact:</strong> {project.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pc-cta">
        <div className="pc-container">
          <div className="pc-cta-card">
            <h2>Have a {meta.title.replace(' Projects', '').replace(' Development', '').replace(' Design', '')} project in mind?</h2>
            <p>Let's build something extraordinary together. Book a free discovery call with our team.</p>
            <div className="pc-cta-btns">
              <button className="pc-cta-primary" onClick={() => navigate('/consultation')}>
                Book a Free Consultation <FiArrowRight />
              </button>
              <button className="pc-cta-secondary" onClick={() => navigate('/projects')}>
                View All Projects
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
