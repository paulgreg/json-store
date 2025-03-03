const fs = require('fs/promises')
const { getFilePath } = require('../file')
const { BadRequestError, handleError, NotFoundError } = require('../errors')
const jsonpatch = require('fast-json-patch')

const patch = async (req, res) => {
  try {
    const filePath = getFilePath(req, res)

    const bodyAsString = JSON.stringify(req.body || {})

    if (bodyAsString.length === 0) {
      console.error(`Bad content size : ${bodyAsString.length}`)
      throw new BadRequestError()
    }

    try {
      await fs.access(filePath, fs.constants.F_OK)
    } catch {
      console.error(`Empty file`)
      throw new NotFoundError()
    }
    const content = await fs.readFile(filePath)
    const existingJson = JSON.parse(content)
    const patch = JSON.parse(bodyAsString)

    const updatedDocument = jsonpatch.applyPatch(
      existingJson,
      patch
    ).newDocument

    console.info(`Writing ${bodyAsString.length} bytes to ${filePath}`)

    await fs.writeFile(filePath, JSON.stringify(updatedDocument))
    res.status(200).end()
  } catch (err) {
    handleError(res, err)
  }
}
module.exports = patch
