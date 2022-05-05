const fs = require("fs")
const { getFilePath } = require("../file")
const { BadRequestError, handleError } = require("../errors")

const add = (req, res) => {
  try {
    const filePath = getFilePath(req, res)

    const body = req.body || {}
    const bodyAsString = JSON.stringify(body)

    if (bodyAsString.length === 0 || bodyAsString === "{}") {
      console.error(`Bad content size : ${bodyAsString.length}`)
      throw new BadRequestError()
    }

    if (!fs.existsSync(filePath)) {
      const dataToWrite = JSON.stringify([].concat(body))
      console.info(
        `Writing ${dataToWrite.length} bytes to new file ${filePath}`
      )
      fs.writeFile(filePath, dataToWrite, function (err) {
        if (err) throw err
        res.status(200).end()
      })
    } else {
      fs.readFile(filePath, function (err, contentAsBuffer) {
        if (err) throw err

        const contentAsString = contentAsBuffer.toString() || ""
        const content = JSON.parse(contentAsString)

        if (!Array.isArray(content)) {
          console.error(`Existing content is not an array`)
          throw new BadRequestError()
        }

        const dataToWrite = JSON.stringify(content.concat(body))
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

module.exports = add
