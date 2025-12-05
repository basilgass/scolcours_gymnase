import {expect, test} from "vitest"
import {InputChecker} from "@/Checkers"

test('detect exact value', () => {
	const config = ''
	const expected = 'hello world'
	const given = 'hello world'
	const givenError = 'hello'

	const checker = new InputChecker(config)
	const check = checker.check(given, expected)
	const checkError = checker.check(givenError, expected)

	expect(check.result).toBeTruthy()
	expect(checkError.result).toBeFalsy()
})
