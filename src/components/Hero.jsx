import { useNavigate } from 'react-router-dom'
import { FiCpu, FiLayers, FiZap, FiTarget } from 'react-icons/fi'
import './Hero.css'

export default function Hero() {
  const navigate = useNavigate()
  
  const excellenceBadges = [
    {
      id: '01',
      icon: FiLayers,
      title: 'Engineering',
      description: 'Architecting Resilient Enterprise Ecosystems & Scalable Infrastructure.'
    },
    {
      id: '02',
      icon: FiCpu,
      title: 'Strategic AI',
      description: 'Neural-Driven Business Intelligence & Automation Logic.'
    },
    /*
    {
      id: '03',
      icon: FiZap,
      title: 'The Academy',
      description: 'Forging the elite engineering pipeline via high-rigor deep-learning.'
    }
    */
  ]

  return (
    <section className="hero">
      <div className="hero-grid-container">
        
        {/* Left Side: Strategic Value Prop */}
        <div className="hero-text-content">
          <div className="hero-badge-elite">
            <span className="dot-pulse"></span> Industrial Engineering Cell
          </div>
          <h1 className="hero-main-title">
            <span className="reveal-box">Reshaping the</span> <br/>
            <span className="reveal-box accent">Digital Future.</span>
          </h1>
          <p className="hero-main-subtitle">
            Premium consultancy and next-generation engineering tailored for modern industry demands.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/consultation')}>Start Consultation</button>
            <button className="btn-secondary" onClick={() => navigate('/services')}>Our Expertise</button>
          </div>
        </div>

        {/* Right Side: Service Index (Unique HUD) */}
        <div className="hero-service-index">
          {excellenceBadges.map((badge, index) => (
            <div 
              key={badge.id} 
              className="service-index-item"
              style={{ animationDelay: `${0.8 + (index * 0.1)}s` }}
            >
              <div className="item-index">{badge.id}</div>
              <div className="item-content">
                <h3 className="item-title">{badge.title}</h3>
                <p className="item-meta">{badge.description}</p>
              </div>
              <div className="item-hover-indicator"></div>
            </div>
          ))}
        </div>

      </div>

      {/* Background Aesthetic Elements (Non-3D) */}
      <div className="hero-bg-grid"></div>
      <div className="hero-gradient-overlay"></div>
    </section>
  )
}
