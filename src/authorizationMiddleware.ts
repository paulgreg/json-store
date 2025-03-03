import type { Request, Response, NextFunction } from 'express'
import { ForbiddenError, handleError } from './errors'

const encodedUserandPassword = Buffer.from(
  `${process.env.AUTH_USER}:${process.env.AUTH_PASSWORD}`,
  'utf-8'
).toString('base64')

const expectedAuthorizationString = `Basic ${encodedUserandPassword}`

console.log(`Expected authorization '${expectedAuthorizationString}'`)

const authorizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.method !== 'OPTIONS') {
      const authorization = req.headers.authorization
      if (!authorization || expectedAuthorizationString !== authorization) {
        console.error('Bad authorization from', req.ip)
        throw new ForbiddenError()
      }
    }
    next()
  } catch (err) {
    handleError(res, err as Error)
  }
}

export default authorizationMiddleware
