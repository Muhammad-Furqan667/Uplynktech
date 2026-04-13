import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiArrowRight } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import { checkLeadRateLimit } from '../lib/utils'
import '../styles/Contact.css'

export default function Contact() {
  useSEO({
    title: 'Precision Reach - Contact UPLYNK Analytics & Engineering',
    description: 'Establish a direct technical line with UPLYNK Tech. Reach our Islamabad headquarters or contact our global support ecosystem.',
    canonical: 'https://uplynktech.com/contact'
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rateLimitMsg, setRateLimitMsg] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setRateLimitMsg(null)

    try {
      // 1. Check Rate Limit (Hard Lock)
      const limit = await checkLeadRateLimit(formData.email)
      if (!limit.allowed) {
        setRateLimitMsg(`Engineering line is secured. Please wait ${limit.remainingMins} minutes before sending another transmission.`)
        setIsSubmitting(false)
        return
      }

      // 2. Ingest to Dashboard (Priority #1)
      const { error } = await supabase
        .from('contact_leads')
        .insert({
          full_name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          meta: {
            lead_type: 'consult',
            lead_origin: 'General Contact Form'
          }
        })

      if (error) throw error

      // 3. Trigger SMTP (Silent Failover)
      try {
        await supabase.functions.invoke('send-contact-email', {
          body: {
            lead: {
              full_name: formData.name,
              email: formData.email,
              type: 'consult',
              origin: 'General Contact'
            }
          }
        })
      } catch (smtpErr) {
        console.error('SMTP failure:', smtpErr)
        await supabase
          .from('contact_leads')
          .update({ meta: { lead_type: 'consult', lead_origin: 'General Contact Form', smtp_failed: true } })
          .eq('email', formData.email)
          .order('created_at', { ascending: false })
          .limit(1)
      }

      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      alert('Transmission error. Please try again or use direct mail.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMetas = [
    { icon: FiMail, label: 'Technical Inquiries', value: 'uplynktech@gmail.com', link: 'mailto:engineering@uplynktech.com' },
    { icon: FiPhone, label: 'Direct Line', value: '+92 329 8650167', link: 'tel:+923298650167' },
    { icon: FiMapPin, label: 'H.Q. Hub', value: 'Pak Austria Fachhuchschule ,Mang,Haripur', link: '#' },
    { icon: FiClock, label: 'Operational Response', value: 'Mon - Fri | 09:00 - 18:00 PKT', link: '#' }
  ]

  return (
    <section className="contact-page">
      {/* Dynamic Background Map */}
      <div className="map-background-container">
        <iframe
          title="UPLYNK Islamabad H.Q."
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106201.07686566055!2d72.93665313936998!3d33.68442011986558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfd07891722f%3A0x6059515c3bdb02b6!2sIslamabad%2C%20Pakistan!5e0!3m2!1sen!2s!4v1712580000000!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="google-map-iframe"
        ></iframe>
        <div className="map-overlay-gradient"></div>
      </div>

      <div className="contact-interface-container">
        <div className="contact-content-grid">

          {/* Left Side: Information HUD */}
          <div className="contact-info-hud">
            <div className="elite-badge">Global Access</div>
            <h1 className="contact-title">Establish <br /><span className="highlight">Contact.</span></h1>
            <p className="contact-intro">
              Connect with our senior engineering team to discuss deployments, architecture audits, or strategic AI integration.
            </p>

            <div className="hud-metas-list">
              {contactMetas.map((meta, idx) => (
                <a key={idx} href={meta.link} className="hud-meta-card">
                  <div className="meta-card-icon">
                    <meta.icon />
                  </div>
                  <div className="meta-card-info">
                    <span className="meta-label">{meta.label}</span>
                    <span className="meta-value">{meta.value}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Side: Command Form */}
          <div className="contact-form-facade">
            <div className="form-enclosure">
              <h3 className="form-headline">Send Transmission</h3>
              <form onSubmit={handleSubmit} className="elite-primitive-form">
                <div className="input-field">
                  <label>Full Identity</label>
                  <input
                    type="text"
                    placeholder="E.g. Ali Hashir"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Corporate Email</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Subject of Inquiry</label>
                  <input
                    type="text"
                    placeholder="Technical Alignment"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="input-field">
                  <label>Message Payload</label>
                  <textarea
                    placeholder="Describe your architectural requirements..."
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
                  {submitted ? 'Transmission Received ✓' : (isSubmitting ? 'Transmitting...' : 'Engage Line')} <FiSend className="btn-icon" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
