import React, { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiBookOpen, FiCalendar, FiUsers, FiClock, FiStar, FiMonitor, FiDollarSign, FiHelpCircle } from 'react-icons/fi'
import { supabase } from '../../../lib/supabase'
import DisplayListManager from './DisplayListManager'

const ManageCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [instructorFile, setInstructorFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const initialForm = {
    slug: '', track_name: 'AI-ML', title: '', description: '',
    duration: '', level: 'Beginner', students: 0,
    status: 'Ongoing', start_date: '',
    details: {
      trackDescription: '',
      tagline: 'Master your future.',
      nextBatch: 'Coming Soon',
      instructor: { name: '', title: '', bio: '', avatar_url: '' },
      curriculum: [],
      whyChoose: [],
      pricing: [],
      faq: []
    }
  }
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    fetchCourses()
  }, [])

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    if (!instructorFile) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(instructorFile)
    setPreviewUrl(url)
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [instructorFile])

  const fetchCourses = async () => {
    try {
      const { data } = await supabase.from('display_courses').select('*').order('created_at', { ascending: false })
      setCourses(data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const uploadInstructorImage = async (file, slug) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${slug}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('Instructors image')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('Instructors image')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let currentInstructor = { ...(formData.details?.instructor || initialForm.details.instructor) }

      // 1. Handle Instructor Image Upload
      if (instructorFile) {
        const publicUrl = await uploadInstructorImage(instructorFile, formData.slug || 'temp')
        currentInstructor.avatar_url = publicUrl
      }

      const postData = {
        ...formData,
        details: {
          ...formData.details,
          instructor: currentInstructor
        }
      }

      const { id, created_at, updated_at, ...cleanData } = postData

      if (editingId) {
        const { error } = await supabase.from('display_courses').update(cleanData).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('display_courses').insert([cleanData])
        if (error) throw error
      }
      fetchCourses()
      setFormData(initialForm)
      setInstructorFile(null)
      setEditingId(null)
    } catch (err) { console.error('Courses persistence error:', err.message) }
  }

  const handleEdit = (course) => {
    setInstructorFile(null)
    setEditingId(course.id)
    setFormData({
      ...course,
      start_date: course.start_date ? new Date(course.start_date).toISOString().split('T')[0] : '',
      details: {
        ...initialForm.details,
        ...(course.details || {}),
        instructor: {
          ...initialForm.details.instructor,
          ...(course.details?.instructor || {})
        }
      }
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // SCHEMAS FOR JSONB MANAGERS
  const curriculumSchema = [
    { key: 'week', label: 'Timeline', placeholder: 'Week 01 or Day 1' },
    { key: 'topic', label: 'Subject Heading', placeholder: 'Introduction to Transformers' },
    { key: 'details', label: 'Detailed Summary', type: 'textarea', placeholder: 'Deep dive into architecture...' }
  ]

  const whyChooseSchema = [
    { key: 'icon', label: 'Symbol (React Icon or Emoji)', placeholder: 'FiZap' },
    { key: 'title', label: 'Feature Title', placeholder: 'Direct Mentorship' },
    { key: 'body', label: 'Description', type: 'textarea', placeholder: 'Details about the benefit...' }
  ]

  const pricingSchema = [
    { key: 'tier', label: 'Plan Name', placeholder: 'Full Academy' },
    { key: 'price', label: 'Global Cost', placeholder: '$499' },
    { key: 'period', label: 'Billing Period', placeholder: 'one-time or /mo' },
    { key: 'features', label: 'Features (Comma Separated)', type: 'textarea', placeholder: 'Cert, Mentors, Cloud Access' },
    { key: 'cta', label: 'Button Text', placeholder: 'Get Started' }
  ]

  const faqSchema = [
    { key: 'q', label: 'Question', placeholder: 'Is there a certificate?' },
    { key: 'a', label: 'Answer', type: 'textarea', placeholder: 'Yes, upon completion...' }
  ]

  return (
    <div className="manage-section">
      <section className="admin-form-section">
        <h3>{editingId ? 'Update Academy Course' : 'Launch New Enrollment'}</h3>
        <form onSubmit={handleSubmit} className="admin-inline-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Course Title</label>
              <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Adv. AI Engineering" required />
            </div>
            <div className="form-group">
              <label>Track Discipline</label>
              <select value={formData.track_name} onChange={e => setFormData({ ...formData, track_name: e.target.value })}>
                <option value="AI-ML">AI & Machine Learning (deep)</option>
                <option value="Graphic-Design">Creative Design (digital)</option>
                <option value="Web-development">Web Engineering (advanced)</option>
              </select>
            </div>
            <div className="form-group">
              <label>URL Slug (Permanent Link)</label>
              <input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="e.g. ai-ml-advanced" required />
            </div>
            <div className="form-group">
              <label>Difficulty Level</label>
              <select value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Mastery">Elite/Mastery</option>
              </select>
            </div>
            <div className="form-group">
              <label>Enrollment Status</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="Ongoing">Ongoing</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Waitlist">Waitlist</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Course Duration</label>
              <input value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 12 Weeks" />
            </div>
            <div className="form-group">
              <label>Active Students / Capacity</label>
              <input type="number" value={formData.students} onChange={e => setFormData({ ...formData, students: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Batch Start Date</label>
              <input type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Direct Marketing Tagline</label>
              <input
                value={formData.details?.tagline || ''}
                onChange={e => setFormData({ ...formData, details: { ...formData.details, tagline: e.target.value } })}
                placeholder="The bold headline for the course page..."
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Track Overview (Shows on Category Page)</label>
              <textarea
                value={formData.details?.trackDescription || ''}
                onChange={e => setFormData({ ...formData, details: { ...formData.details, trackDescription: e.target.value } })}
                rows="2"
                placeholder="The high-level summary for the /courses/deep style pages..."
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>What You Will Learn "Manage "</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3" placeholder="Comprehensive detail about the curriculum objectives..." />
            </div>

            {/* INSTRUCTOR SUB-SECTION */}
            <div className="form-group" style={{ gridColumn: 'span 2', background: 'rgba(212,175,55,0.02)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ color: '#d4af37', margin: 0 }}>Lead Instructor Profile</label>
              </div>
              <div className="form-grid" style={{ marginTop: '0.5rem' }}>
                <input
                  placeholder="Instructor Name"
                  value={formData.details?.instructor?.name || ''}
                  onChange={e => setFormData({ ...formData, details: { ...formData.details, instructor: { ...(formData.details?.instructor || {}), name: e.target.value } } })}
                />
                <input
                  placeholder="Professional Title"
                  value={formData.details?.instructor?.title || ''}
                  onChange={e => setFormData({ ...formData, details: { ...formData.details, instructor: { ...(formData.details?.instructor || {}), title: e.target.value } } })}
                />
                
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.75rem', opacity: 0.8 }}>Instructor Photo (Upload or Paste Link)</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <input 
                        placeholder="Paste image URL here..."
                        value={formData.details?.instructor?.avatar_url || ''}
                        onChange={e => setFormData({ 
                          ...formData, 
                          details: { 
                            ...formData.details, 
                            instructor: { ...(formData.details?.instructor || {}), avatar_url: e.target.value } 
                          } 
                        })}
                        style={{ marginBottom: '8px' }}
                      />
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setInstructorFile(e.target.files[0])}
                        style={{ background: 'transparent', border: '1px dashed #d4af3733', padding: '10px', width: '100%' }}
                      />
                    </div>
                    
                    {/* LIVE PREVIEW WINDOW */}
                    <div className="live-avatar-preview" style={{ 
                      width: '100px', 
                      height: '100px', 
                      borderRadius: '12px', 
                      border: '2px solid #d4af37',
                      overflow: 'hidden',
                      background: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {(previewUrl || formData.details?.instructor?.avatar_url) ? (
                        <img 
                          src={previewUrl || formData.details?.instructor?.avatar_url} 
                          alt="Preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span style={{ fontSize: '10px', opacity: 0.5, textAlign: 'center' }}>No Image</span>
                      )}
                    </div>
                  </div>
                  {instructorFile && <small style={{ color: '#d4af37' }}>New Upload: {instructorFile.name}</small>}
                </div>

                <textarea
                  placeholder="Short Professional Bio"
                  style={{ gridColumn: 'span 2' }}
                  rows="2"
                  value={formData.details?.instructor?.bio || ''}
                  onChange={e => setFormData({ ...formData, details: { ...formData.details, instructor: { ...(formData.details?.instructor || {}), bio: e.target.value } } })}
                />
              </div>
            </div>
          </div>

          <div className="jsonb-managers-grid" style={{ marginTop: '2rem' }}>
            <DisplayListManager
              title="WEEK-By WEEK BReakdown modify "
              items={formData.details?.curriculum || []}
              schema={curriculumSchema}
              onChange={(items) => setFormData({ ...formData, details: { ...formData.details, curriculum: items } })}
              addButtonText="Add Module"
            />

            <DisplayListManager
              title="Why choose this course modify "
              items={formData.details?.whyChoose || []}
              schema={whyChooseSchema}
              onChange={(items) => setFormData({ ...formData, details: { ...formData.details, whyChoose: items } })}
              addButtonText="Add Benefit"
            />

            <DisplayListManager
              title="Pricing & Packages"
              items={formData.details?.pricing || []}
              schema={pricingSchema}
              onChange={(items) => setFormData({ ...formData, details: { ...formData.details, pricing: items } })}
              addButtonText="Add Pricing Tier"
            />

            <DisplayListManager
              title="Curriculum FAQ"
              items={formData.details?.faq || []}
              schema={faqSchema}
              onChange={(items) => setFormData({ ...formData, details: { ...formData.details, faq: items } })}
              addButtonText="Add Question"
            />
          </div>

          <div className="form-actions" style={{ marginTop: '2.5rem' }}>
            <button type="submit" className="primary-btn gold-btn">
              {editingId ? <FiCheck /> : <FiPlus />} {editingId ? 'Push Curriculum Changes' : 'Open Course Enrollment'}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="icon-btn" 
                onClick={() => { 
                  setEditingId(null); 
                  setInstructorFile(null);
                  setFormData(initialForm);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <div className="admin-divider"></div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Status</th>
              <th>Track</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.id}>
                <td><strong>{c.title}</strong><br /><small className="u-id">{c.duration}</small></td>
                <td><span className={`role-badge ${c.status === 'Ongoing' ? 'admin' : 'user'}`}>{c.status}</span></td>
                <td>{c.track_name}</td>
                <td>
                  <div className="admin-action-row">
                    <button className="icon-btn highlight" onClick={() => { setEditingId(c.id); setFormData(c) }}><FiEdit2 /></button>
                    <button className="icon-btn delete" onClick={() => { if (window.confirm('Delete course?')) supabase.from('display_courses').delete().eq('id', c.id).then(fetchCourses) }}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageCourses
