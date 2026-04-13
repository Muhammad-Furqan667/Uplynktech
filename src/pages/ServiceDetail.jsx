import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import '../styles/ServiceDetail.css'
import { supabase } from '../lib/supabase'
import { resolveIcon } from '../lib/icons'
import { FiArrowLeft, FiArrowRight, FiZap } from 'react-icons/fi'

export default function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useSEO({
    title: data ? `${data.title} — Specialized Service | UPLYNK Tech` : 'Service Detail — UPLYNK Tech',
    description: data ? data.description : 'Explore UPLYNK Tech elite digital capabilities.',
    canonical: `https://uplynktech.com/services/${id}`
  })

  useEffect(() => {
    async function fetchService() {
      try {
        const { data: service, error } = await supabase
          .from('display_services')
          .select('*')
          .eq('slug', id)
          .single()

        if (error) throw error
        setData(service)
      } catch (err) {
        console.error('Error fetching service:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [id])

  if (loading) {
    return (
      <div className="sd-loading-screen">
        <div className="loader"></div>
        <p>Retrieving Architectural Core...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="sd-not-found">
        <h2>Capability Not Registered</h2>
        <button className="sd-back-home-btn" onClick={() => navigate('/services')}>← Back to Engineering</button>
      </div>
    )
  }

  const HeroIcon = resolveIcon(data.icon || 'FiTerminal')
  const details = data.details || {}

  return (
    <div className="sd-page">
      {/* HERO */}
      <section className="sd-hero">
        <div className="sd-hero-overlay" />
        <div className="sd-hero-inner">
          <button className="sd-back-btn" onClick={() => navigate('/services')}>
            <FiArrowLeft /> All Capabilities
          </button>
          <div className="sd-hero-icon-box">
            <HeroIcon className="sd-hero-icon" />
          </div>
          <p className="sd-eyebrow">Elite Capability</p>
          <h1 className="sd-title">{data.title}</h1>
          <p className="sd-subtitle">{details.tagline}</p>
          <p className="sd-desc">{data.description}</p>

          <div className="sd-stats-row">
            {(details.stats || []).map((stat, i) => (
              <div key={i} className="sd-stat">
                <span className="sd-stat-value">{stat.value}</span>
                <span className="sd-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES GRID */}
      <section className="sd-section">
        <div className="sd-container">
          <p className="sd-section-eyebrow">Core Expertise</p>
          <h2 className="sd-section-title">Specialized Verticals</h2>
          <div className="sd-grid">
            {(details.capabilities || []).map((cap, i) => {
              const CapIcon = resolveIcon(cap.icon || 'FiCheckCircle')
              return (
                <div key={i} className="sd-card">
                  <div className="sd-card-icon-wrap">
                    <CapIcon className="sd-card-icon" />
                  </div>
                  <h3 className="sd-card-title">{cap.title}</h3>
                  <p className="sd-card-desc">{cap.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="sd-section sd-method-section">
        <div className="sd-container">
          <p className="sd-section-eyebrow">The UPLYNK Approach</p>
          <h2 className="sd-section-title">High-Stakes Methodology</h2>
          <div className="sd-method-grid">
            {(details.methodology || []).map((m, i) => (
              <div key={i} className="sd-method-item">
                <span className="sd-method-num">{m.step}</span>
                <div className="sd-method-info">
                  <h4 className="sd-method-title">{m.title}</h4>
                  <p className="sd-method-desc">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sd-section sd-cta-section">
        <div className="sd-container">
          <div className="sd-cta-card">
            <h2 className="sd-cta-title">{details.ctaTitle || 'Ready to Engineer the Future?'}</h2>
            <p className="sd-cta-desc">{details.ctaDesc || 'Let us build something extraordinary together.'}</p>
            <button className="sd-cta-btn" onClick={() => navigate('/consultation')}>
              Request a Strategic Session <FiArrowRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
