const MAX = 32

export const checkStr = (str = '') => {
  if (str !== str.replace(/[^0-9A-Za-z\-]/g, '')) return false
  if (str.startsWith('-') || str.endsWith('-')) return false
  return str.length <= MAX
}
