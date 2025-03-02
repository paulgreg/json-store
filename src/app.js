const settings = require('./settings.json')

const express = require('express')
const cors = require('cors')
const authorizationMiddleware = require('./authorizationMiddleware')

const get = require('./actions/get')
const post = require('./actions/post')
const patch = require('./actions/patch')
const add = require('./actions/add')
const del = require('./actions/del')

const app = express()

const corsConfig = {
  origin: settings.origin || 'http://localhost',
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
}

app.disable('x-powered-by')

app.use(authorizationMiddleware)

console.log(`Configuring CORS with ${JSON.stringify(corsConfig)}`)
app.use(cors(corsConfig))

console.log(`Limit body upload to ${settings.uploadLimit}`)
app.use(express.json({ strict: true, limit: settings.uploadLimit }))

app.get('/:appId/:key.json', get)

app.post('/:appId/:key.json', post)

app.patch('/:appId/:key.json', patch)

app.post('/:appId/add/:key.json', add)

app.post('/:appId/del/:key.json', del)

module.exports = app
