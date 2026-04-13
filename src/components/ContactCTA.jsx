import { useState } from 'react'
import { FiArrowRight, FiX } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // 1. Ingest to Dashboard External Mailbox
      const { error: lError } = await supabase
        .from('contact_leads')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: 'General Project Inquiry',
          message: formData.projectDetails,
          meta: { company: formData.company }
        }])

      if (lError) throw lError

      // 2. Trigger SMTP Luxury Acknowledgment
      await supabase.functions.invoke('send-contact-email', {
        body: { lead: { full_name: formData.name, email: formData.email } }
      })

      setSubmitted(true)
      setFormData({ name: '', email: '', company: '', projectDetails: '' })
      setTimeout(() => {
        setSubmitted(false)
        setShowForm(false)
      }, 4000)
    } catch (error) {
      console.error('Submission failed:', error)
      alert('Inquiry transmission failed. Please try again.')
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

                  <button type="submit" className="form-submit-btn">
                    Submit Inquiry
                    <FiArrowRight />
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
