import type { Request, Response } from 'express'
import fs from 'fs/promises'
import { getFilePath } from '../file'
import { BadRequestError, handleError } from '../errors'

const post = async (req: Request, res: Response) => {
  try {
    const filePath = getFilePath(req, res)

    const bodyAsString = JSON.stringify(req.body || {})

    if (bodyAsString.length === 0) {
      console.error(`Bad content size : ${bodyAsString.length}`)
      throw new BadRequestError()
    }

    console.info(`Writing ${bodyAsString.length} bytes to ${filePath}`)

    await fs.writeFile(filePath, bodyAsString)
    res.status(200).end()
  } catch (err) {
    handleError(res, err as Error)
  }
}

export default post
