import React from 'react'
import { FiPlus, FiTrash2, FiLayers } from 'react-icons/fi'

/**
 * DisplayListManager
 * A reusable orchestrator for JSONB array fields (Stats, Capabilities, etc.)
 */
const DisplayListManager = ({ 
  items = [], 
  onChange, 
  schema = [], 
  title = "List Items",
  addButtonText = "Add Entry"
}) => {
  
  const handleAddItem = () => {
    const newItem = schema.reduce((acc, field) => {
      acc[field.key] = field.type === 'number' ? 0 : ''
      return acc
    }, {})
    onChange([...items, newItem])
  }

  const handleUpdateItem = (index, key, value) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) return { ...item, [key]: value }
      return item
    })
    onChange(updatedItems)
  }

  const handleRemoveItem = (index) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="list-manager-container">
      <div className="list-manager-header">
        <div className="l-header-left">
          <FiLayers />
          <span>{title}</span>
        </div>
        <button type="button" className="add-list-item-btn" onClick={handleAddItem}>
          <FiPlus /> {addButtonText}
        </button>
      </div>

      <div className="list-items-stack">
        {items.length === 0 ? (
          <div className="no-items-state">No entries added yet.</div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="list-item-row">
              <div className="item-index-badge">{index + 1}</div>
              <div className="item-fields-grid">
                {schema.map((field) => (
                  <div key={field.key} className="item-field">
                    <label>{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea 
                        value={item[field.key] || ''}
                        onChange={(e) => handleUpdateItem(index, field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows="2"
                      />
                    ) : (
                      <input 
                        type={field.type || 'text'}
                        value={item[field.key] || ''}
                        onChange={(e) => handleUpdateItem(index, field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                className="remove-item-btn" 
                onClick={() => handleRemoveItem(index)}
                title="Remove Item"
              >
                <FiTrash2 />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DisplayListManager
