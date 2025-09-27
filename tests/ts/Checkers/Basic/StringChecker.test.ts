import {expect, test} from "vitest"
import {StringChecker} from "@/Checkers"

test('detect exact value', () => {
    const config = ''
    const expected = 'hello world'
    const given = 'hello world'
    const givenError = 'hello'

    const checker = new StringChecker(config)
    const check = checker.check(expected, given)
    const checkError = checker.check(expected, givenError)

    expect(check.result).toBeTruthy()
    expect(checkError.result).toBeFalsy()
})
