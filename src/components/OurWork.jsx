import { useState, useEffect } from 'react'
import './OurWork.css'
import { FaTimes, FaArrowRight } from 'react-icons/fa'
import { FiLayers } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import { resolveImageUrl } from '../lib/utils'

export default function OurWork() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

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
  }, [])

  const categories = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))]

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  return (
    <section className="our-work">
      <div className="our-work-container">
        
        <div className="our-work-header">
          <p className="work-eyebrow">Case Studies</p>
          <h2 className="our-work-heading">Featured Projects</h2>
          <p className="our-work-subtitle">
            A selection of mission-critical systems and intuitive experiences we have engineered for our partners.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Loading projects...</div>
        ) : (
          <>
            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-text-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All Projects' : category}
                </button>
              ))}
            </div>

            <div className="projects-editorial-grid">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="project-editorial-card"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="project-image-box" style={{ overflow: 'hidden' }}>
                    {project.image ? (
                        <img src={resolveImageUrl(project.image)} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}><FiLayers size={40} /></div>
                    )}
                    <div className="project-hover-curtain">
                      <span className="curtain-text">View Case Study</span>
                    </div>
                  </div>
                  <div className="project-editorial-info">
                    <span className="project-meta-tag">{project.category}</span>
                    <h3 className="project-editorial-title">{project.title}</h3>
                    <p className="project-editorial-desc">{project.description || project.impact || ''}</p>
                    <div className="project-editorial-link">
                      <span>Explore</span>
                      <FaArrowRight className="link-arrow"/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedProject && (
          <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
            <div className="modal-case-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close"
                onClick={() => setSelectedProject(null)}
              >
                <FaTimes />
              </button>
              
              <div className="modal-case-header">
                <span className="modal-case-category">{selectedProject.category}</span>
                <h2 className="modal-case-title">{selectedProject.title}</h2>
              </div>
              
              <div className="modal-case-image" style={{ overflow: 'hidden', padding: 0 }}>
                {selectedProject.image ? (
                    <img src={resolveImageUrl(selectedProject.image)} alt={selectedProject.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}><FiLayers size={60} /></div>
                )}
              </div>
              
              <div className="modal-case-body">
                <p className="modal-case-description">{selectedProject.description || selectedProject.content || 'Details coming soon.'}</p>
                
                <div style={{ marginTop: '1rem', marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {(selectedProject.tech || []).map((t, i) => (
                    <span key={i} style={{ padding: '0.25rem 0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  {selectedProject.link && (
                    <button className="case-live-btn" onClick={() => window.open(selectedProject.link, '_blank')}>
                      View Live Platform
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
