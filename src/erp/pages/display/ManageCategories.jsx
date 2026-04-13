import React, { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiGrid, FiLayers } from 'react-icons/fi'
import { supabase } from '../../../lib/supabase'
import DisplayListManager from './DisplayListManager'

const ManageCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  
  const initialForm = { slug: '', title: '', tagline: '', description: '', hero_icon: 'FiGrid', stats: [] }
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from('display_project_categories').select('*').order('title')
      setCategories(data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { id, created_at, updated_at, ...cleanData } = formData

      if (editingId) {
        const { error } = await supabase.from('display_project_categories').update(cleanData).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('display_project_categories').insert([cleanData])
        if (error) throw error
      }
      fetchCategories()
      setFormData(initialForm)
      setEditingId(null)
    } catch (err) { console.error('Categories persistence error:', err.message) }
  }

  const statsSchema = [
    { key: 'label', label: 'Metric Label', placeholder: 'e.g. Active Projects' },
    { key: 'value', label: 'Metric Value', placeholder: 'e.g. 50+' }
  ]

  const handleDelete = async (id) => {
    if (window.confirm('Delete category? Warning: This may break project links.')) {
      await supabase.from('display_project_categories').delete().eq('id', id)
      setCategories(categories.filter(c => c.id !== id))
    }
  }

  return (
    <div className="manage-section">
      <section className="admin-form-section">
        <h3>{editingId ? 'Edit Project Cluster' : 'Define New Category'}</h3>
        <form onSubmit={handleSubmit} className="admin-inline-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Category Title</label>
              <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. AI & ML" required />
            </div>
            <div className="form-group">
              <label>Category Slug</label>
              <input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="e.g. ai-ml" required />
            </div>
            <div className="form-group">
              <label>Hero Icon (Name or URL)</label>
              <input value={formData.hero_icon} onChange={e => setFormData({...formData, hero_icon: e.target.value})} placeholder="FiGrid or https://..." />
            </div>
            <div className="form-group">
              <label>Tagline</label>
              <input value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} placeholder="Visualizing the future..." />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="2" placeholder="Tell the story of this category..." />
            </div>
          </div>

          <div className="jsonb-managers-grid">
            <DisplayListManager 
              title="Category Overview Stats"
              items={formData.stats || []}
              schema={statsSchema}
              onChange={(items) => setFormData({...formData, stats: items})}
              addButtonText="Add Stat"
            />
          </div>

          <div className="form-actions" style={{ marginTop: '2rem' }}>
            <button type="submit" className="primary-btn gold-btn">
              {editingId ? <FiCheck /> : <FiPlus />} {editingId ? 'Update Cluster' : 'Define Category'}
            </button>
            {editingId && <button type="button" className="icon-btn" onClick={() => {setEditingId(null); setFormData(initialForm)}}>Cancel</button>}
          </div>
        </form>
      </section>

      <div className="admin-divider"></div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Slug</th>
              <th>Tagline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td><strong>{c.title}</strong></td>
                <td><code className="u-id">{c.slug}</code></td>
                <td>{c.tagline}</td>
                <td>
                  <div className="admin-action-row">
                    <button className="icon-btn highlight" onClick={() => {setEditingId(c.id); setFormData(c)}}><FiEdit2 /></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(c.id)}><FiTrash2 /></button>
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

export default ManageCategories
