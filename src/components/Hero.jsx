import { useNavigate } from 'react-router-dom'
import { FiCpu, FiLayers, FiZap, FiTarget } from 'react-icons/fi'
import '../styles/components/Hero.css'

export default function Hero() {
  const navigate = useNavigate()

  const excellenceBadges = [
    {
      id: '01',
      icon: FiLayers,
      title: 'Web & App Development',
      description: 'Fast, secure, and beautiful digital products.'
    },
    {
      id: '02',
      icon: FiCpu,
      title: 'AI Services',
      description: 'Automate tasks and grow faster with custom AI.'
    },
    {
      id: '03',
      icon: FiZap,
      title: 'Digital Growth',
      description: 'Social Media & Design to boost sales online.'
    }
  ]

  return (
    <section className="hero">
      <div className="hero-grid-container">

        {/* Left Side: Strategic Value Prop */}
        <div className="hero-text-content">
          <h1 className="hero-main-title">
            <span className="reveal-box">We Build Digital Solutions</span> <br />
            <span className="reveal-box accent">That Grow Your Business.</span>
          </h1>
          <p className="hero-main-subtitle">
            From high-performing websites and mobile apps to smart AI solutions, we deliver technology that gets results.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/consultation')}>Get a Free Proposal</button>
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
