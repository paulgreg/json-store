const request = require("supertest")
const app = require("../app")

describe("GET", () => {
  describe("nominal case", () => {
    test("should respond 200 for a test json file", () =>
      request(app)
        .get("/test/test.json")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({ value: 1 })
        }))

    test("should respond 200 for not existing file", () =>
      request(app)
        .get("/test/notexisting.json")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({})
        }))
  })

  describe("error cases", () => {
    test("should respond 403 for non existing directory", () =>
      request(app).get("/unknow/test.json").expect(403))

    test("should respond 404 for empty key", () =>
      request(app).get("/test/.json").expect(404))

    test("should respond 404 for empty app", () =>
      request(app).get("//a.json").expect(404))

    test("should respond 400 if incorrect char in key", () =>
      request(app).get("/test/idée.json").expect(400))

    test("should respond 400 if incorrect char in app", () =>
      request(app).get("/idée/test.json").expect(400))
  })
})
