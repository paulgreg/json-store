import type { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { BadRequestError, ForbiddenError } from './errors'
import { checkStr } from './string'

export const getFilePath = (req: Request, res: Response) => {
  const appId = req.params.appId
  const key = req.params.key

  if (!appId || !key || !checkStr(appId) || !checkStr(key)) {
    console.error('appId or key malformed', appId, key)
    throw new BadRequestError()
  }

  const dirPath = path.resolve(__dirname, '../data', appId)
  console.info(`looking for directory ${dirPath}`)

  const filePath = path.resolve(dirPath, `${key}.json`)
  console.info(`looking for file ${filePath}`)

  if (!fs.existsSync(dirPath)) {
    console.error('Requested appId nof found', appId)
    throw new ForbiddenError()
  }

  return filePath
}
