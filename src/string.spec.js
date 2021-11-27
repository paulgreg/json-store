const { check } = require("./string")

describe("string", () => {
  describe("check", () => {
    ;["abc", "test", "test1", "12345678901234567890123456789012"].forEach(
      (str) =>
        test(`should return true for ${str}`, () =>
          expect(check(str)).toEqual(true))
    )
    ;[".", " ", "a-a", "a b", "a.b", "a..b", "a/b", "a\\b"].forEach((str) =>
      test(`should return false for ${str}`, () =>
        expect(check(str)).toEqual(false))
    )

    test("should return false if more than 32 chars", () =>
      expect(check("123456789012345678901234567890123")).toEqual(false))
  })
})
