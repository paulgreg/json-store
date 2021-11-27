const MAX = 32

const check = (str = "") => {
  if (str !== str.replace(/[^0-9A-Za-z]/g, "")) return false
  if (str.length > 32) return false
  return true
}

module.exports = { check }
