import React, { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiLayers, FiActivity, FiTag } from 'react-icons/fi'
import { supabase } from '../../../lib/supabase'
import { resolveImageUrl } from '../../../lib/utils'
import DisplayImageUploader from './DisplayImageUploader'
import DisplayListManager from './DisplayListManager'

const ManageProjects = () => {
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  const initialForm = {
    slug: '', category: '', title: '', client: '', impact: '',
    image: '', description: '', tech: [], is_featured: false, stats: []
  }
  const [formData, setFormData] = useState(initialForm)
  const [techInput, setTechInput] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: pData } = await supabase.from('display_projects').select('*').order('created_at', { ascending: false })
      const { data: cData } = await supabase.from('display_project_categories').select('slug, title')
      setProjects(pData || [])
      setCategories(cData || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const techArray = techInput.split(',').map(t => t.trim()).filter(Boolean)
    const finalData = { ...formData, tech: techArray }

    try {
      const { id, created_at, updated_at, ...cleanData } = finalData

      if (editingId) {
        const { error } = await supabase.from('display_projects').update(cleanData).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('display_projects').insert([cleanData])
        if (error) throw error
      }
      fetchData()
      setFormData(initialForm)
      setEditingId(null)
      setTechInput('')
    } catch (err) { console.error('Projects persistence error:', err.message) }
  }

  const handleEdit = (p) => {
    setEditingId(p.id)
    setFormData({
      ...p,
      stats: p.stats || []
    })
    setTechInput(p.tech?.join(', ') || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const statsSchema = [
    { key: 'label', label: 'Metric Label', placeholder: 'e.g. Performance' },
    { key: 'value', label: 'Value/Stat', placeholder: 'e.g. 40% Increase' }
  ]

  const handleDelete = async (id) => {
    if (window.confirm('Delete project?')) {
      await supabase.from('display_projects').delete().eq('id', id)
      setProjects(projects.filter(p => p.id !== id))
    }
  }

  return (
    <div className="manage-section">
      <section className="admin-form-section">
        <h3>{editingId ? 'Refine Case Study' : 'Launch New Project'}</h3>
        <form onSubmit={handleSubmit} className="admin-inline-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Project Title</label>
              <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>URL Slug</label>
              <input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="e.g. smart-city-ai" required />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <DisplayImageUploader
                value={formData.image}
                onChange={(val) => setFormData({ ...formData, image: val })}
                bucket="project image"
                label="Project Hero Media"
                placeholder="Storage URI or Case Study Link..."
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.slug} value={c.slug}>{c.title}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Tech Stack (Comma Separated)</label>
              <input value={techInput} onChange={e => setTechInput(e.target.value)} placeholder="React, Python, AWS" />
            </div>
            <div className="form-group">
              <label>Client Name</label>
              <input value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} placeholder="e.g. Acme Corp" />
            </div>
            <div className="form-group">
              <label>Project Impact / Result</label>
              <input value={formData.impact} onChange={e => setFormData({ ...formData, impact: e.target.value })} placeholder="e.g. 40% efficiency boost" />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3" />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                <span>Display in Featured Section?</span>
              </label>
            </div>
          </div>

          <div className="jsonb-managers-grid">
            <DisplayListManager
              title="Project Success Metrics"
              items={formData.stats || []}
              schema={statsSchema}
              onChange={(items) => setFormData({ ...formData, stats: items })}
              addButtonText="Add Metric"
            />
          </div>

          <div className="form-actions" style={{ marginTop: '2rem' }}>
            <button type="submit" className="primary-btn gold-btn">
              {editingId ? <FiCheck /> : <FiPlus />} {editingId ? 'Save Changes' : 'Create Project'}
            </button>
            {editingId && <button type="button" className="icon-btn" onClick={() => { setEditingId(null); setFormData(initialForm); setTechInput('') }}>Cancel</button>}
          </div>
        </form>
      </section>

      <div className="admin-divider"></div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Category</th>
              <th>Impact</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="admin-user-cell">
                    <div className="user-avatar-mini">{p.image ? <img src={resolveImageUrl(p.image)} alt="" /> : <FiLayers />}</div>
                    <div className="u-info"><span className="u-name">{p.title}</span><span className="u-id">{p.slug}</span></div>
                  </div>
                </td>
                <td><span className="dept-tag">{p.category}</span></td>
                <td>{p.impact || '---'}</td>
                <td>{p.is_featured ? '✅' : '---'}</td>
                <td>
                  <div className="admin-action-row">
                    <button className="icon-btn highlight" onClick={() => handleEdit(p)}><FiEdit2 /></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(p.id)}><FiTrash2 /></button>
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

export default ManageProjects
