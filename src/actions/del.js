const fs = require('fs/promises')
const { getFilePath } = require('../file')
const { BadRequestError, NotFoundError, handleError } = require('../errors')

const removeBodyFromContent = (content, bodyAsArrayOrObject) => {
  const body = Array.isArray(bodyAsArrayOrObject)
    ? bodyAsArrayOrObject
    : [bodyAsArrayOrObject]

  const bodyAsString = body.map((item) => JSON.stringify(item))
  return content.filter((item) => !bodyAsString.includes(JSON.stringify(item)))
}
const del = async (req, res) => {
  try {
    const filePath = getFilePath(req, res)

    const body = req.body || {}
    const bodyAsString = JSON.stringify(body)

    if (
      typeof body !== 'object' ||
      bodyAsString.length === 0 ||
      bodyAsString === '{}' ||
      bodyAsString === '[]'
    ) {
      console.error(`Bad content size : ${bodyAsString.length}`)
      throw new BadRequestError()
    }

    try {
      await fs.access(filePath, fs.constants.F_OK)
    } catch {
      console.error(`Empty file`)
      throw new NotFoundError()
    }

    const contentAsBuffer = await fs.readFile(filePath)
    const contentAsString = contentAsBuffer.toString()
    const content = JSON.parse(contentAsString)

    if (!Array.isArray(content)) {
      console.error(`Existing content is not an array`)
      throw new BadRequestError()
    }

    const dataToWrite = JSON.stringify(removeBodyFromContent(content, body))
    console.info(
      `Writing ${dataToWrite.length} bytes to existing file ${filePath}`
    )

    await fs.writeFile(filePath, dataToWrite)
    res.status(200).end()
  } catch (err) {
    handleError(res, err)
  }
}
module.exports = del
