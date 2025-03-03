import request from 'supertest'
import app from '../app'

describe('Retrieve data from /test/test.json', () => {
  test('should return 200 with JSON data', () =>
    request(app)
      .get('/test/test.json')
      .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect('Cache-Control', 'no-cache')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ value: 1 })
      }))

  describe('error cases', () => {
    test('should return 403 if bad password', () =>
      request(app)
        .get('/test/test.json')
        .auth(process.env.AUTH_USER, 'bad password')
        .expect(403))

    test('should return 403 if bad user', () =>
      request(app)
        .get('/test/test.json')
        .auth('baduser', process.env.AUTH_PASSWORD)
        .expect(403))

    test('should respond 403 for non existing directory', () =>
      request(app)
        .get('/unknown/test.json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(403))

    test('should respond 404 for not existing file', () =>
      request(app)
        .get('/test/notexisting.json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(404))

    test('should respond 404 for empty key', () =>
      request(app)
        .get('/test/.json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(404))

    test('should respond 404 for empty app', () =>
      request(app)
        .get('//a.json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(404))

    test('should respond 400 if incorrect char in key', () =>
      request(app)
        .get('/test/idée.json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(400))

    test('should respond 400 if incorrect char in app', () =>
      request(app)
        .get('/idée/test.json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(400))
  })
})
