import { useState, useEffect } from 'react'
import { FiLink, FiTrash2, FiPlus } from 'react-icons/fi'
import { supabase } from '../../../lib/supabase'
import './AdminPanel.css'

const AdminHierarchy = () => {
  const [hierarchy, setHierarchy] = useState([])
  const [users, setUsers] = useState([])
  const [depts, setDepts] = useState([])
  
  // New Mapping State
  const [seniorId, setSeniorId] = useState('')
  const [juniorId, setJuniorId] = useState('')
  const [deptId, setDeptId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [hRes, uRes, dRes] = await Promise.all([
        supabase.from('hierarchy').select('*, senior:profiles!hierarchy_senior_id_fkey(full_name), user:profiles!hierarchy_user_id_fkey(full_name), dept:departments(name)'),
        supabase.from('profiles').select('id, full_name').order('full_name'),
        supabase.from('departments').select('id, name').order('name')
      ])

      if (hRes.error) throw hRes.error
      if (uRes.error) throw uRes.error
      if (dRes.error) throw dRes.error

      setHierarchy(hRes.data)
      setUsers(uRes.data)
      setDepts(dRes.data)
    } catch (error) {
      console.error('Error fetching hierarchy data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMapping = async (e) => {
    e.preventDefault()
    if (!seniorId || !juniorId || !deptId) return
    if (seniorId === juniorId) {
      alert('A user cannot be their own senior.')
      return
    }

    try {
      const { error } = await supabase
        .from('hierarchy')
        .insert({
          senior_id: seniorId,
          user_id: juniorId,
          dept_id: deptId
        })

      if (error) throw error
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteMapping = async (senior, junior, dept) => {
    try {
      const { error } = await supabase
        .from('hierarchy')
        .delete()
        .match({ senior_id: senior, user_id: junior, dept_id: dept })

      if (error) throw error
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="admin-hierarchy">
      <section className="admin-form-section">
        <h3>Map Senior/Junior Relationship</h3>
        <p className="form-hint">Define who reports to whom within a specific department.</p>

        <form onSubmit={handleCreateMapping} className="admin-inline-form">
          <div className="form-grid-3">
            <div className="form-group">
              <label>Senior (Manager)</label>
              <select value={seniorId} onChange={(e) => setSeniorId(e.target.value)} required>
                <option value="">Select Senior...</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Junior (Subordinate)</label>
              <select value={juniorId} onChange={(e) => setJuniorId(e.target.value)} required>
                <option value="">Select Junior...</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Department</label>
              <select value={deptId} onChange={(e) => setDeptId(e.target.value)} required>
                <option value="">Select Dept...</option>
                {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="primary-btn gold-btn">
            <FiLink /> Create Hierarchy
          </button>
        </form>
      </section>

      <div className="admin-divider"></div>

      <section className="mappings-list">
        <h3>Active Relationships ({hierarchy.length})</h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Senior</th>
                <th>Reporting Junior</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hierarchy.map((h, i) => (
                <tr key={`${h.senior_id}-${h.user_id}-${i}`}>
                  <td><strong>{h.senior?.full_name}</strong></td>
                  <td>{h.user?.full_name}</td>
                  <td><span className="dept-tag">{h.dept?.name}</span></td>
                  <td>
                    <button className="icon-btn delete" onClick={() => handleDeleteMapping(h.senior_id, h.user_id, h.dept_id)}>
                      <FiTrash2 />
                    </button>
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

export default AdminHierarchy
