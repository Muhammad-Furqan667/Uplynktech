import './About.css'
import { useNavigate } from 'react-router-dom'

export default function About() {
  const navigate = useNavigate()

  return (
    <section className="about">
      <div className="about-container">
        
        <div className="about-left">
          <p className="about-eyebrow">Enterprise Grade</p>
          <h2 className="about-heading">
            Engineering scalable <br className="hide-mobile"/> <span className="about-highlight">digital infrastructure</span> and <br className="hide-mobile"/> <span className="about-highlight">user experiences.</span>
          </h2>
        </div>

        <div className="about-right">
          <p className="about-paragraph primary-paragraph">
            At UplynkTech, we empower modern enterprises and aggressive startups by delivering high-quality, mission-critical digital solutions.
          </p>
          <p className="about-paragraph secondary-paragraph">
            We operate at the crucial intersection of advanced software architecture, artificial intelligence, and digital growth. Instead of relying on generic templates, our specialized unified engineering and creative teams build reliable products explicitly designed to accelerate your market dominance.
          </p>
          
          <div className="about-stats">
            <div className="stat-block">
              <span className="stat-number">150+</span>
              <span className="stat-label">Projects Deployed</span>
            </div>
            <div className="stat-block">
              <span className="stat-number">98%</span>
              <span className="stat-label">Client Retention</span>
            </div>
          </div>
          
          <button className="about-cta-btn" onClick={() => navigate('/about')}>
            Read Our Full Story
          </button>
        </div>

      </div>
    </section>
  )
}
