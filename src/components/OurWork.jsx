import { useState } from 'react'
import './OurWork.css'
import { FaTimes, FaArrowRight } from 'react-icons/fa'

export default function OurWork() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const projects = [
    {
      id: 1,
      title: 'B2B Procurement Platform',
      description: 'End-to-end scalable procurement system for enterprise operations.',
      category: 'Software Engineering',
      image: 'linear-gradient(135deg, #111111 0%, #2A2A2A 100%)',
      details: 'Engineered a highly available system using React, Node, and PostgreSQL, replacing archaic legacy systems and speeding up procurement cycles by 40%.'
    },
    {
      id: 2,
      title: 'AI Customer Operations Engine',
      description: 'Internal LLM tooling capable of automating Tier 1 support routines.',
      category: 'AI & Data',
      image: 'linear-gradient(135deg, #E2DFD6 0%, #CAC6BD 100%)',
      details: 'Leveraged RAG architectures and OpenAI integrations to securely parse corporate wikis, reducing support resolution times by 55%.'
    },
    {
      id: 3,
      title: 'Retail Mobile App',
      description: 'Cross-platform mobile experience with dynamic inventory tracking.',
      category: 'Software Engineering',
      image: 'linear-gradient(135deg, #2D2D2D 0%, #404040 100%)',
      details: 'Deployed via React Native. Includes native biometric login, flawless offline sync protocols, and real-time push analytics.'
    },
    {
      id: 4,
      title: 'Omnichannel Brand Overhaul',
      description: 'Complete UI/UX restructuring and digital brand language alignment.',
      category: 'Creative & Digital',
      image: 'linear-gradient(135deg, #DFDDDA 0%, #B8B5AE 100%)',
      details: 'Pushed a comprehensive design system utilizing Figma best practices, converting to a 32% increase in user retention across SaaS platforms.'
    }
  ]

  const categories = ['all', 'Software Engineering', 'AI & Data', 'Creative & Digital']

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
              {/* Sleek monochromatic or metallic placeholder instead of rainbow */}
              <div
                className="project-image-box"
                style={{ background: project.image }}
              >
                <div className="project-hover-curtain">
                  <span className="curtain-text">View Case Study</span>
                </div>
              </div>
              <div className="project-editorial-info">
                <span className="project-meta-tag">{project.category}</span>
                <h3 className="project-editorial-title">{project.title}</h3>
                <p className="project-editorial-desc">{project.description}</p>
                <div className="project-editorial-link">
                  <span>Explore</span>
                  <FaArrowRight className="link-arrow"/>
                </div>
              </div>
            </div>
          ))}
        </div>

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
              
              <div
                className="modal-case-image"
                style={{ background: selectedProject.image }}
              ></div>
              
              <div className="modal-case-body">
                <p className="modal-case-description">{selectedProject.details}</p>
                <button className="case-live-btn">
                  View Live Platform
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
