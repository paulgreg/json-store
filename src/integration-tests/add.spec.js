const request = require('supertest')
const app = require('../app')
const {
  authorization: { user, password },
} = require('../settings.json')

describe('Adding data via /test/add/add.json', () => {
  describe('nominal case', () => {
    test('should add item to a new array', () =>
      request(app)
        .post('/test/add/add.json')
        .set('Content-Type', 'application/json')
        .auth(user, password)
        .send({ item: 1 })
        .expect(200))

    test('should return added data', () =>
      request(app)
        .get('/test/add.json')
        .set('Accept', 'application/json')
        .auth(user, password)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([{ item: 1 }])
        }))

    test('should append data', () =>
      request(app)
        .post('/test/add/add.json')
        .set('Content-Type', 'application/json')
        .auth(user, password)
        .send([2])
        .expect(200))

    test('should return added data', () =>
      request(app)
        .get('/test/add.json')
        .set('Accept', 'application/json')
        .auth(user, password)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([{ item: 1 }, 2])
        }))

    test('should concat array', () =>
      request(app)
        .post('/test/add/add.json')
        .set('Content-Type', 'application/json')
        .auth(user, password)
        .send([{ item: 3 }, { item: 4 }])
        .expect(200))

    test('(GET) should respond 200 with content for test/add.json', () =>
      request(app)
        .get('/test/add.json')
        .set('Accept', 'application/json')
        .auth(user, password)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([
            { item: 1 },
            2,
            { item: 3 },
            { item: 4 },
          ])
        }))
  })

  describe('error cases', () => {
    test('should return 403 if bad password', () =>
      request(app)
        .post('/test/add/add.json')
        .set('Content-Type', 'application/json')
        .auth(user, 'bad password')
        .send({ item: 1 })
        .expect(403))

    test('should return 403 if bad user', () =>
      request(app)
        .post('/test/add/add.json')
        .set('Content-Type', 'application/json')
        .auth('bad user', password)
        .send({ item: 1 })
        .expect(403))

    test('should respond 400 if empty content', () =>
      request(app)
        .post('/test/add/add.json')
        .set('Content-Type', 'application/json')
        .auth(user, password)
        .send('')
        .expect(400))

    test('should respond 403 for non existing directory', () =>
      request(app)
        .post('/unknown/add/test.json')
        .set('Content-Type', 'application/json')
        .auth(user, password)
        .send({ test: true })
        .expect(403))

    test('should respond 404 for empty key', () =>
      request(app)
        .post('/test/add/.json')
        .set('Content-Type', 'application/json')
        .auth(user, password)
        .send({ test: true })
        .expect(404))

    test('should respond 400 if incorrect char in key', () =>
      request(app)
        .post('/test/add/idée.json')
        .set('Content-Type', 'application/json')
        .auth(user, password)
        .send({ test: true })
        .expect(400))

    test('should respond 400 if incorrect char in app', () =>
      request(app)
        .post('/idée/add/test.json')
        .set('Content-Type', 'application/json')
        .auth(user, password)
        .send({ test: true })
        .expect(400))
  })
})
