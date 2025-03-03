import type { Request, Response } from 'express'
import fs from 'fs/promises'
import { getFilePath } from '../file'
import { NotFoundError, handleError } from '../errors'
import {
  CONTENT_TYPE,
  CONTENT_TYPE_JSON,
  CACHE_CONTROL,
  NO_CACHE,
} from '../http'

const get = async (req: Request, res: Response) => {
  try {
    const filePath = getFilePath(req, res)

    try {
      await fs.access(filePath, fs.constants.F_OK)
    } catch {
      console.error(`Empty file`)
      throw new NotFoundError()
    }

    const stats = await fs.stat(filePath)
    const mtime = stats?.mtime
    const lastModified = new Date(mtime).toUTCString()
    res.setHeader('Last-Modified', lastModified)

    const ifModifiedSince = (
      req.headers['if-modified-since'] ?? ''
    ).toLowerCase()

    if (lastModified.toLowerCase() === ifModifiedSince) {
      res.status(304).end()
    } else {
      const content = await fs.readFile(filePath)
      res.setHeader(CONTENT_TYPE, CONTENT_TYPE_JSON)
      res.setHeader(CACHE_CONTROL, NO_CACHE)
      res.end(content)
    }
  } catch (err) {
    handleError(res, err as Error)
  }
}

export default get
