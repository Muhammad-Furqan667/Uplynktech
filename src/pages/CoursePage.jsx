import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { supabase } from '../lib/supabase'
import { ACADEMY_TRACKS, resolveIcon } from '../lib/icons'
import { checkLeadRateLimit } from '../lib/utils'
import '../styles/CoursePage.css'
import {
  FiArrowLeft, FiArrowRight, FiCheck, FiClock,
  FiUsers, FiAward, FiChevronDown, FiChevronUp, FiSend, FiZap, FiBookOpen
} from 'react-icons/fi'

export default function CoursePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  
  const [course, setCourse] = useState(null)
  const [trackCourses, setTrackCourses] = useState([])
  const [isCategory, setIsCategory] = useState(false)
  const [loadingContent, setLoadingContent] = useState(true)
  
  const [openFaq, setOpenFaq] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', background: 'beginner', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rateLimitMsg, setRateLimitMsg] = useState(null)

  // Identify category mapping
  const categoryMatch = Object.entries(ACADEMY_TRACKS).find(([key, val]) => val.slug === slug)

  useSEO({
    title: isCategory && categoryMatch ? `${categoryMatch[1].displayName} | UPLYNK Academy` : (course ? `${course.title} Course — UPLYNK Academy` : 'Academy Course | UPLYNK Tech'),
    description: isCategory && categoryMatch ? `Explore our elite ${categoryMatch[1].displayName} curriculum.` : (course ? course.description : 'Professional development and technical upskilling at UPLYNK Academy.'),
    canonical: `https://uplynktech.com/courses/${slug}`
  })

  useEffect(() => {
    async function fetchData() {
      setLoadingContent(true)
      try {
        if (categoryMatch) {
          // CATEGORY VIEW: Fetch all courses for this track
          setIsCategory(true)
          const { data, error } = await supabase
            .from('display_courses')
            .select('*')
            .eq('track_name', categoryMatch[0])
            .order('title', { ascending: true })
          
          if (error) throw error
          setTrackCourses(data || [])
        } else {
          // INDIVIDUAL COURSE VIEW
          setIsCategory(false)
          const { data, error } = await supabase
            .from('display_courses')
            .select('*')
            .eq('slug', slug)
            .single()

          if (error) throw error
          
          setCourse({
            ...data,
            instructor: data.details?.instructor || { name: 'Lead Instructor', title: 'Academy Expert', bio: 'Industry veteran.' },
            curriculum: data.details?.curriculum || [],
            whyChoose: data.details?.whyChoose || [],
            pricing: data.details?.pricing || [],
            faq: data.details?.faq || [],
            tagline: data.details?.tagline || 'Master your future.',
            nextBatch: data.details?.nextBatch || 'Coming Soon'
          })
        }
      } catch (err) {
        console.error('Content resolution error:', err)
        setCourse(null)
        setTrackCourses([])
      } finally {
        setLoadingContent(false)
      }
    }

    fetchData()
  }, [slug])

  if (loadingContent) {
    return (
      <div className="cp-loading-screen">
        <div className="loader"></div>
        <p>Resolving Academy Curriculum...</p>
      </div>
    )
  }

  // Render Track/Category Category View
  if (isCategory && categoryMatch) {
    const trackInfo = categoryMatch[1]
    const Icon = resolveIcon(trackInfo.icon)
    
    return (
      <div className="cp-page category-view">
        <section className="cp-hero track-hero" style={{ '--track-color': trackInfo.color }}>
          <div className="cp-hero-overlay" />
          <div className="cp-hero-inner">
            <button className="cp-back-btn" onClick={() => navigate('/courses')}>
              <FiArrowLeft /> All Categories
            </button>
            <div className="track-icon-badge">
              <Icon />
            </div>
            <p className="cp-eyebrow">Technical Track</p>
            <h1 className="cp-hero-title">{trackInfo.displayName}</h1>
            <p className="cp-hero-tagline">Elite curriculum designed for market dominance and technical authority.</p>
          </div>
        </section>

        <section className="cp-section">
          <div className="cp-container">
            <div className="track-grid-header">
              <h2 className="cp-section-title">Available Specializations</h2>
              <p className="track-section-desc">
                Select a specific course below to view the full curriculum, pricing, and enrollment options.
              </p>
            </div>
            
            <div className="track-courses-list">
              {trackCourses.map(c => (
                <div key={c.id} className="track-course-row" onClick={() => navigate(`/courses/${c.slug}`)}>
                  <div className="tc-meta">
                    <span className="tc-level">{c.level}</span>
                    <span className="tc-status">{c.status}</span>
                  </div>
                  <div className="tc-main">
                    <h3 className="tc-title">{c.title}</h3>
                    <p className="tc-desc">{c.description}</p>
                  </div>
                  <div className="tc-footer">
                    <div className="tc-pill"><FiClock /> {c.duration}</div>
                    <div className="tc-pill"><FiUsers /> {c.students}+</div>
                    <button className="tc-action">Explore Course <FiArrowRight /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Standard Detail View (Existing logic)
  if (!course) {
    return (
      <div className="cp-not-found">
        <h2>Curriculum not found</h2>
        <p>The requested Academy track or course does not exist or has been relocated.</p>
        <button onClick={() => navigate('/courses')}>← Back to Academy</button>
      </div>
    )
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setRateLimitMsg(null)

    try {
      // 1. Check Rate Limit (Hard Lock)
      const limit = await checkLeadRateLimit(form.email)
      if (!limit.allowed) {
        setRateLimitMsg(`Registrar line is secured. Please wait ${limit.remainingMins} minutes before sending another application.`)
        setLoading(false)
        return
      }

      // 2. Ingest to Dashboard External Mailbox (Priority #1)
      const { error: lError } = await supabase
        .from('contact_leads')
        .insert([{
          full_name: form.name,
          email: form.email,
          subject: `Enrollment: ${course.title}`,
          message: form.message || `No message provided. Background: ${form.background}`,
          company: 'Academy Applicant',
          meta: {
            slug,
            course: course.title,
            phone: form.phone,
            background: form.background,
            lead_type: 'academy',
            lead_origin: `Academy: ${course.title}`
          }
        }])

      if (lError) throw lError

      // 3. Trigger SMTP (Silent Failover)
      try {
        await supabase.functions.invoke('send-contact-email', {
          body: { 
            lead: { 
              full_name: form.name, 
              email: form.email,
              company: 'UPLYNK Academy',
              type: 'academy',
              origin: `Academy: ${course.title}`,
              course: course.title
            } 
          }
        })
      } catch (smtpErr) {
        console.error('SMTP Background failure:', smtpErr)
        // Update the record with failure flag in the background
        await supabase
          .from('contact_leads')
          .update({ meta: { 
            slug, 
            course: course.title, 
            phone: form.phone, 
            background: form.background, 
            lead_type: 'academy', 
            lead_origin: `Academy: ${course.title}`,
            smtp_failed: true 
          }})
          .eq('email', form.email)
          .order('created_at', { ascending: false })
          .limit(1)
      }

      setSubmitted(true)
    } catch (error) {
      console.error('Enrollment error:', error)
      alert('Failed to transmit application. Please try again or contact support.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cp-page">

      {/* HERO */}
      <section className="cp-hero">
        <div className="cp-hero-overlay" />
        <div className="cp-hero-inner">
          <button className="cp-back-btn" onClick={() => navigate('/courses')}>
            <FiArrowLeft /> All Courses
          </button>
          <p className="cp-eyebrow">UPLYNK Academy</p>
          <h1 className="cp-hero-title">{course.title}</h1>
          <p className="cp-hero-tagline">"{course.tagline}"</p>

          <div className="cp-meta-row">
            <div className="cp-meta-item"><FiClock /> {course.duration}</div>
            <div className="cp-meta-item"><FiUsers /> {(course.students || 0).toLocaleString()}+ Alumni</div>
            <div className="cp-meta-item"><FiAward /> {course.level}</div>
            <div className={`cp-meta-item cp-meta-status ${course.status?.toLowerCase().replace(' ', '-') || 'ongoing'}`}>
              Status: {course.status || 'Ongoing'}
            </div>
            {course.start_date && (
              <div className="cp-meta-item cp-meta-next">Next Batch: {new Date(course.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
            )}
          </div>

          <button className="cp-hero-cta" onClick={() => document.getElementById('cp-apply').scrollIntoView({ behavior: 'smooth' })}>
            Apply Now <FiArrowRight />
          </button>
        </div>
        <div className="cp-hero-wave" />
      </section>

      {/* OVERVIEW */}
      <section className="cp-section">
        <div className="cp-container">
          <div className="cp-overview-grid">
            <div className="cp-overview-text">
              <p className="cp-section-eyebrow">About This Course</p>
              <h2 className="cp-section-title">What You Will Learn</h2>
              <p className="cp-overview-desc">{course.description}</p>
            </div>
            <div className="cp-instructor-card">
              <p className="cp-instr-label">Your Instructor</p>
              <div className="cp-instr-avatar">
                {(course.instructor?.name || 'AI').split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="cp-instr-name">{course.instructor?.name || 'Academy Expert'}</h3>
              <p className="cp-instr-title">{course.instructor?.title || 'Lead Instructor'}</p>
              <p className="cp-instr-bio">{course.instructor?.bio || 'Dedicated to your success.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="cp-section cp-curriculum-section">
        <div className="cp-container">
          <p className="cp-section-eyebrow">Curriculum</p>
          <h2 className="cp-section-title">Week-by-Week Breakdown</h2>
          <div className="cp-curriculum-list">
            {(course.curriculum || []).map((item, i) => (
              <div key={i} className="cp-module">
                <div className="cp-module-week">{item.week}</div>
                <div className="cp-module-body">
                  <h4 className="cp-module-topic">{item.topic}</h4>
                  <p className="cp-module-details">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="cp-section">
        <div className="cp-container">
          <p className="cp-section-eyebrow">Why Us</p>
          <h2 className="cp-section-title">Why Choose This Course</h2>
          <div className="cp-why-grid">
            {(course.whyChoose || []).map((w, i) => (
              <div key={i} className="cp-why-card">
                <span className="cp-why-emoji">{w.icon}</span>
                <h4 className="cp-why-title">{w.title}</h4>
                <p className="cp-why-body">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="cp-section cp-pricing-section">
        <div className="cp-container">
          <p className="cp-section-eyebrow">Pricing</p>
          <h2 className="cp-section-title">Simple, Transparent Pricing</h2>
          <div className="cp-pricing-grid">
            {(course.pricing || []).map((plan, i) => {
              // Standardize features as an array
              const featuresList = Array.isArray(plan.features) 
                ? plan.features 
                : (typeof plan.features === 'string' 
                    ? plan.features.split(',').map(f => f.trim()).filter(f => f) 
                    : []);

              return (
                <div
                  key={i}
                  className={`cp-pricing-card ${plan.highlight ? 'cp-pricing-highlight' : ''}`}
                >
                  {plan.highlight && <div className="cp-pricing-badge">Most Popular</div>}
                  <h3 className="cp-plan-name">{plan.tier}</h3>
                  <div className="cp-plan-price">
                    <span className="cp-price-amount">{plan.price}</span>
                    <span className="cp-price-period">{plan.period}</span>
                  </div>
                  <ul className="cp-features-list">
                    {featuresList.map((f, j) => (
                      <li key={j} className="cp-feature-item">
                        <FiCheck className="cp-check-icon" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`cp-plan-btn ${plan.highlight ? 'cp-plan-btn-primary' : 'cp-plan-btn-outline'}`}
                    onClick={() => document.getElementById('cp-apply').scrollIntoView({ behavior: 'smooth' })}
                  >
                    {plan.cta || 'Get Started'} <FiArrowRight />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* APPLY FORM */}
      <section className="cp-section cp-apply-section" id="cp-apply">
        <div className="cp-container">
          <p className="cp-section-eyebrow">Enrollment</p>
          <h2 className="cp-section-title">Apply for This Course</h2>
          {submitted ? (
            <div className="cp-success-msg">
              <span className="cp-success-icon">🎉</span>
              <h3>Application Received!</h3>
              <p>Thanks, <strong>{form.name}</strong>! We'll reach out to <strong>{form.email}</strong> within 24 hours with next steps.</p>
              <button onClick={() => setSubmitted(false)} className="cp-try-again">Submit Another</button>
            </div>
          ) : (
            <form className="cp-apply-form" onSubmit={handleSubmit}>
              {rateLimitMsg && (
                <div className="rate-limit-notice" style={{ gridColumn: 'span 2', marginBottom: '1.5rem' }}>
                  {rateLimitMsg}
                </div>
              )}
              <div className="cp-form-row">
                <div className="cp-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="cp-form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="cp-form-row">
                <div className="cp-form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+92 3XX XXXXXXX"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="cp-form-group">
                  <label>Your Background</label>
                  <select
                    value={form.background}
                    onChange={e => setForm({ ...form, background: e.target.value })}
                  >
                    <option value="beginner">Complete Beginner</option>
                    <option value="some">Some Experience</option>
                    <option value="intermediate">Intermediate Skills</option>
                    <option value="professional">Working Professional</option>
                  </select>
                </div>
              </div>
              <div className="cp-form-group">
                <label>Why do you want to join? (Optional)</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your goals and what you hope to achieve..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <button type="submit" className="cp-submit-btn" disabled={loading}>
                {loading ? 'Processing Application...' : 'Submit Application'} <FiSend />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="cp-section cp-faq-section">
        <div className="cp-container cp-faq-container">
          <p className="cp-section-eyebrow">FAQ</p>
          <h2 className="cp-section-title">Frequently Asked Questions</h2>
          <div className="cp-faq-list">
            {(course.faq || []).map((item, i) => (
              <div
                key={i}
                className={`cp-faq-item ${openFaq === i ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="cp-faq-question">
                  <span>{item.q}</span>
                  {openFaq === i ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {openFaq === i && (
                  <div className="cp-faq-answer">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
