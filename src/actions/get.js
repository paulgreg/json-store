const fs = require("fs")
const { getFilePath } = require("../file")
const { NotFoundError, handleError } = require("../errors")
const { CONTENT_TYPE, CONTENT_TYPE_JSON } = require("../http")

const get = (req, res) => {
  try {
    const filePath = getFilePath(req, res)

    if (!fs.existsSync(filePath)) {
      throw new NotFoundError()
    } else {
      fs.readFile(filePath, function (err, content) {
        if (err) throw err
        res.setHeader(CONTENT_TYPE, CONTENT_TYPE_JSON)
        res.end(content)
      })
    }
  } catch (err) {
    handleError(res, err)
  }
}

module.exports = get
