import React, { useState, useEffect } from 'react'
import { FiMessageSquare, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiUser } from 'react-icons/fi'
import { supabase } from '../../../lib/supabase'

const ManageReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Form State
  const initialForm = {
    quote: '',
    author: '',
    title: '',
    company: '',
    is_featured: true
  }
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('display_reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { id, created_at, updated_at, ...updateData } = formData

      if (editingId) {
        const { error } = await supabase
          .from('display_reviews')
          .update(updateData)
          .eq('id', editingId)
        if (error) throw error
        setSuccess('Review updated successfully.')
      } else {
        const { error } = await supabase
          .from('display_reviews')
          .insert([updateData])
        if (error) throw error
        setSuccess('New review added.')
      }

      setEditingId(null)
      setFormData(initialForm)
      fetchReviews()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (review) => {
    setEditingId(review.id)
    setFormData({
      quote: review.quote || '',
      author: review.author || '',
      title: review.title || '',
      company: review.company || '',
      is_featured: review.is_featured ?? true
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return
    try {
      const { error } = await supabase.from('display_reviews').delete().eq('id', id)
      if (error) throw error
      setReviews(reviews.filter(r => r.id !== id))
      setSuccess('Review deleted.')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="manage-section">
      <section className="admin-form-section">
        <h3>{editingId ? 'Refine Social Proof' : 'Capture New Testimonial'}</h3>
        <p className="form-hint">Public-facing reviews that build trust and authority.</p>
        
        <form onSubmit={handleSubmit} className="admin-inline-form">
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>The Testimonial Quote</label>
              <textarea 
                value={formData.quote}
                onChange={(e) => setFormData({...formData, quote: e.target.value})}
                placeholder="UPLYNK acted as a true extension of our team..."
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>Author Name</label>
              <input 
                type="text" 
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                placeholder="Marcus Vance"
                required
              />
            </div>

            <div className="form-group">
              <label>Professional Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Chief Technology Officer"
              />
            </div>

            <div className="form-group">
              <label>Company</label>
              <input 
                type="text" 
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                placeholder="Aether Dynamics"
              />
            </div>

            <div className="form-group">
              <label>Visibility</label>
              <div className="flags-row">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={formData.is_featured} 
                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                  />
                  <span>Featured on Website?</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn gold-btn" disabled={loading}>
              {editingId ? <FiCheck /> : <FiPlus />} {editingId ? 'Update Review' : 'Add Testimonial'}
            </button>
            {editingId && (
              <button type="button" className="icon-btn" onClick={() => { setEditingId(null); setFormData(initialForm) }}>
                Cancel
              </button>
            )}
          </div>

          {error && <div className="admin-error">{error}</div>}
          {success && <div className="admin-success">{success}</div>}
        </form>
      </section>

      <div className="admin-divider"></div>

      <section className="user-list-section">
        <h3>Public Testimonials Archive</h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Company</th>
                <th>Quote Excerpt</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id}>
                  <td>
                    <div className="admin-user-cell">
                      <div className="user-avatar-mini">
                        <FiUser />
                      </div>
                      <div className="u-info">
                        <span className="u-name">{review.author}</span>
                        <span className="u-id">{review.title}</span>
                      </div>
                    </div>
                  </td>
                  <td>{review.company || '---'}</td>
                  <td style={{ maxWidth: '300px', fontSize: '0.85rem' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      "{review.quote}"
                    </div>
                  </td>
                  <td>
                    {review.is_featured ? (
                      <span className="role-badge admin">FEATURED</span>
                    ) : (
                      <span className="role-badge user">HIDDEN</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-action-row">
                      <button className="icon-btn highlight" onClick={() => handleEdit(review)}>
                        <FiEdit2 />
                      </button>
                      <button className="icon-btn delete" onClick={() => handleDelete(review.id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default ManageReviews
