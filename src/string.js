const MAX = 32

module.exports = (str = "") =>
  str
    .replace(/[^0-9A-Za-z]/g, "")
    .replace(/[\.\\/]+/g, "")
    .substring(0, 32)
