import './WhyChooseUs.css'
import {
  FaUsers,
  FaLightbulb,
  FaAward,
  FaBook,
  FaTag,
  FaRocket
} from 'react-icons/fa'

export default function WhyChooseUs() {
  const features = [
    {
      id: 1,
      title: 'Skilled Team',
      description: 'Experienced and passionate engineering professionals dedicated to maintaining excellence at scale.',
      icon: FaUsers
    },
    {
      id: 2,
      title: 'Innovative Solutions',
      description: 'We leverage the latest technology architectures to deliver cutting-edge digital growth.',
      icon: FaLightbulb
    },
    {
      id: 3,
      title: 'Quality Services',
      description: 'Long-lasting and highly reliable digital solutions explicitly designed to stand the test of time.',
      icon: FaAward
    },
    {
      id: 4,
      title: 'Client-First Approach',
      description: 'Every project begins with understanding your goals. We build solutions tailored precisely to your business needs, not off-the-shelf templates.',
      icon: FaTag
    },
    {
      id: 5,
      title: 'Transparent Collaboration',
      description: 'Enterprise-grade services matched with rigorous transparency directly in our development pipeline.',
      icon: FaTag
    },
    {
      id: 6,
      title: 'Real-World Delivery',
      description: 'Practical execution through strict project management that makes genuine market impact.',
      icon: FaRocket
    }
  ]

  return (
    <section className="why-choose-us">
      <div className="why-choose-container">
        <div className="why-choose-header">
          <p className="why-choose-eyebrow">Our Value Proposition</p>
          <h2 className="why-choose-heading">Why Choose UPLYNK</h2>
          <p className="why-choose-subtitle">
            We combine rigorous technical engineering with strategic digital insight to solve complex enterprise problems.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon-wrapper">
                  <IconComponent className="feature-icon" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
