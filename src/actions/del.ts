import type { Request, Response } from 'express'
import fs from 'fs/promises'
import { getFilePath } from '../file'
import { BadRequestError, NotFoundError, handleError } from '../errors'

const removeBodyFromContent = (
  content: Array<unknown>,
  bodyAsArrayOrObject: unknown
) => {
  const body = Array.isArray(bodyAsArrayOrObject)
    ? bodyAsArrayOrObject
    : [bodyAsArrayOrObject]

  const bodyAsString = body.map((item) => JSON.stringify(item))
  return content.filter((item) => !bodyAsString.includes(JSON.stringify(item)))
}

const del = async (req: Request, res: Response) => {
  try {
    const filePath = getFilePath(req, res)

    const body = req.body || {}
    const bodyAsString = JSON.stringify(body)

    if (
      typeof body !== 'object' ||
      bodyAsString.length === 0 ||
      bodyAsString === '{}' ||
      bodyAsString === '[]'
    ) {
      console.error(`Bad content size : ${bodyAsString.length}`)
      throw new BadRequestError()
    }

    try {
      await fs.access(filePath, fs.constants.F_OK)
    } catch {
      console.error(`Empty file`)
      throw new NotFoundError()
    }

    const contentAsBuffer = await fs.readFile(filePath)
    const contentAsString = contentAsBuffer.toString()
    const content = JSON.parse(contentAsString)

    if (!Array.isArray(content)) {
      console.error(`Existing content is not an array`)
      throw new BadRequestError()
    }

    const dataToWrite = JSON.stringify(removeBodyFromContent(content, body))
    console.info(
      `Writing ${dataToWrite.length} bytes to existing file ${filePath}`
    )

    await fs.writeFile(filePath, dataToWrite)
    res.status(200).end()
  } catch (err) {
    handleError(res, err as Error)
  }
}

export default del
