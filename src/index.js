const path = require("path")
const fs = require("fs")
const express = require("express")
const app = express()
const helmet = require("helmet")
const cors = require("cors")

const clean = require("./string")
const settings = require("./settings.json")

const port = 3000

const CONTENT_TYPE = "Content-Type"
const CONTENT_TYPE_JSON = "application/json; charset=utf-8"

app.use(helmet())
app.use(cors({ origin: settings.origin || "http://localhost/" }))
app.use(express.json())

app.get("/store/:appId/:key", function (req, res) {
  const appId = clean(req.params.appId)
  const key = clean(req.params.key)

  if (!appId || !key) return res.status(400).send("Bad Request")

  const filePath = path.resolve(__dirname, "../data", appId, `${key}.json`)
  console.log(`looking for file ${filePath}`)

  try {
    if (!fs.existsSync(filePath)) {
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

app.post("/store/:appId/:key", function (req, res) {
  const appId = clean(req.params.appId)
  const key = clean(req.params.key)

  if (!appId || !key) return res.status(400).send("Bad Request")

  const dirPath = path.resolve(__dirname, "../data", appId)
  console.log(`looking for directory ${dirPath}`)

  try {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dir)

    const filePath = path.resolve(__dirname, "../data", appId, `${key}.json`)
    console.log(`looking for file ${filePath}`)

    const body = req.body || ""
    if (body.length === 0) throw new Error("empty content")
    console.log(`Writing ${body.length} bytes to ${filePath}`)

    fs.writeFile(filePath, JSON.stringify(body), function (err) {
      if (err) throw err
      res.status(200).end()
    })
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

app.listen(process.env.PORT || port, () => {
  console.log(`listening at http://localhost:${port}`)
})
