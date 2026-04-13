import React, { useState } from 'react'
import { FiUpload, FiX, FiImage, FiSettings } from 'react-icons/fi'
import { supabase } from '../../../lib/supabase'
import { resolveImageUrl } from '../../../lib/utils'

/**
 * Reusable Image Uploader for Display Management
 * Provides a hybrid interface for manual URL entry and direct file upload to Supabase Storage.
 */
const DisplayImageUploader = ({ 
  value, 
  onChange, 
  bucket = 'members images', 
  label = 'Media Asset',
  placeholder = 'URL or Upload...'
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      // 1. Generate unique file path
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const folder = bucket.includes('team') ? 'team' : 'portfolio'
      const filePath = `${folder}/${fileName}`

      // 2. Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 3. Construct Public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      // 4. Update Parent State
      onChange(publicUrl)
    } catch (err) {
      console.error('Storage system failure:', err)
      setError('Upload failed: ' + err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClear = () => {
    onChange('')
    setError(null)
  }

  return (
    <div className="display-image-uploader">
      <label>{label}</label>
      
      <div className="upload-workflow-container">
        <div className="hybrid-input-row">
          <div className="text-input-wrap">
            <FiSettings className="input-icon-left" />
            <input 
              type="text" 
              value={value || ''} 
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="u-path-input"
            />
          </div>
          
          <label className={`upload-action-trigger ${isUploading ? 'loading' : ''}`}>
            <FiUpload />
            <span>{isUploading ? 'Syncing...' : 'Upload'}</span>
            <input 
              type="file" 
              hidden 
              accept="image/*" 
              onChange={handleFileUpload} 
              disabled={isUploading} 
            />
          </label>
        </div>

        {error && <p className="uploader-error-note">{error}</p>}

        {value && (
          <div className="uploader-preview-frame">
            <div className="preview-media-box">
              <img src={resolveImageUrl(value)} alt="Media preview" />
            </div>
            <div className="preview-meta-info">
              <span className="file-origin-badge">Active Asset</span>
              <button 
                type="button" 
                className="clear-asset-btn" 
                onClick={handleClear}
                title="Remove Media"
              >
                <FiX />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DisplayImageUploader
