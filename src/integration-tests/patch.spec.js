const request = require('supertest')
const app = require('../app')
const {
  authorization: { user, password },
} = require('../settings.json')

const timestamp = Date.now()

describe('Patching data to /test/patch.json', () => {
  describe('nominal case', () => {})
  test('should add initial data to test/patch.json', () =>
    request(app)
      .post('/test/patch.json')
      .set('Content-Type', 'application/json')
      .auth(user, password)
      .send([{ item: 1 }, { item: 2 }])
      .expect(200))

  test('should return added data', () =>
    request(app)
      .get('/test/patch.json')
      .set('Accept', 'application/json')
      .auth(user, password)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([{ item: 1 }, { item: 2 }])
      }))

  test('should apply patch on /test/patch.json', () =>
    request(app)
      .patch('/test/patch.json')
      .set('Content-Type', 'application/json')
      .auth(user, password)
      .send([{ op: 'replace', path: '/0/item', value: 'patch' }])
      .expect(200))

  test('should return patched data', () =>
    request(app)
      .get('/test/patch.json')
      .set('Accept', 'application/json')
      .auth(user, password)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([{ item: 'patch' }, { item: 2 }])
      }))
})
