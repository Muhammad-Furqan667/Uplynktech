import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import '../styles/Consultation.css'

export default function Consultation() {
  useSEO({
    title: 'Professional Strategic Consultation | UPLYNK Tech',
    description: 'Schedule a strategic consultation session with UPLYNK Tech experts to discuss your software engineering, AI, or digital growth objectives.',
    canonical: 'https://uplynktech.com/consultation',
    keywords: 'consultation, software engineering booking, ai strategy session, uplynk tech meeting'
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    details: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // 1. Ingest to Dashboard External Mailbox
      const { error: lError } = await supabase
        .from('contact_leads')
        .insert([{
          full_name: formData.name,
          email: formData.email,
          subject: 'Strategic Consultation Request',
          message: formData.details,
          meta: {
            company: formData.company
          }
        }])

      if (lError) throw lError

      // 2. Trigger SMTP Luxury Acknowledgment
      await supabase.functions.invoke('send-contact-email', {
        body: { 
          lead: { 
            full_name: formData.name, 
            email: formData.email,
            company: formData.company
          } 
        }
      })

      setSubmitted(true)
    } catch (error) {
      console.error('Submission failed:', error)
      alert('Strategic brief transmission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="consultation-success">
        <div className="success-content">
          <div className="success-icon-wrapper">
            <FiCheck className="success-icon" />
          </div>
          <h1>Session Requested.</h1>
          <p>Your strategic alignment brief has been received. Our engineering leads will review your objectives and reach out to <strong>{formData.email}</strong> within 24 hours to finalize the schedule.</p>
          <button className="back-home-btn" onClick={() => window.location.href = '/'}>Return Home</button>
        </div>
      </section>
    )
  }

  return (
    <section className="consultation-page">
      <div className="consultation-container">
        
        <div className="consultation-form-wrapper single-step">
          <div className="step-content">
            <h2 className="minimal-form-title">Strategic Connection Details</h2>
            <form onSubmit={handleSubmit} className="details-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => updateField('name', e.target.value)} 
                    required 
                    placeholder="e.g. Marcus Vance"
                  />
                </div>
                <div className="form-group">
                  <label>Business Email *</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => updateField('email', e.target.value)} 
                    required 
                    placeholder="name@company.com"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Company / Organization *</label>
                <input 
                  type="text" 
                  value={formData.company} 
                  onChange={e => updateField('company', e.target.value)} 
                  required
                  placeholder="Existing enterprise or startup name"
                />
              </div>
              <div className="form-group">
                <label>Project Brief *</label>
                <textarea 
                  value={formData.details} 
                  onChange={e => updateField('details', e.target.value)} 
                  required 
                  placeholder="Briefly describe your objectives, current challenges, and technical requirements..."
                  rows="5"
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit"
                  className="submit-consult-btn" 
                  disabled={loading || !formData.name || !formData.email || !formData.company || !formData.details}
                >
                  {loading ? 'Transmitting Brief...' : 'Book Strategic Session'} <FiArrowRight />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
