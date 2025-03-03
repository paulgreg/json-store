import express from 'express'
import cors from 'cors'
import authorizationMiddleware from './authorizationMiddleware'

import get from './actions/get'
import post from './actions/post'
import patch from './actions/patch'
import add from './actions/add'
import del from './actions/del'

const app = express()

const corsConfig = {
  origin: (process.env.ORIGIN || 'http://localhost').split(','),
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
}

const uploadLimit = process.env.UPLOAD_LIMIT ?? '1mb'

app.disable('x-powered-by')

app.use(authorizationMiddleware)

console.log(`Configuring CORS with ${JSON.stringify(corsConfig)}`)
app.use(cors(corsConfig))

console.log(`Limit body upload to ${uploadLimit}`)

app.use(express.json({ strict: true, limit: uploadLimit }))

app.get('/:appId/:key.json', get)

app.post('/:appId/:key.json', post)

app.patch('/:appId/:key.json', patch)

app.post('/:appId/add/:key.json', add)

app.post('/:appId/del/:key.json', del)

export default app
