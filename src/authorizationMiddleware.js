const settings = require('./settings.json')
const { ForbiddenError, handleError } = require('./errors')

const encodedUserandPassword = Buffer.from(
  `${settings.authorization.user}:${settings.authorization.password}`,
  'utf-8'
).toString('base64')

const expectedAuthorizationString = `Basic ${encodedUserandPassword}`

console.log(`Expected authorization '${expectedAuthorizationString}'`)

const authorizationMiddleware = (req, res, next) => {
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
    handleError(res, err)
  }
}

module.exports = authorizationMiddleware
