import request from 'supertest'
import app from '../app'

describe('Delete data from /test/del/del.json', () => {
  describe('nominal case', () => {
    test('should add initial data to test/del.json', () =>
      request(app)
        .post('/test/del.json')
        .set('Content-Type', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .send([
          { item: 1 },
          2,
          { item: 4 },
          { item: 4, value: true },
          { item: 5 },
        ])
        .expect(200))

    test('should return added data', () =>
      request(app)
        .get('/test/del.json')
        .set('Accept', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([
            { item: 1 },
            2,
            { item: 4 },
            { item: 4, value: true },
            { item: 5 },
          ])
        }))

    test('should remove { item: 1 }', () =>
      request(app)
        .post('/test/del/del.json')
        .set('Content-Type', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .send({ item: 1 })
        .expect(200))

    test('should return data without data removed', () =>
      request(app)
        .get('/test/del.json')
        .set('Accept', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([
            2,
            { item: 4 },
            { item: 4, value: true },
            { item: 5 },
          ])
        }))

    test('should remove { item: 4, value: true }', () =>
      request(app)
        .post('/test/del/del.json')
        .set('Content-Type', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .send({ item: 4, value: true })
        .expect(200))

    test('should return data without data removed', () =>
      request(app)
        .get('/test/del.json')
        .set('Accept', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([2, { item: 4 }, { item: 5 }])
        }))

    test('should remove 2', () =>
      request(app)
        .post('/test/del/del.json')
        .set('Content-Type', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .send([2])
        .expect(200))

    test('should return data without data removed', () =>
      request(app)
        .get('/test/del.json')
        .set('Accept', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([{ item: 4 }, { item: 5 }])
        }))

    test('should remove [{ item: 4 }, { item: 5 }]', () =>
      request(app)
        .post('/test/del/del.json')
        .set('Content-Type', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .send([{ item: 4 }, { item: 5 }])
        .expect(200))

    test('should return empty array', () =>
      request(app)
        .get('/test/del.json')
        .set('Accept', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([])
        }))

    test('should respond 200 for not found data: { notFound: true }', () =>
      request(app)
        .post('/test/del/del.json')
        .set('Content-Type', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .send({ notFound: true })
        .expect(200))

    test('should return empty array', () =>
      request(app)
        .get('/test/del.json')
        .set('Accept', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([])
        }))
  })
  describe('error cases', () => {
    test('should return 403 if bad password', () =>
      request(app)
        .post('/test/del/del.json')
        .set('Content-Type', 'application/json')
        .auth(process.env.AUTH_USER, 'bad password')
        .send({ item: 1 })
        .expect(403))

    test('should return 403 if bad user', () =>
      request(app)
        .post('/test/del/del.json')
        .set('Content-Type', 'application/json')
        .auth('bad user', process.env.AUTH_PASSWORD)
        .send({ item: 1 })
        .expect(403))

    test('should respond 400 if empty content', () =>
      request(app)
        .post('/test/del/del.json')
        .send('')
        .set('Accept', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(400))

    test('should respond 400 if empty object', () =>
      request(app)
        .post('/test/del/del.json')
        .send({})
        .set('Content-Type', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(400))

    test('should respond 400 if empty array', () =>
      request(app)
        .post('/test/del/del.json')
        .send([])
        .set('Content-Type', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(400))

    test('should respond 403 for non existing directory', () =>
      request(app)
        .post('/unknown/del/del.json')
        .send({ test: true })
        .set('Accept', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(403))

    test('should respond 404 for not existing file', () =>
      request(app)
        .post('/test/del/unknown.json')
        .send({ test: true })
        .set('Accept', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(404))

    test('should respond 404 for empty key', () =>
      request(app)
        .post('/test/del/.json')
        .send({ test: true })
        .set('Accept', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(404))

    test('should respond 400 if incorrect char in key', () =>
      request(app)
        .post('/test/del/idée.json')
        .send({ test: true })
        .set('Accept', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(400))

    test('should respond 400 if incorrect char in app', () =>
      request(app)
        .post('/idée/del/test.json')
        .send({ test: true })
        .set('Accept', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(400))
  })
})
