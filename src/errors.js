class BadRequestError extends Error {}

class ForbiddenError extends Error {}

class NotFoundError extends Error {}

const handleError = (res, err) => {
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

module.exports = {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  handleError,
}
