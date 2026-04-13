import './EngagementModels.css'
import { FiUsers, FiBox, FiActivity } from 'react-icons/fi'

export default function EngagementModels() {
  const models = [
    {
      id: 1,
      icon: FiBox,
      title: 'Project-Based',
      desc: 'Defined scope with high-performance delivery. Precision engineering for fixed objectives and clear timelines.',
      bestFor: 'MVPs, Feature Sprints'
    },
    {
      id: 2,
      icon: FiUsers,
      title: 'Dedicated Squads',
      desc: 'Seamless team augmentation. A full-stack engineering cell that integrates directly into your enterprise workflow.',
      bestFor: 'Agile Scale, Legacy Maintenance'
    },
    {
      id: 3,
      icon: FiActivity,
      title: 'Strategic Advisory',
      desc: 'Consultative architecture audits and high-level technical direction. Elite oversight for your critical systems.',
      bestFor: 'Tech-Audit, Systems-Design'
    }
  ]

  return (
    <section className="engagement-models">
      <div className="engagement-container">
        <div className="engagement-header">
          <p className="engagement-eyebrow">Flexibility at Scale</p>
          <h2 className="engagement-title">Custom Engagement Models</h2>
          <p className="engagement-subtitle">
            Every business requires a unique technical rhythm. We offer adaptive partnership structures to match your operational velocity.
          </p>
        </div>

        <div className="engagement-grid">
          {models.map(model => {
            const Icon = model.icon
            return (
              <div key={model.id} className="engagement-card">
                <div className="model-icon-box">
                  <Icon className="model-icon" />
                </div>
                <h3 className="model-title">{model.title}</h3>
                <p className="model-desc">{model.desc}</p>
                <div className="model-best-for">
                  <span>Best For:</span> {model.bestFor}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
