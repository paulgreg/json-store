import request from 'supertest'
import app from '../app'

describe('OPTIONS', () => {
  test('should respond to pre-flight request', () =>
    request(app)
      .options('/test/test.json')
      .expect('Access-Control-Allow-Methods', 'GET,POST,PATCH')
      .expect(
        'Access-Control-Allow-Headers',
        'Authorization,Content-Type,Accept'
      )
      .expect(204))
})
