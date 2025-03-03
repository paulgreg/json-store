import type { Request, Response } from 'express'
import fs from 'fs/promises'
import { getFilePath } from '../file'
import { BadRequestError, FsError, handleError } from '../errors'

const add = async (req: Request, res: Response) => {
  try {
    const filePath = getFilePath(req, res)

    const body = req.body || {}
    const bodyAsString = JSON.stringify(body)

    if (bodyAsString.length === 0 || bodyAsString === '{}') {
      console.error(`Bad content size : ${bodyAsString.length}`)
      throw new BadRequestError()
    }

    let content

    try {
      const contentAsBuffer = await fs.readFile(filePath)
      const contentAsString = contentAsBuffer.toString() || ''
      content = JSON.parse(contentAsString)
      if (!Array.isArray(content)) {
        console.error(`Existing content is not an array`)
        throw new BadRequestError()
      }
    } catch (err) {
      if ((err as FsError).code === 'ENOENT') {
        content = []
      } else {
        throw err
      }
    }
    const dataToWrite = JSON.stringify(content.concat(body))

    console.info(
      `Writing ${dataToWrite.length} bytes to existing file ${filePath}`
    )
    await fs.writeFile(filePath, dataToWrite)
    res.status(200).end()
  } catch (err) {
    handleError(res, err as Error)
  }
}

export default add
