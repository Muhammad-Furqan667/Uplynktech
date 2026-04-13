import { useSEO } from '../hooks/useSEO'
import '../styles/Career.css'

export default function Career() {
  useSEO({
    title: 'Careers at UPLYNK Tech | Join Our Growing Team',
    description: 'Join UPLYNK Tech! We are hiring talented developers, designers, and innovators. Explore career opportunities and grow with us.',
    canonical: 'https://uplynktech.com/career',
    keywords: 'careers, jobs, employment, developer jobs, designer jobs, tech careers, UPLYNK Tech'
  })

  return (
    <section className="career-page">
      <div className="career-container">
        <h1 className="career-title">Grow Your Career With Us</h1>
        
        <div className="career-content">
          <p className="career-message">
            At UPLYNK Tech, we believe in empowering talented individuals to reach their full potential. 
            We're looking for passionate developers, designers, and innovators who want to make a real impact 
            in the tech industry.
          </p>

          <div className="career-sections">
            <div className="career-section">
              <h2>Why Join Us?</h2>
              <ul>
                <li>Work on cutting-edge projects and technologies</li>
                <li>Collaborate with talented and creative team members</li>
                <li>Continuous learning and professional development opportunities</li>
                <li>Competitive compensation and benefits package</li>
                <li>Flexible work environment with remote options</li>
              </ul>
            </div>

            <div className="career-section">
              <h2>Current Opportunities</h2>
              <p>
                We're currently hiring for several positions across our organization. 
                Check back soon for open positions or send us your resume to 
                <span className="highlight"> careers@uplynktech.com</span>
              </p>
            </div>

            <div className="career-section">
              <h2>Internship Program</h2>
              <p>
                Interested in gaining real-world experience? Join our internship program and 
                work alongside experienced professionals on meaningful projects that drive innovation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
