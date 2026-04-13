import {
  FiUsers,
  FiCode,
  FiZap,
  FiAward
} from 'react-icons/fi'
import './WhyChooseCourses.css'

export default function WhyChooseCourses() {
  const highlights = [
    {
      id: 1,
      title: 'Learn from Industry Experts',
      description: 'Our instructors are senior engineers and tech-leads who bring real-world enterprise logic into every curriculum session.',
      icon: FiUsers
    },
    {
      id: 2,
      title: 'Hands-on Deep Learning',
      description: 'Skip the generic theory. Build sophisticated neural networks and cloud-native systems used by modern tech giants.',
      icon: FiCode
    },
    {
      id: 3,
      title: 'Elite Technical Discipline',
      description: 'Stay ahead with a curriculum that is updated monthly to reflect the fastest-moving shifts in AI and Engineering.',
      icon: FiZap
    },
    {
      id: 4,
      title: 'Corporate Pipeline Architecture',
      description: 'We don\'t just teach; we place. Our graduates go directly into high-ticket enterprise pipelines through our partner network.',
      icon: FiAward
    }
  ]

  return (
    <section className="why-choose-courses">
      <div className="why-choose-container">
        
        {/* Header Section */}
        <div className="why-choose-header">
          <p className="academy-eyebrow">Enterprise Education</p>
          <h2 className="why-choose-title">The Academy Advantage</h2>
          <p className="why-choose-subtitle">
            We provide a high-rigor technical environment designed to forge top-tier engineering talent for modern business logic.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="highlights-grid">
          {highlights.map((highlight, index) => {
            const IconComponent = highlight.icon
            return (
              <div
                key={highlight.id}
                className="highlight-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="highlight-icon-box">
                  <IconComponent className="highlight-section-icon" />
                </div>
                <h3 className="highlight-title">{highlight.title}</h3>
                <p className="highlight-description">{highlight.description}</p>
                <div className="card-aesthetic-line"></div>
              </div>
            )
          })}
        </div>

        {/* Unified Stats Area */}
        <div className="academy-stats-grid">
          <div className="academy-stat-item">
            <span className="stat-value">5,000+</span>
            <span className="stat-label">Graduates Deployed</span>
          </div>
          <div className="academy-stat-item">
            <span className="stat-value">45+</span>
            <span className="stat-label">Senior Instructors</span>
          </div>
          <div className="academy-stat-item">
            <span className="stat-value">98.4%</span>
            <span className="stat-label">Placement Success</span>
          </div>
        </div>

      </div>
    </section>
  )
}
