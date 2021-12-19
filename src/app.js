const path = require("path")
const fs = require("fs")
const express = require("express")
const cors = require("cors")
const app = express()

const { check } = require("./string")
const settings = require("./settings.json")

const CONTENT_TYPE = "Content-Type"
const CONTENT_TYPE_JSON = "application/json; charset=utf-8"

const corsConfig = {
  origin: settings.origin || "http://localhost",
  methods: ["GET", "POST"],
}
console.log(`Configuring CORS with ${JSON.stringify(corsConfig)}`)

app.disable("x-powered-by")
app.use(cors(corsConfig))
app.use(express.json({ limit: "1mb" }))

app.get("/:appId/:key.json", function (req, res) {
  const appId = req.params.appId
  const key = req.params.key

  if (!check(appId) || !check(key)) return res.status(400).send("Bad Request")

  const dirPath = path.resolve(__dirname, "../data", appId)
  console.info(`looking for directory ${dirPath}`)

  const filePath = path.resolve(dirPath, `${key}.json`)
  console.info(`looking for file ${filePath}`)

  try {
    if (!fs.existsSync(dirPath)) {
      res.status(403).send("Forbidden")
    } else if (!fs.existsSync(filePath)) {
      res.status(404).send("Not Found")
    } else {
      fs.readFile(filePath, function (err, content) {
        if (err) throw err
        res.setHeader(CONTENT_TYPE, CONTENT_TYPE_JSON)
        res.end(content)
      })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

app.post("/:appId/:key.json", function (req, res) {
  const appId = req.params.appId
  const key = req.params.key

  if (!check(appId) || !check(key)) return res.status(400).send("Bad Request")

  const dirPath = path.resolve(__dirname, "../data", appId)
  console.info(`looking for directory ${dirPath}`)

  try {
    if (!fs.existsSync(dirPath)) {
      res.status(403).send("Forbidden")
    } else {
      const filePath = path.resolve(__dirname, "../data", appId, `${key}.json`)
      console.info(`looking for file ${filePath}`)

      const body = req.body || ""

      if (body.length === 0) {
        console.error(`Bad content size : ${body.length}`)
        return res.status(400).send("Bad Request")
      }
      console.info(`Writing ${body.length} bytes to ${filePath}`)

      fs.writeFile(filePath, JSON.stringify(body), function (err) {
        if (err) throw err
        res.status(200).end()
      })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

module.exports = app
