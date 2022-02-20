const fs = require("fs")
const express = require("express")
const cors = require("cors")
const settings = require("./settings.json")
const { getFilePath } = require("./file")
const { BadRequestError, NotFoundError, handleError } = require("./errors")
const { CONTENT_TYPE, CONTENT_TYPE_JSON } = require("./http")

const app = express()

const corsConfig = {
  origin: settings.origin || "http://localhost",
  methods: ["GET", "POST"],
}

app.disable("x-powered-by")
console.log(`Configuring CORS with ${JSON.stringify(corsConfig)}`)
app.use(cors(corsConfig))
console.log(`Limit body upload to ${settings.uploadLimit}`)
app.use(express.json({ limit: settings.uploadLimit }))

app.get("/:appId/:key.json", function (req, res) {
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
})

app.post("/:appId/:key.json", function (req, res) {
  try {
    const filePath = getFilePath(req, res)

    const body = req.body || ""

    if (body.length === 0) {
      console.error(`Bad content size : ${body.length}`)
      throw new BadRequestError()
    }
    console.info(`Writing ${body.length} bytes to ${filePath}`)

    fs.writeFile(filePath, JSON.stringify(body), function (err) {
      if (err) throw err
      res.status(200).end()
    })
  } catch (err) {
    handleError(res, err)
  }
})

module.exports = app
