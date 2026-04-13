import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { FiTarget, FiEye, FiZap, FiShield, FiTrendingUp, FiGlobe, FiArrowRight } from 'react-icons/fi';
import '../styles/AboutUsPage.css';

const AboutUsPage = () => {
  useSEO({
    title: 'The UPLYNK Evolution - Engineering the Digital Future',
    description: 'Discover the technical core of UPLYNK Tech. Learn about our mission to architect resilient systems and our vision for global digital supremacy.',
    canonical: 'https://uplynktech.com/about'
  })

  const values = [
    { icon: FiZap, title: 'Incite Innovation', desc: 'Pushing the boundaries of what architecture can achieve.' },
    { icon: FiShield, title: 'Resilient Design', desc: 'Building systems that withstand the pressures of global scaling.' },
    { icon: FiTrendingUp, title: 'Strategic Growth', desc: 'Aligning technical decisions with massive market dominance.' },
    { icon: FiGlobe, title: 'Universal Impact', desc: 'Engineering solutions that solve global enterprise challenges.' }
  ]

  return (
    <div className="aboutus-page">
      {/* HUD Hero */}
      <section className="aboutus-hero">
        <div className="aboutus-hero-inner">
          <div className="elite-badge">Systemic Core</div>
          <h1 className="hero-title">
            Engineering the <br/><span className="highlight">Digital Evolution.</span>
          </h1>
          <p className="hero-subtitle">
            UPLYNK is the architectural backbone for the next generation of digital giants. We don't just build; we engineer for supremacy.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => window.location.href='/services'}>Explore Capabilities</button>
            <button className="btn-secondary" onClick={() => window.location.href='/projects'}>View Portfolio</button>
          </div>
        </div>
      </section>

      {/* Systemic Mission Section */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mission-flex">
            <div className="mission-module active">
              <div className="module-header">
                <FiTarget className="module-icon" />
                <span className="module-index">01</span>
              </div>
              <h2 className="module-title">The Mission.</h2>
              <p className="module-text">
                To architect high-rigor digital foundations that empower enterprises to automate complex logic and capture unprecedented market share through technical supremacy.
              </p>
            </div>
            <div className="mission-module">
              <div className="module-header">
                <FiEye className="module-icon" />
                <span className="module-index">02</span>
              </div>
              <h2 className="module-title">The Vision.</h2>
              <p className="module-text">
                To become the global standard for industrial engineering and AI integration—where every pixel and every line of code serves a strategic business objective.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values (Flexible HUD Cards) */}
      <section className="values-section">
        <div className="container">
          <div className="section-intro">
            <h2 className="section-headline">Architectural Values</h2>
            <p className="section-sub">These principles guide every deployment in the UPLYNK ecosystem.</p>
          </div>
          
          <div className="values-hud-grid">
            {values.map((v, i) => (
              <div key={i} className="value-hud-card">
                <div className="v-card-top">
                  <v.icon className="v-icon" />
                </div>
                <h3 className="v-title">{v.title}</h3>
                <p className="v-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="about-final-cta">
        <div className="container">
          <div className="cta-enclosure">
            <h2>Ready to Begin Your Evolution?</h2>
            <button className="btn-primary" onClick={() => window.location.href='/consultation'}>
              Start Discovery Phase <FiArrowRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
