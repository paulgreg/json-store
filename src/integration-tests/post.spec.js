const request = require("supertest")
const app = require("../app")

describe("POST", () => {
  describe("nominal case", () => {
    test("should respond 200 with empty file for test/post.json", () =>
      request(app)
        .get("/test/post.json")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({})
        }))

    test("should respond 200 for a simple test json file", () =>
      request(app)
        .post("/test/post.json")
        .send({ test: true })
        .set("Accept", "application/json")
        .expect(200))

    test("should respond 200 with content for test/post.json", () =>
      request(app)
        .get("/test/post.json")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({ test: true })
        }))
  })
  describe("error cases", () => {
    test("should respond 403 for non existing directory", () =>
      request(app)
        .post("/unknow/test.json")
        .send({ test: true })
        .set("Accept", "application/json")
        .expect(403))

    test("should respond 404 for empty key", () =>
      request(app)
        .post("/test/.json")
        .send({ test: true })
        .set("Accept", "application/json")
        .expect(404))

    test("should respond 404 for empty app", () =>
      request(app)
        .post("//a.json")
        .send({ test: true })
        .set("Accept", "application/json")
        .expect(404))

    test("should respond 400 if incorrect char in key", () =>
      request(app)
        .post("/test/idée.json")
        .send({ test: true })
        .set("Accept", "application/json")
        .expect(400))

    test("should respond 400 if incorrect char in app", () =>
      request(app)
        .post("/idée/test.json")
        .send({ test: true })
        .set("Accept", "application/json")
        .expect(400))
  })
})
