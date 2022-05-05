const fs = require("fs")
const { getFilePath } = require("../file")
const { BadRequestError, handleError } = require("../errors")

const post = (req, res) => {
  try {
    const filePath = getFilePath(req, res)

    const bodyAsString = JSON.stringify(req.body || {})

    if (bodyAsString.length === 0) {
      console.error(`Bad content size : ${bodyAsString.length}`)
      throw new BadRequestError()
    }

    console.info(`Writing ${bodyAsString.length} bytes to ${filePath}`)

    fs.writeFile(filePath, bodyAsString, function (err) {
      if (err) throw err
      res.status(200).end()
    })
  } catch (err) {
    handleError(res, err)
  }
}

module.exports = post
