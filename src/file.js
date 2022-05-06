const fs = require("fs")
const path = require("path")
const { BadRequestError, ForbiddenError } = require("./errors")
const { checkStr } = require("./string")

const getFilePath = (req, res) => {
  const appId = req.params.appId
  const key = req.params.key

  if (!checkStr(appId) || !checkStr(key)) {
    console.error("appId or key malformed", appId, key)
    throw new BadRequestError()
  }

  const dirPath = path.resolve(__dirname, "../data", appId)
  console.info(`looking for directory ${dirPath}`)

  const filePath = path.resolve(dirPath, `${key}.json`)
  console.info(`looking for file ${filePath}`)

  if (!fs.existsSync(dirPath)) {
    console.error("Requested appId nof found", appId)
    throw new ForbiddenError()
  }

  return filePath
}

module.exports = { getFilePath }
