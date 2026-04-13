import React, { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiLayers, FiActivity, FiSearch, FiStar } from 'react-icons/fi'
import { supabase } from '../../../lib/supabase'
import DisplayListManager from './DisplayListManager'

const ManageServices = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  const initialForm = {
    slug: '', title: '', subtitle: '', tagline: '', description: '',
    hero_icon: 'FiLayers', stats: [], capabilities: [], methodology: [],
    cta_title: '', cta_desc: ''
  }
  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data } = await supabase.from('display_services').select('*').order('title')
      setServices(data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { id, created_at, updated_at, ...cleanData } = formData

      if (editingId) {
        const { error } = await supabase.from('display_services').update(cleanData).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('display_services').insert([cleanData])
        if (error) throw error
      }
      fetchServices()
      setFormData(initialForm)
      setEditingId(null)
    } catch (err) { console.error('Services persistence error:', err.message) }
  }

  const statsSchema = [
    { key: 'label', label: 'Metric Label', placeholder: 'e.g. Uptime SLA' },
    { key: 'value', label: 'Value', placeholder: 'e.g. 99.9%' }
  ]

  const capabilitiesSchema = [
    { key: 'title', label: 'Capability Title', placeholder: 'e.g. API Engineering' },
    { key: 'desc', label: 'Description', type: 'textarea', placeholder: 'Details...' },
    { key: 'icon', label: 'Icon selection', type: 'icon', placeholder: 'FiCpu or URL' }
  ]

  const methodologySchema = [
    { key: 'step', label: 'Step #', placeholder: '01' },
    { key: 'title', label: 'Phase Title', placeholder: 'Discovery' },
    { key: 'desc', label: 'Phase Detail', type: 'textarea', placeholder: 'Execution summary...' }
  ]

  return (
    <div className="manage-section">
      <section className="admin-form-section">
        <h3>{editingId ? 'Refine Service offering' : 'Launch New Service'}</h3>
        <form onSubmit={handleSubmit} className="admin-inline-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Service Title</label>
              <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="e.g. engineering" required />
            </div>
            <div className="form-group">
              <label>Text above main heading </label>
              <input value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} placeholder="Technical Pillars..." />
            </div>
            <div className="form-group">
              <label>Hero Icon (Name or URL)</label>
              <input value={formData.hero_icon} onChange={e => setFormData({ ...formData, hero_icon: e.target.value })} placeholder="FiCpu or https://..." />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Tagline</label>
              <input value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} placeholder="The mission statement for this service..." />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3" />
            </div>

            <div className="form-group">
              <label>CTA Button Title</label>
              <input value={formData.cta_title} onChange={e => setFormData({ ...formData, cta_title: e.target.value })} placeholder="Start Project" />
            </div>
            <div className="form-group">
              <label>CTA Sub-description</label>
              <input value={formData.cta_desc} onChange={e => setFormData({ ...formData, cta_desc: e.target.value })} placeholder="Ready to scale?" />
            </div>
          </div>

          <div className="jsonb-managers-grid">
            <DisplayListManager
              title="Execution Stats"
              items={formData.stats || []}
              schema={statsSchema}
              onChange={(items) => setFormData({ ...formData, stats: items })}
              addButtonText="Add Metric"
            />

            <DisplayListManager
              title="Texts below main heading "
              items={formData.capabilities || []}
              schema={capabilitiesSchema}
              onChange={(items) => setFormData({ ...formData, capabilities: items })}
              addButtonText="Add Capability"
            />

            <DisplayListManager
              title="Success Methodology"
              items={formData.methodology || []}
              schema={methodologySchema}
              onChange={(items) => setFormData({ ...formData, methodology: items })}
              addButtonText="Add Phase"
            />
          </div>

          <div className="form-actions" style={{ marginTop: '2rem' }}>
            <button type="submit" className="primary-btn gold-btn">
              {editingId ? <FiCheck /> : <FiPlus />} {editingId ? 'Update Service' : 'Create Service'}
            </button>
            {editingId && <button type="button" className="icon-btn" onClick={() => { setEditingId(null); setFormData(initialForm) }}>Cancel</button>}
          </div>
        </form>
      </section>

      <div className="admin-divider"></div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Tagline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td><strong>{s.title}</strong><br /><small className="u-id">/{s.slug}</small></td>
                <td>{s.tagline}</td>
                <td>
                  <div className="admin-action-row">
                    <button className="icon-btn highlight" onClick={() => { setEditingId(s.id); setFormData(s) }}><FiEdit2 /></button>
                    <button className="icon-btn delete" onClick={() => { if (window.confirm('Delete service?')) supabase.from('display_services').delete().eq('id', s.id).then(fetchServices) }}><FiTrash2 /></button>
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

export default ManageServices
