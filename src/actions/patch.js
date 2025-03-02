const fs = require('fs')
const { getFilePath } = require('../file')
const { BadRequestError, handleError } = require('../errors')
const jsonpatch = require('fast-json-patch')

const patch = (req, res) => {
  try {
    const filePath = getFilePath(req, res)

    const bodyAsString = JSON.stringify(req.body || {})

    if (bodyAsString.length === 0) {
      console.error(`Bad content size : ${bodyAsString.length}`)
      throw new BadRequestError()
    }

    if (!fs.existsSync(filePath)) {
      throw new NotFoundError()
    } else {
      fs.readFile(filePath, function (err, content) {
        if (err) throw err

        const existingJson = JSON.parse(content)
        const patch = JSON.parse(bodyAsString)

        const updatedDocument = jsonpatch.applyPatch(
          existingJson,
          patch
        ).newDocument

        fs.writeFile(filePath, JSON.stringify(updatedDocument), function (err) {
          if (err) throw err
          res.status(200).end()
        })
      })
    }

    console.info(`Writing ${bodyAsString.length} bytes to ${filePath}`)
  } catch (err) {
    handleError(res, err)
  }
}

module.exports = patch
