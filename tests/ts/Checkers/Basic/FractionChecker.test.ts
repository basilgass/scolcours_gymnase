import {expect, test} from "vitest"
import {FractionChecker} from "@/Checkers"

test('detect exact value', () => {
	const config = ''
	const expected = '2/3'
	const given = '2/3'

	const checker = new FractionChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeTruthy()
})

test('similar fraction, not reduced', () => {
	const config = ''
	const expected = '2/3'
	const given = '4/6'

	const checker = new FractionChecker(config)
	const result = checker.check(given, expected)

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

test('dénominateur zéro', () => {
	const checker = new FractionChecker('')
	const result = checker.check('2/0', '1/2')

	expect(result.result).toBe(false)
	expect(result.message).toBe("Le dénominateur ne peut pas être zéro.")
})

test('entier accepté comme fraction', () => {
	const checker = new FractionChecker('')
	const result = checker.check('2', '2/1')

	expect(result.result).toBe(true)
})

test('dénominateur 1 — message de simplification', () => {
	const checker = new FractionChecker('')
	const result = checker.check('3/1', '3')

	expect(result.result).toBe(false)
	expect(result.score).toBe(0.9)
	expect(result.message).toBe("Une fraction avec `1` au dénominateur peut être simplifiée.")
})

test('alternatives || acceptées', () => {
	const checker = new FractionChecker('')

	const result = checker.check('1/2', '1/2||2/4')
	expect(result.result).toBe(true)

	const resultFail = checker.check('1/3', '1/2||2/4')
	expect(resultFail.result).toBe(false)
})
