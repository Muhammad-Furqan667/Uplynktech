import { useNavigate } from 'react-router-dom'
import './Services.css'
import { FiMonitor, FiBook, FiTrendingUp, FiArrowRight } from 'react-icons/fi'

export default function Services() {
  const navigate = useNavigate()

  const offerings = [
    {
      id: 'build',
      icon: FiMonitor,
      tag: 'Software & AI',
      title: 'Build a Project',
      description: 'We turn your idea into a production-ready product — from web apps and ERP systems to AI pipelines and mobile platforms.',
      action: () => navigate('/services'),
      color: '#7c3aed',
      tags: ['Web Development', 'AI / ML', 'Mobile Apps']
    },
    {
      id: 'learn',
      icon: FiBook,
      tag: 'UPLYNK Academy',
      title: 'Learn a Skill',
      description: 'Join intensive, outcome-driven courses in Web Dev, AI/ML, and Graphic Design — taught by engineers who build real products.',
      action: () => navigate('/courses'),
      color: '#0ea5e9',
      tags: ['AI / ML Course', 'Web Dev Course', 'Design Course']
    },
    {
      id: 'market',
      icon: FiTrendingUp,
      tag: 'Brand & Growth',
      title: 'Market Your Brand',
      description: 'Establish a dominant online presence with premium UI/UX, brand identity, social media strategy, and growth campaigns.',
      action: () => navigate('/services'),
      color: '#ec4899',
      tags: ['Brand Identity', 'Social Strategy', 'UI/UX Design']
    }
  ]

  return (
    <section className="home-services">
      <div className="home-services-container">
        <div className="home-services-header">
          <p className="services-eyebrow">What We Do</p>
          <h2 className="home-services-heading">How Can We Help You?</h2>
          <p className="home-services-subtext">Choose your path — whether you are building, learning, or growing, UPLYNK is your strategic partner.</p>
        </div>

        <div className="home-services-grid">
          {offerings.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="offering-card"
                style={{ '--card-color': item.color, animationDelay: `${index * 0.15}s` }}
                onClick={item.action}
              >
                <div className="offering-icon-wrap">
                  <Icon className="offering-icon" />
                </div>
                <span className="offering-tag">{item.tag}</span>
                <h3 className="offering-title">{item.title}</h3>
                <p className="offering-desc">{item.description}</p>
                <div className="offering-pills">
                  {item.tags.map((t, i) => (
                    <span key={i} className="offering-pill">{t}</span>
                  ))}
                </div>
                <button className="offering-cta">
                  Explore <FiArrowRight />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
