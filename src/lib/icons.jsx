import * as Icons from 'react-icons/fi'

/**
 * ACADEMY_TRACKS
 * Defines the mapping between track names, marketing slugs, and icons.
 */
export const ACADEMY_TRACKS = {
  'AI-ML': {
    slug: 'deep',
    icon: 'FiCpu',
    color: '#7c3aed',
    displayName: 'AI & Machine Learning'
  },
  'Graphic-Design': {
    slug: 'digital',
    icon: 'FiPenTool',
    color: '#ec4899',
    displayName: 'Creative Design'
  },
  'Web-development': {
    slug: 'advanced',
    icon: 'FiGlobe',
    color: '#0ea5e9',
    displayName: 'Web Engineering'
  }
}

/**
 * Resolves a string icon name to a React Icon component.
 * Supports both React Icons (e.g., 'FiTerminal') and external image URLs/paths.
 * @param {string} iconName - The name of the icon or a URL.
 * @returns {React.ComponentType} - The icon component or a default fallback.
 */
export const resolveIcon = (iconName) => {
  if (!iconName) return Icons.FiHelpCircle

  // If it looks like a URL or a relative path, return a dynamic image component
  if (typeof iconName === 'string' && (iconName.startsWith('http') || iconName.startsWith('/') || iconName.startsWith('blob:'))) {
    return (props) => (
      <img 
        src={iconName} 
        alt="icon" 
        {...props} 
        style={{ 
          width: '1em', 
          height: '1em', 
          objectFit: 'contain',
          verticalAlign: 'middle',
          ...props.style 
        }} 
      />
    )
  }

  const Icon = Icons[iconName]
  return Icon || Icons.FiHelpCircle
}
