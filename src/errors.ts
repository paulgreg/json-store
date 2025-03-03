import type { Response } from 'express'

export class FsError extends Error {
  code?: string
}

export class BadRequestError extends Error {}

export class ForbiddenError extends Error {}

export class NotFoundError extends Error {}

export const handleError = (
  res: Response,
  err: BadRequestError | ForbiddenError | NotFoundError | Error
) => {
  if (err instanceof NotFoundError) {
    console.warn(err)
    res.status(404).send('Not Found')
  } else if (err instanceof BadRequestError) {
    console.error(err)
    res.status(400).send('Bad Request')
  } else if (err instanceof ForbiddenError) {
    console.error(err)
    res.status(403).send('Forbidden')
  } else {
    console.error(err)
    res.status(500).send('Server error')
  }
}
