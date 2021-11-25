const clean = require("./string")

describe("string", () => {
  test("remove .", () => expect(clean("a.b")).toEqual("ab"))

  test("remove ..", () => expect(clean("a..b")).toEqual("ab"))

  test("remove /", () => expect(clean("a/b")).toEqual("ab"))

  test("remove \\", () => expect(clean("a\\b")).toEqual("ab"))

  test("remove special char", () => expect(clean("1áé? $-2")).toEqual("12"))

  test("convert ./a/../b/./c", () =>
    expect(clean("./a/../b/./c")).toEqual("abc"))

  test("convert ./../etc/password", () =>
    expect(clean("./../etc/password")).toEqual("etcpassword"))

  test("truncate to 32 chars", () =>
    expect(clean("1234567890123456789012345678901234567890")).toEqual(
      "12345678901234567890123456789012"
    ))
})
