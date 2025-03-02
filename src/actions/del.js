const fs = require('fs')
const { getFilePath } = require('../file')
const { BadRequestError, NotFoundError, handleError } = require('../errors')

const removeBodyFromContent = (content, bodyAsArrayOrObject) => {
  const body = Array.isArray(bodyAsArrayOrObject)
    ? bodyAsArrayOrObject
    : [bodyAsArrayOrObject]

  const bodyAsString = body.map((item) => JSON.stringify(item))
  return content.filter((item) => !bodyAsString.includes(JSON.stringify(item)))
}

const del = (req, res) => {
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

    if (!fs.existsSync(filePath)) {
      console.error(`Empty file`)
      throw new NotFoundError()
    } else {
      fs.readFile(filePath, function (err, contentAsBuffer) {
        if (err) throw err

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

        fs.writeFile(filePath, dataToWrite, function (err) {
          if (err) throw err
          res.status(200).end()
        })
      })
    }
  } catch (err) {
    handleError(res, err)
  }
}

module.exports = del
