import { useNavigate } from 'react-router-dom'
import '../styles/components/Services.css'
import { FiMonitor, FiSmartphone, FiPenTool, FiTrendingUp, FiCpu, FiArrowRight } from 'react-icons/fi'

export default function Services() {
  const navigate = useNavigate()

  const offerings = [
    {
      id: 'web',
      icon: FiMonitor,
      tag: 'Development',
      title: 'Web Development',
      description: 'Fast, secure, and beautiful websites designed to turn your visitors into loyal customers.',
      action: () => navigate('/services'),
      color: '#0ea5e9',
      tags: ['Custom Websites', 'E-commerce', 'Portals']
    },
    {
      id: 'app',
      icon: FiSmartphone,
      tag: 'Development',
      title: 'App Development',
      description: 'Custom iOS and Android mobile apps built to give your users a seamless and engaging experience.',
      action: () => navigate('/services'),
      color: '#7c3aed',
      tags: ['iOS Apps', 'Android Apps', 'React Native']
    },
    {
      id: 'design',
      icon: FiPenTool,
      tag: 'Creative',
      title: 'Graphic Designing',
      description: 'Stunning visual identities, logos, and digital designs that make your brand stand out.',
      action: () => navigate('/services'),
      color: '#f59e0b',
      tags: ['Branding', 'UI/UX', 'Logos']
    },
    {
      id: 'smm',
      icon: FiTrendingUp,
      tag: 'Marketing',
      title: 'Social Media Marketing',
      description: 'Smart strategies and creative campaigns to grow your audience and boost your sales online.',
      action: () => navigate('/services'),
      color: '#ec4899',
      tags: ['Ads', 'Content', 'Strategy']
    },
    {
      id: 'ai',
      icon: FiCpu,
      tag: 'Technology',
      title: 'AI Services',
      description: 'Automate your tasks and grow faster with custom Artificial Intelligence tailored to your business.',
      action: () => navigate('/services'),
      color: '#10b981',
      tags: ['Machine Learning', 'Automation', 'Chatbots']
    }
  ]

  // Duplicate cards so the loop looks seamless
  const loopedCards = [...offerings, ...offerings]

  return (
    <section className="home-services">
      <div className="home-services-container">
        <div className="home-services-header">
          <p className="services-eyebrow">Our Expertise</p>
          <h2 className="home-services-heading">How Can We Help You?</h2>
          <p className="home-services-subtext">Choose your path — we design, build, and market solutions that drive real results.</p>
        </div>
      </div>

      {/* Full-width marquee track — outside container so it bleeds edge to edge */}
      <div className="services-marquee-outer">
        {/* Edge fade overlays */}
        <div className="marquee-fade-left" />
        <div className="marquee-fade-right" />

        <div className="services-marquee-track">
          {loopedCards.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={`${item.id}-${idx}`}
                className="offering-card"
                style={{ '--card-color': item.color }}
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
