const request = require('supertest')
const app = require('../app')
const {
  authorization: { user, password },
} = require('../settings.json')

const timestamp = Date.now()

describe('Posting data to /test/post.json', () => {
  describe('nominal case', () => {
    test('should accept empty string', () =>
      request(app)
        .post('/test/post.json')
        .set('Content-Type', 'application/json')
        .auth(user, password)
        .send('')
        .expect(200))

    test('should return empty content', () =>
      request(app)
        .get('/test/post.json')
        .set('Accept', 'application/json')
        .auth(user, password)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({})
        }))

    test('should accept empty data', () =>
      request(app)
        .post('/test/post.json')
        .set('Content-Type', 'application/json')
        .auth(user, password)
        .send({})
        .expect(200))

    test('should return empty content', () =>
      request(app)
        .get('/test/post.json')
        .set('Accept', 'application/json')
        .auth(user, password)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({})
        }))

    test('should write data', () =>
      request(app)
        .post('/test/post.json')
        .send({ timestamp })
        .set('Content-Type', 'application/json')
        .auth(user, password)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({})
        }))

    test('should return written data', () =>
      request(app)
        .get('/test/post.json')
        .set('Accept', 'application/json')
        .auth(user, password)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({ timestamp })
        }))

    test('should always return empty JSON', () =>
      request(app)
        .post('/test/post.json')
        .send({ test: true })
        .set('Content-Type', 'application/json')
        .auth(user, password)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({})
        }))

    describe('error cases', () => {
      test('should return 403 if bad password', () =>
        request(app)
          .post('/test/post.json')
          .send({ timestamp })
          .set('Content-Type', 'application/json')
          .auth(user, 'bad password')
          .expect(403))

      test('should return 403 if bad user', () =>
        request(app)
          .post('/test/post.json')
          .send({ timestamp })
          .set('Content-Type', 'application/json')
          .auth('bad user', password)
          .expect(403))

      test('should respond 403 for non json object', () =>
        request(app)
          .post('/test/post.json')
          .send('non json object')
          .set('Content-Type', 'application/json')
          .auth(user, password)
          .expect(400))

      test('should respond 403 for non existing directory', () =>
        request(app)
          .post('/unknown/test.json')
          .send({ test: true })
          .set('Content-Type', 'application/json')
          .auth(user, password)
          .expect(403))

      test('should respond 404 for empty key', () =>
        request(app)
          .post('/test/.json')
          .send({ test: true })
          .set('Content-Type', 'application/json')
          .auth(user, password)
          .expect(404))

      test('should respond 404 for empty app', () =>
        request(app)
          .post('//a.json')
          .send({ test: true })
          .set('Content-Type', 'application/json')
          .auth(user, password)
          .expect(404))

      test('should respond 400 if incorrect char in key', () =>
        request(app)
          .post('/test/idée.json')
          .send({ test: true })
          .set('Content-Type', 'application/json')
          .auth(user, password)
          .expect(400))

      test('should respond 400 if incorrect char in app', () =>
        request(app)
          .post('/idée/test.json')
          .send({ test: true })
          .set('Content-Type', 'application/json')
          .auth(user, password)
          .expect(400))
    })
  })
})
