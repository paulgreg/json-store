import request from 'supertest'
import app from '../app'

describe('Patching data to /test/patch.json', () => {
  describe('nominal case', () => {
    test('should add initial data to test/patch.json', () =>
      request(app)
        .post('/test/patch.json')
        .set('Content-Type', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .send([{ item: 1 }, { item: 2 }])
        .expect(200))

    test('should return added data', () =>
      request(app)
        .get('/test/patch.json')
        .set('Accept', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([{ item: 1 }, { item: 2 }])
        }))

    test('should apply patch on /test/patch.json', () =>
      request(app)
        .patch('/test/patch.json')
        .set('Content-Type', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .send([{ op: 'replace', path: '/0/item', value: 'patch' }])
        .expect(200))

    test('should return patched data', () =>
      request(app)
        .get('/test/patch.json')
        .set('Accept', 'application/json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([{ item: 'patch' }, { item: 2 }])
        }))
  })

  describe('error cases', () => {
    test('should return 403 if bad password', () =>
      request(app)
        .patch('/test/test.json')
        .auth(process.env.AUTH_USER, 'bad password')
        .expect(403))

    test('should return 403 if bad user', () =>
      request(app)
        .patch('/test/test.json')
        .auth('baduser', process.env.AUTH_PASSWORD)
        .expect(403))

    test('should respond 403 for non existing directory', () =>
      request(app)
        .patch('/unknown/test.json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(403))

    test('should respond 404 for not existing file', () =>
      request(app)
        .patch('/test/notexisting.json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(404))

    test('should respond 404 for empty key', () =>
      request(app)
        .patch('/test/.json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(404))

    test('should respond 404 for empty app', () =>
      request(app)
        .patch('//a.json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(404))

    test('should respond 400 if incorrect char in key', () =>
      request(app)
        .patch('/test/idée.json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(400))

    test('should respond 400 if incorrect char in app', () =>
      request(app)
        .patch('/idée/test.json')
        .auth(process.env.AUTH_USER, process.env.AUTH_PASSWORD)
        .expect(400))
  })
})
