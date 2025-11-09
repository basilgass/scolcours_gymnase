import {expect, test} from "vitest"
import {FractionChecker} from "@/Checkers"

test('detect exact value', () => {
	const config = ''
	const expected = '2/3'
	const given = '2/3'

	const checker = new FractionChecker(config)
	const result = checker.check(expected, given)

	expect(result.result).toBeTruthy()
})

test('similar fraction, not reduced', () => {
	const config = ''
	const expected = '2/3'
	const given = '4/6'

	const checker = new FractionChecker(config)
	const result = checker.check(expected, given)

	expect(result.result).toBeTruthy()
})

test('similar fraction, reduced', () => {
	const config = 'r'
	const expected = '2/3'
	const given = '4/6'

	const checker = new FractionChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeFalsy()
	expect(result.message).toEqual('La fraction n\'est pas réduite.')
})

test('wrong formatted fraction', () => {
	const config = 'r'
	const expected = '-2/3'
	const given = '2/-3'

	const checker = new FractionChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeFalsy()
	expect(result.message).toEqual('Le dénominateur doit être positif.')
})
