const path = require("path")
const fs = require("fs")
const express = require("express")
const app = express()
const cors = require("cors")

const clean = require("./string")
const settings = require("./settings.json")

const port = process.env.PORT || settings.port || 3000

const CONTENT_TYPE = "Content-Type"
const CONTENT_TYPE_JSON = "application/json; charset=utf-8"

const corsConfig = {
  origin: settings.origin || "http://localhost/",
  methods: ["GET"],
}
console.log(`Configuring CORS with ${JSON.stringify(corsConfig)}`)

app.disable("x-powered-by")
app.use(cors(corsConfig))
app.use(express.json())

app.get("/:appId/:key.json", function (req, res) {
  const appId = clean(req.params.appId)
  const key = clean(req.params.key)

  if (!appId || !key) return res.status(400).send("Bad Request")

  const dirPath = path.resolve(__dirname, "../data", appId)
  console.log(`looking for directory ${dirPath}`)

  const filePath = path.resolve(dirPath, `${key}.json`)
  console.log(`looking for file ${filePath}`)

  try {
    if (!fs.existsSync(dirPath)) {
      res.status(403).send("Forbidden")
    } else if (!fs.existsSync(filePath)) {
      res.setHeader(CONTENT_TYPE, CONTENT_TYPE_JSON)
      res.end("{}")
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
  const appId = clean(req.params.appId)
  const key = clean(req.params.key)

  if (!appId || !key) return res.status(400).send("Bad Request")

  const dirPath = path.resolve(__dirname, "../data", appId)
  console.log(`looking for directory ${dirPath}`)

  try {
    if (!fs.existsSync(dirPath)) {
      res.status(403).send("Forbidden")
    } else {
      const filePath = path.resolve(__dirname, "../data", appId, `${key}.json`)
      console.log(`looking for file ${filePath}`)

      const body = req.body || ""
      if (body.length === 0) throw new Error("empty content")
      console.log(`Writing ${body.length} bytes to ${filePath}`)

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

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
