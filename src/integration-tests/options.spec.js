const request = require("supertest")
const app = require("../app")

describe("OPTIONS", () => {
  test("should respond to pre-flight request", () =>
    request(app)
      .options("/test/test.json")
      .expect("Access-Control-Allow-Methods", "GET,POST")
      .expect(
        "Access-Control-Allow-Headers",
        "Authorization,Content-Type,Accept"
      )
      .expect(204))
})
