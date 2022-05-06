const request = require("supertest")
const app = require("../app")
const {
  authorization: { user, password },
} = require("../settings.json")

describe("Retrieve data from /test/test.json", () => {
  test("should return 200 with JSON data", () =>
    request(app)
      .get("/test/test.json")
      .auth(user, password)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ value: 1 })
      }))

  describe("error cases", () => {
    test("should return 403 if bad password", () =>
      request(app)
        .get("/test/test.json")
        .auth(user, "bad password")
        .expect(403))

    test("should return 403 if bad user", () =>
      request(app).get("/test/test.json").auth("baduser", password).expect(403))

    test("should respond 403 for non existing directory", () =>
      request(app).get("/unknown/test.json").auth(user, password).expect(403))

    test("should respond 404 for not existing file", () =>
      request(app)
        .get("/test/notexisting.json")
        .auth(user, password)
        .expect(404))

    test("should respond 404 for empty key", () =>
      request(app).get("/test/.json").auth(user, password).expect(404))

    test("should respond 404 for empty app", () =>
      request(app).get("//a.json").auth(user, password).expect(404))

    test("should respond 400 if incorrect char in key", () =>
      request(app).get("/test/idée.json").auth(user, password).expect(400))

    test("should respond 400 if incorrect char in app", () =>
      request(app).get("/idée/test.json").auth(user, password).expect(400))
  })
})
