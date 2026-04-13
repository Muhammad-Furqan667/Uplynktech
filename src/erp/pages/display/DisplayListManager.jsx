import React, { useState } from 'react'
import { FiPlus, FiTrash2, FiLayers, FiSearch, FiImage } from 'react-icons/fi'
import { FI_ICON_NAMES, resolveIcon } from '../../../lib/icons'

/**
 * IconInput Sub-component
 * Special handler for searchable icons and custom URLs
 */
const IconInput = ({ value, onChange, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const filteredIcons = FI_ICON_NAMES.filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 48)

  const IconPreview = resolveIcon(value)

  return (
    <div className="icon-picker-suite">
      <div className="icon-main-controls">
        <div className="icon-preview-container">
          <IconPreview />
        </div>
        <div className="icon-input-stack">
          <div className="icon-value-input">
            <input 
              type="text" 
              value={value || ''} 
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || 'FiName or URL...'}
            />
          </div>
          <div className="icon-search-searchable">
            <FiSearch className="search-hint-icon" />
            <input 
              type="text" 
              placeholder="Search Fi Icons..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className="icon-results-flyout">
                {filteredIcons.map(name => (
                  <div 
                    key={name} 
                    className="icon-result-item" 
                    onClick={() => { onChange(name); setSearchTerm('') }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

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
                    ) : field.type === 'icon' ? (
                      <IconInput 
                        value={item[field.key] || ''}
                        onChange={(val) => handleUpdateItem(index, field.key, val)}
                        placeholder={field.placeholder}
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
