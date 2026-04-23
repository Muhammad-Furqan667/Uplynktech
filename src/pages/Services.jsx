import { useState, useEffect } from 'react'
import { useSEO } from '../hooks/useSEO'
import { useNavigate } from 'react-router-dom'
import '../styles/ServicesPage.css'
import EngagementModels from '../components/EngagementModels'
import WhyChooseUs from '../components/WhyChooseUs'
import OurWork from '../components/OurWork'
import Testimonials from '../components/Testimonials'
import { FiArrowRight, FiZap, FiMonitor, FiSmartphone, FiPenTool, FiTrendingUp, FiCpu, FiCheckCircle, FiChevronDown, FiChevronUp, FiServer, FiStar, FiShield, FiUsers } from 'react-icons/fi'

export default function Services() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)
  const [expandedServices, setExpandedServices] = useState([])

  const toggleService = (id) => {
    setExpandedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  useSEO({
    title: 'Expert Digital Services - UPLYNK Tech | Elite B2B Agency',
    description: 'Grow your business with UPLYNK Tech services: Web Development, App Development, Graphic Design, Social Media Marketing, and AI Services.',
    canonical: 'https://uplynktech.com/services',
    keywords: 'web development, app development, ai engineering, digital growth strategies, social media marketing, graphic design'
  })

  // Data for the 5 core services
  const coreServices = [
    {
      id: 'web',
      icon: FiMonitor,
      title: 'Web Development',
      subtitle: 'Fast, secure, and beautiful websites.',
      description: 'We build responsive websites and web applications designed to turn your visitors into loyal customers.',
      target: '/consultation',
      cta: 'Get a Web Quote',
      deliverables: [
        { title: 'Custom Websites', desc: 'Fully bespoke designs tailored to your brand.' },
        { title: 'E-Commerce Portals', desc: 'Robust online stores built for scale.' },
        { title: 'Web Applications', desc: 'Complex SaaS and B2B web tools.' }
      ]
    },
    {
      id: 'app',
      icon: FiSmartphone,
      title: 'App Development',
      subtitle: 'Seamless mobile experiences.',
      description: 'Custom iOS and Android mobile apps built to give your users an engaging and frictionless experience.',
      target: '/consultation',
      cta: 'Discuss Your App Idea',
      deliverables: [
        { title: 'iOS & Android Apps', desc: 'Native-feel applications for all devices.' },
        { title: 'React Native', desc: 'Cross-platform apps for faster time-to-market.' },
        { title: 'UI/UX Mobile Design', desc: 'Interfaces your users will love.' }
      ]
    },
    {
      id: 'design',
      icon: FiPenTool,
      title: 'Graphic Designing',
      subtitle: 'Stunning visual identities.',
      description: 'Stand out from the crowd with premium logos, brand identities, and digital designs.',
      target: '/consultation',
      cta: 'Revamp Your Brand',
      deliverables: [
        { title: 'Brand Identity', desc: 'Complete brand kits and guidelines.' },
        { title: 'UI/UX Design', desc: 'Wireframes and high-fidelity mockups.' },
        { title: 'Marketing Materials', desc: 'Social posts, banners, and print.' }
      ]
    },
    {
      id: 'smm',
      icon: FiTrendingUp,
      title: 'Social Media Marketing',
      subtitle: 'Grow your audience and sales.',
      description: 'Smart strategies and creative campaigns to dominate your niche online and boost revenue.',
      target: '/consultation',
      cta: 'Start Growing',
      deliverables: [
        { title: 'Content Strategy', desc: 'Data-driven content calendars.' },
        { title: 'Paid Advertising', desc: 'High-ROI Meta and Google Ads.' },
        { title: 'Community Management', desc: 'Engaging directly with your audience.' }
      ]
    },
    {
      id: 'ai',
      icon: FiCpu,
      title: 'AI Services',
      subtitle: 'Automate tasks and scale up.',
      description: 'Leverage custom Artificial Intelligence tailored to your business to automate workflows and save time.',
      target: '/consultation',
      cta: 'Explore AI Options',
      deliverables: [
        { title: 'Custom Chatbots', desc: 'Intelligent 24/7 customer support.' },
        { title: 'Workflow Automation', desc: 'Connecting tools to remove manual tasks.' },
        { title: 'Predictive Analytics', desc: 'Using your data to forecast trends.' }
      ]
    }
  ]

  const trustStats = [
    { icon: FiServer, text: '99.9% Uptime SLA', color: '#10b981' },
    { icon: FiStar, text: '5-Star B2B Rated', color: '#f59e0b' },
    { icon: FiShield, text: 'Enterprise Security', color: '#0ea5e9' },
    { icon: FiUsers, text: 'Dedicated Project Managers', color: '#7c3aed' }
  ]

  // Double the stats for a seamless marquee loop
  const loopedStats = [...trustStats, ...trustStats, ...trustStats]

  const faqs = [
    { q: "How long does a typical project take?", a: "Timelines depend entirely on the scope of the project. A standard website might take 4-6 weeks, while a custom mobile app could take 3-4 months. We provide clear Gantt charts before we write any code." },
    { q: "Do you offer post-launch support?", a: "Absolutely. We believe in partnerships, not one-off transactions. We offer maintenance retainers, marketing campaigns, and continuous feature development after the initial launch." },
    { q: "How does pricing work?", a: "We operate on both fixed-price project models (best for well-defined scopes) and time-and-materials retainers (best for agile startups and ongoing marketing). We will recommend the best fit during our consultation." }
  ]

  return (
    <section className="services-page" style={{ paddingBottom: '80px' }}>
      
      {/* 1. Hero Section */}
      <div className="services-hero">
        <div className="hero-content">
          <p className="services-eyebrow">Technical & Creative Supremacy</p>
          <h1 className="services-title">We Build Digital Solutions<br />That Grow Your Business.</h1>
          <p className="services-subtitle">
            We design, build, and market high-performing websites, mobile apps, and custom AI tools that turn your visitors into loyal customers.
          </p>
          <button className="big-consultation-btn" onClick={() => navigate('/consultation')}>
            Get Your Free Proposal <FiArrowRight />
          </button>
        </div>
      </div>

      {/* 2. Trust Banner Marquee */}
      <div className="services-trust-marquee">
        <div className="marquee-fade-left" />
        <div className="marquee-fade-right" />
        <div className="trust-marquee-track">
          {loopedStats.map((stat, i) => {
            const StatIcon = stat.icon
            return (
              <div key={i} className="trust-stat-item">
                <StatIcon className="trust-stat-icon" style={{ color: stat.color }} />
                <span className="trust-stat-text">{stat.text}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. Problems We Solve */}
      <div className="problems-section">
        <div className="section-header-center">
          <p className="services-eyebrow">Why You Are Here</p>
          <h2>Are you facing these blockades?</h2>
        </div>
        <div className="problems-grid">
          {[
            { title: "Slow & Outdated Website", desc: "Your site is costing you clients because it functions poorly on mobile and takes seconds to load." },
            { title: "Manual Redundant Tasks", desc: "Your team is wasting hours doing data entry or customer support instead of acting on high-value strategy." },
            { title: "Low Conversion Rates", desc: "You get traffic, but nobody buys. Your web presence lacks the trust markers and UX required to close a sale." }
          ].map((problem, idx) => (
            <div key={idx} className="problem-card">
              <div className="problem-icon">⚠️</div>
              <h3>{problem.title}</h3>
              <p>{problem.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Our Services Breakdown */}
      <div className="services-pillars-section">
        <div className="services-pillars-grid">
          {coreServices.map((service) => {
            const Icon = service.icon
            return (
              <div key={service.id} id={service.id} className={`service-pillar ${expandedServices.includes(service.id) ? 'is-expanded' : ''}`} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div className="pillar-header">
                  <Icon className="pillar-main-icon" style={{ fontSize: '3rem', color: '#d4af37', marginBottom: '1.5rem' }} />
                  <span className="pillar-subtitle">{service.subtitle}</span>
                  <h2 className="pillar-title" style={{ marginBottom: '1rem' }}>{service.title}</h2>
                  <p className="pillar-desc">{service.description}</p>
                </div>

                <div className="pillar-expand-toggle" onClick={() => toggleService(service.id)}>
                  <span>{expandedServices.includes(service.id) ? 'Show Less' : 'View Details'}</span>
                  {expandedServices.includes(service.id) ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                
                <div className={`pillar-collapsible-content ${expandedServices.includes(service.id) ? 'show' : ''}`}>
                  <div className="pillar-items-list" style={{ marginTop: '2rem' }}>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>What We Deliver</h4>
                    {service.deliverables.map((del, idx) => (
                      <div key={idx} className="pillar-service-item" style={{ gap: '1rem' }}>
                        <div className="pillar-service-icon-box" style={{ background: 'transparent', border: 'none', width: 'auto', height: 'auto' }}>
                          <FiCheckCircle style={{ color: '#10b981', fontSize: '1.2rem' }} />
                        </div>
                        <div className="pillar-service-info">
                          <h3 className="pillar-service-title" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{del.title}</h3>
                          <p className="pillar-service-desc" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{del.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    className="pillar-cta-btn" 
                    onClick={() => navigate(service.target)}
                    style={{ marginTop: '2rem', width: '100%' }}
                  >
                    {service.cta} <FiArrowRight />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 5. Our Process */}
      <div className="process-section">
        <div className="section-header-center">
          <p className="services-eyebrow">How We Work</p>
          <h2>A Clear Path to Production</h2>
        </div>
        <div className="process-steps">
          {[
            { step: '01', title: 'Discover & Strategize', desc: 'We start with a free consultation to understand your business goals and map out a custom plan.' },
            { step: '02', title: 'Design & Build', desc: 'Our engineers and designers work hand-in-hand to build your product, giving you transparent updates at every milestone.' },
            { step: '03', title: 'Launch & Scale', desc: 'We deploy your project securely and provide continuous marketing support needed to help you scale.' },
          ].map((item, idx) => (
            <div key={idx} className="process-card">
              <div className="process-number">{item.step}</div>
              <div className="process-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Why Choose Us (Imported Component) */}
      <div id="service-why-choose-us">
        <WhyChooseUs />
      </div>

      {/* 7. Portfolio (Imported Component) */}
      <div id="portfolio">
        <OurWork />
      </div>

      {/* 8. Testimonials (Imported Component) */}
      <div id="testimonials">
        <Testimonials />
      </div>

      {/* 9. FAQ Section */}
      <div id="faqs" style={{ padding: '8rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="services-eyebrow">Got Questions?</p>
          <h2 style={{ fontSize: '3rem', color: 'var(--text-primary)' }}>Frequently Asked Questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{ width: '100%', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}
              >
                {faq.q}
                {openFaq === idx ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {openFaq === idx && (
                <div style={{ padding: '0 1.5rem 1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>


    
    </section>
  )
}
