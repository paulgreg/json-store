import { checkStr } from './string'

describe('string', () => {
  describe('checkStr', () => {
    ;[
      'abc',
      'test',
      'test1',
      'test-1',
      '12345678901234567890123456789012',
    ].forEach((str) =>
      test(`should return true for ${str}`, () =>
        expect(checkStr(str)).toEqual(true))
    )
    ;[
      '.',
      ' ',
      '-a',
      'a-',
      '-a-',
      'a_a',
      'a b',
      'a.b',
      'a..b',
      'a/b',
      'a\\b',
    ].forEach((str) =>
      test(`should return false for ${str}`, () =>
        expect(checkStr(str)).toEqual(false))
    )

    test('should return false if more than 32 chars', () =>
      expect(checkStr('123456789012345678901234567890123')).toEqual(false))
  })
})
