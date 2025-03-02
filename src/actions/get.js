const fs = require('fs')
const { getFilePath } = require('../file')
const { NotFoundError, handleError } = require('../errors')
const {
  CONTENT_TYPE,
  CONTENT_TYPE_JSON,
  CACHE_CONTROL,
  NO_CACHE,
} = require('../http')

const get = (req, res) => {
  try {
    const filePath = getFilePath(req, res)

    if (!fs.existsSync(filePath)) {
      throw new NotFoundError()
    } else {
      fs.stat(filePath, (err, stats) => {
        if (err) throw err
        const mtime = stats?.mtime
        const lastModified = new Date(mtime).toGMTString()
        res.setHeader('Last-Modified', lastModified)
        const ifModifiedSince = (
          req.headers['if-modified-since'] ?? ''
        ).toLowerCase()
        if (lastModified.toLowerCase() === ifModifiedSince) {
          res.status(304).end()
        } else {
          fs.readFile(filePath, function (err, content) {
            if (err) throw err
            res.setHeader(CONTENT_TYPE, CONTENT_TYPE_JSON)
            res.setHeader(CACHE_CONTROL, NO_CACHE)
            res.end(content)
          })
        }
      })
    }
  } catch (err) {
    handleError(res, err)
  }
}

module.exports = get
