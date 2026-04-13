/**
 * Resolves an image source.
 * If the source is a full URL, it returns it as is.
 * If the source starts with '/', it assumes it's a local public asset.
 * If the source is a path and looks like it belongs to a Supabase bucket,
 * it can be expanded. For now, it just ensures absolute URLs are handled safely.
 * 
 * @param {string} src - The image source from the database.
 * @returns {string} - The resolved image URL.
 */
export const resolveImageUrl = (src) => {
  if (!src) return ''
  
  // If it's already an absolute URL, return it
  if (src.startsWith('http')) return src
  
  // If it's a relative path from the root, return it
  if (src.startsWith('/')) return src
  
  // If it's a relative path (not starting with /), assume it's in public/img
  // (Legacy support for old data format)
  return `/img/${src}`
}
