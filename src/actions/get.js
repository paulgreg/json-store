const fs = require('fs/promises')
const { getFilePath } = require('../file')
const { NotFoundError, handleError } = require('../errors')
const {
  CONTENT_TYPE,
  CONTENT_TYPE_JSON,
  CACHE_CONTROL,
  NO_CACHE,
} = require('../http')

const get = async (req, res) => {
  try {
    const filePath = getFilePath(req, res)

    try {
      await fs.access(filePath, fs.constants.F_OK)
    } catch {
      console.error(`Empty file`)
      throw new NotFoundError()
    }

    const stats = await fs.stat(filePath)
    const mtime = stats?.mtime
    const lastModified = new Date(mtime).toGMTString()
    res.setHeader('Last-Modified', lastModified)

    const ifModifiedSince = (
      req.headers['if-modified-since'] ?? ''
    ).toLowerCase()

    if (lastModified.toLowerCase() === ifModifiedSince) {
      res.status(304).end()
    } else {
      const content = await fs.readFile(filePath)
      res.setHeader(CONTENT_TYPE, CONTENT_TYPE_JSON)
      res.setHeader(CACHE_CONTROL, NO_CACHE)
      res.end(content)
    }
  } catch (err) {
    handleError(res, err)
  }
}

module.exports = get
