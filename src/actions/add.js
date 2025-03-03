const fs = require('fs/promises')
const { getFilePath } = require('../file')
const { BadRequestError, handleError } = require('../errors')

const add = async (req, res) => {
  try {
    const filePath = getFilePath(req, res)

    const body = req.body || {}
    const bodyAsString = JSON.stringify(body)

    if (bodyAsString.length === 0 || bodyAsString === '{}') {
      console.error(`Bad content size : ${bodyAsString.length}`)
      throw new BadRequestError()
    }

    let content

    try {
      const contentAsBuffer = await fs.readFile(filePath)
      const contentAsString = contentAsBuffer.toString() || ''
      content = JSON.parse(contentAsString)
      if (!Array.isArray(content)) {
        console.error(`Existing content is not an array`)
        throw new BadRequestError()
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        content = []
      } else {
        throw err
      }
    }
    const dataToWrite = JSON.stringify(content.concat(body))

    console.info(
      `Writing ${dataToWrite.length} bytes to existing file ${filePath}`
    )
    await fs.writeFile(filePath, dataToWrite)
    res.status(200).end()
  } catch (err) {
    handleError(res, err)
  }
}
module.exports = add
