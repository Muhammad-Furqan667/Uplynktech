import { FaCheckCircle, FaUsers, FaClock, FaLock } from 'react-icons/fa'
import './WhyChooseServices.css'

export default function WhyChooseServices() {
  return (
    <section className="why-choose-services">
      <div className="why-choose-container">
        <div className="why-choose-header">
          <h2 className="why-choose-heading">Why Choose Our Services</h2>
          <div className="why-choose-divider" />
          <p className="why-choose-description">
            We provide high-quality, reliable, and scalable tech solutions tailored to meet the unique needs of every client. 
            Our team focuses on innovation, performance, and user experience to deliver results that help businesses grow. 
            With a strong commitment to excellence, we ensure every project is handled with professionalism, attention to detail, 
            and the latest industry standards.
          </p>
        </div>

        <div className="highlights-grid">
          <div className="highlight-card" style={{ animationDelay: '0s' }}>
            <div className="highlight-icon-wrapper" style={{ borderColor: 'var(--accent-color)' }}>
              <div className="highlight-icon-inner" style={{ color: 'var(--accent-color)' }}>
                <FaCheckCircle />
              </div>
            </div>
            <h3 className="highlight-title">Customized Solutions</h3>
            <p className="highlight-text">Tailored tech solutions designed specifically for your business needs and goals.</p>
            <div className="highlight-accent" style={{ backgroundColor: 'var(--accent-color)' }} />
          </div>

          <div className="highlight-card" style={{ animationDelay: '0.1s' }}>
            <div className="highlight-icon-wrapper" style={{ borderColor: 'var(--accent-color)' }}>
              <div className="highlight-icon-inner" style={{ color: 'var(--accent-color)' }}>
                <FaUsers />
              </div>
            </div>
            <h3 className="highlight-title">Experienced Team</h3>
            <p className="highlight-text">Industry experts with years of experience delivering exceptional results.</p>
            <div className="highlight-accent" style={{ backgroundColor: 'var(--accent-color)' }} />
          </div>

          <div className="highlight-card" style={{ animationDelay: '0.2s' }}>
            <div className="highlight-icon-wrapper" style={{ borderColor: 'var(--accent-color)' }}>
              <div className="highlight-icon-inner" style={{ color: 'var(--accent-color)' }}>
                <FaClock />
              </div>
            </div>
            <h3 className="highlight-title">On-Time Delivery</h3>
            <p className="highlight-text">We guarantee timely project completion without compromising on quality.</p>
            <div className="highlight-accent" style={{ backgroundColor: 'var(--accent-color)' }} />
          </div>

          <div className="highlight-card" style={{ animationDelay: '0.3s' }}>
            <div className="highlight-icon-wrapper" style={{ borderColor: 'var(--accent-color)' }}>
              <div className="highlight-icon-inner" style={{ color: 'var(--accent-color)' }}>
                <FaLock />
              </div>
            </div>
            <h3 className="highlight-title">Scalable & Secure Systems</h3>
            <p className="highlight-text">Future-proof solutions with enterprise-level security and scalability.</p>
            <div className="highlight-accent" style={{ backgroundColor: 'var(--accent-color)' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
