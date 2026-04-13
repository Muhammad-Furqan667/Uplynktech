import { useState, useEffect } from 'react'
import { useSEO } from '../hooks/useSEO'
import { useNavigate } from 'react-router-dom'
import '../styles/ServicesPage.css'
import EngagementModels from '../components/EngagementModels'
import { supabase } from '../lib/supabase'
import { resolveIcon } from '../lib/icons'
import { FiArrowRight, FiZap } from 'react-icons/fi'

export default function Services() {
  const navigate = useNavigate()
  const [pillars, setPillars] = useState([])
  const [loading, setLoading] = useState(true)

  useSEO({
    title: 'Strategic Digital Services - UPLYNK Tech | Elite B2B Engineering',
    description: 'Explore UPLYNK Tech services: Core Engineering, Intelligent Automation, and Market Dominance strategies tailored for modern business growth.',
    canonical: 'https://uplynktech.com/services',
    keywords: 'enterprise software, ai engineering, digital growth strategies, business automation, cloud infrastructure'
  })

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from('display_services')
          .select('*')
          .order('created_at', { ascending: true })

        if (error) throw error
        processServiceData(data)
      } catch (err) {
        console.error('Error fetching services:', err)
      } finally {
        setLoading(false)
      }
    }

    const processServiceData = (data) => {
      if (!data) return
      // Map backend 'capabilities' to frontend 'services' key for backward compatibility
      const formattedData = data.map(item => ({
        ...item,
        target: '/consultation', // Default target
        cta: item.cta_title || `Learn More about ${item.title}`,
        services: item.capabilities || [] // Map JSONB capabilities to the list
      }))
      setPillars(formattedData)
    }

    fetchServices()

    // Realtime Subscription
    const channel = supabase
      .channel('services-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'display_services'
        },
        async (payload) => {
          console.log('Realtime Service Update:', payload)
          const { data } = await supabase
            .from('display_services')
            .select('*')
            .order('created_at', { ascending: true })
          processServiceData(data)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <section className="services-page">
      <div className="services-hero">
        <div className="hero-content">
          <p className="services-eyebrow">Technical Supremacy</p>
          <h1 className="services-title">Specialized B2B<br />Capabilities.</h1>
          <p className="services-subtitle">
            UPLYNK provides elite, full-lifecycle digital transformations—from generative AI architecture to award-winning creative design—to empower modern enterprises.
          </p>
        </div>
      </div>


      {loading ? (
        <div className="services-loading">
          <div className="loader"></div>
          <p>Syncing Technical Capabilities...</p>
        </div>
      ) : (
        <div className="services-pillars-grid">
          {pillars.map((pillar) => (
            <div key={pillar.id} className="service-pillar">
              <div className="pillar-header">
                <span className="pillar-subtitle">{pillar.subtitle}</span>
                <h2 className="pillar-title">{pillar.title}</h2>
                <p className="pillar-desc">{pillar.description}</p>
              </div>
              
              <div className="pillar-items-list">
                {pillar.services.map((service, idx) => {
                  const Icon = resolveIcon(service.icon)
                  return (
                    <div key={service.id || idx} className="pillar-service-item">
                      <div className="pillar-service-icon-box">
                        <Icon className="pillar-service-icon" />
                      </div>
                      <div className="pillar-service-info">
                        <h3 className="pillar-service-title">{service.title}</h3>
                        <p className="pillar-service-desc">{service.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button 
                className="pillar-cta-btn" 
                onClick={() => navigate(pillar.target)}
              >
                {pillar.cta} <FiArrowRight />
              </button>
            </div>
          ))}
        </div>
      )}

      <EngagementModels />

      <section className="services-final-cta">
        <div className="final-cta-container">
          <h2 className="final-cta-heading">Ready for your strategic session?</h2>
          <button className="big-consultation-btn" onClick={() => navigate('/consultation')}>
            Book a Consultation Meeting <FiZap />
          </button>
        </div>
      </section>
    </section>
  )
}
