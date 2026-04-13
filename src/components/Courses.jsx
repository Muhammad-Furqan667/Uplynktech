import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Courses.css'
import { FaGraduationCap, FaArrowRight, FaBell } from 'react-icons/fa'

export default function Courses() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const elitePrograms = [
    {
      id: 1,
      title: 'Full Stack Engineering',
      description: 'Master modern web architecture, databases, and scalable logic.',
      level: 'Professional',
      duration: '12 Weeks'
    },
    {
      id: 2,
      title: 'Generative AI & Machine Learning',
      description: 'Train deep neural networks and deploy custom LLM solutions.',
      level: 'Advanced',
      duration: '14 Weeks'
    },
    {
      id: 3,
      title: 'Cloud Computing & DevOps',
      description: 'Automate deployments and manage AWS/Azure clusters.',
      level: 'Intermediate',
      duration: '8 Weeks'
    }
  ]

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <section className="home-courses">
      <div className="home-courses-container">
        <div className="home-courses-header">
          <div className="header-badge">
            <FaGraduationCap className="badge-icon" /> UPLYNK Academy
          </div>
          <h2 className="home-courses-heading">Upscale Your Expertise</h2>
          <p className="home-courses-subtitle">
            World-class technical education programs tailored to bridge the gap between academia and elite industry demands.
          </p>
        </div>

        <div className="home-courses-grid">
          {elitePrograms.map((program, index) => (
            <div 
              key={program.id} 
              className="academy-card"
              style={{ animationDelay: `${index * 0.15}s` }}
              onClick={() => setShowModal(true)}
            >
              <div className="academy-card-meta">
                <span className="meta-tag">{program.level}</span>
                <span className="meta-tag">{program.duration}</span>
              </div>
              <h3 className="academy-card-title">{program.title}</h3>
              <p className="academy-card-description">{program.description}</p>
              
              <div className="academy-card-footer">
                <span className="academy-explore-text">Coming Soon</span>
                <FaArrowRight className="academy-arrow" />
              </div>
            </div>
          ))}
        </div>

        <div className="home-courses-footer">
          <button className="view-curriculum-btn" onClick={() => navigate('/courses')}>
            View Full Curriculum
          </button>
        </div>
      </div>

      {showModal && (
        <div className="academy-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="academy-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="academy-modal-close" onClick={() => setShowModal(false)}>×</button>
            <div className="academy-modal-icon">
              <FaBell />
            </div>
            <h3 className="academy-modal-heading">Admissions Opening Soon</h3>
            <p className="academy-modal-text">
              Join the waitlist to be notified when enrollment begins for our next cohort.
            </p>
            <div className="academy-email-wrapper">
              <input
                type="email"
                placeholder="Corporate or personal email"
                className="academy-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="academy-notify-btn" onClick={handleSubscribe}>
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
