import { useState } from 'react'
import { FiArrowRight, FiX, FiSend } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import { checkLeadRateLimit } from '../lib/utils'
import './ContactCTA.css'

export default function ContactCTA() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectDetails: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rateLimitMsg, setRateLimitMsg] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setRateLimitMsg(null)
    
    try {
      // 1. Check Rate Limit
      const limit = await checkLeadRateLimit(formData.email)
      if (!limit.allowed) {
        setRateLimitMsg(`Transmission line secured. Please wait ${limit.remainingMins} minutes.`)
        setIsSubmitting(false)
        return
      }

      // 2. Ingest to Dashboard (Strict Schema)
      const { error: lError } = await supabase
        .from('contact_leads')
        .insert([{
          full_name: formData.name,
          email: formData.email,
          subject: 'General Project Inquiry',
          message: formData.projectDetails,
          company: formData.company,
          meta: { 
            company: formData.company,
            lead_type: 'consult',
            lead_origin: 'Homepage CTA Modal'
          }
        }])

      if (lError) throw lError

      // 3. Trigger SMTP (Silent Failover)
      try {
        const { error: fError } = await supabase.functions.invoke('send-contact-email', {
          body: { 
            lead: { 
              full_name: formData.name, 
              email: formData.email,
              company: formData.company,
              type: 'consult',
              origin: 'Homepage CTA Modal'
            } 
          }
        })

        if (fError) throw fError
      } catch (smtpErr) {
        console.error('[SMTP_DIAGNOSTIC]', smtpErr)
        await supabase
          .from('contact_leads')
          .update({ meta: { 
            company: formData.company, 
            lead_type: 'consult', 
            lead_origin: 'Homepage CTA Modal',
            smtp_failed: true,
            smtp_error: smtpErr.message || 'Transmission failed'
          }})
          .eq('email', formData.email)
          .order('created_at', { ascending: false })
          .limit(1)
      }

      setSubmitted(true)
      setFormData({ name: '', email: '', company: '', projectDetails: '' })
      setTimeout(() => {
        setSubmitted(false)
        setShowForm(false)
      }, 4000)
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="contact-cta">
      <div className="cta-content">
        <h2 className="cta-massive-heading">Have a bold project<br/>in mind?</h2>
        <div className="cta-action-row">
          <p className="cta-subtext">
            Partner with our world-class engineering and creative teams to build solutions that scale.
          </p>
          <button className="cta-trigger-btn" onClick={() => setShowForm(true)}>
            Start a Conversation
            <FiArrowRight className="button-arrow" />
          </button>
        </div>
      </div>

      {/* Modern Minimalist Contact Form Modal */}
      {showForm && (
        <div className="form-modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="form-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="form-close-btn" onClick={() => setShowForm(false)}>
              <FiX />
            </button>

            {submitted ? (
              <div className="form-success-state">
                <h3 className="success-heading">Request Received</h3>
                <p className="success-text">Our enterprise team will review your requirements and reach out within 24 hours.</p>
              </div>
            ) : (
              <>
                <h3 className="modal-title">Project Inquiry</h3>
                {rateLimitMsg && (
                  <div className="rate-limit-notice-modal">
                    {rateLimitMsg}
                  </div>
                )}
                <form className="elite-contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Work Email</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="company">Company / Organization</label>
                    <input type="text" id="company" name="company" value={formData.company} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="projectDetails">Project Overview</label>
                    <textarea id="projectDetails" name="projectDetails" value={formData.projectDetails} onChange={handleInputChange} rows="4" placeholder="Briefly describe your objectives..." required></textarea>
                  </div>

                  <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Transmitting...' : 'Submit Inquiry'}
                    {isSubmitting ? <div className="btn-spinner"></div> : <FiSend />}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
