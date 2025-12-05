import {expect, test} from "vitest"
import {ScientificChecker} from "@/Checkers"

test('detect exact value', () => {
	const config = '3'
	const expected = '1.234*10^-2'
	const given = '1.234*10^-2'

	const checker = new ScientificChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeTruthy()
})

test('wrong 10th power', () => {
	const config = '3'
	const expected = '1.234*10^-2'
	const given = '1.234*10^2'

	const checker = new ScientificChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeFalsy()
	expect(result.message).toEqual("l'ordre de grandeur n'est pas juste...")

})

test('near answer detection', () => {
	const config = '3'
	const expected = '1.234*10^-2'
	const given = '1.233*10^-2'

	const checker = new ScientificChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeFalsy()
	expect(result.message).toContain('erreur dans la partie significative: ')
})

test('10th exponential is missing', () => {
	const config = '3'
	const expected = '1.234*10^-2'
	const given = '1.234'

	const checker = new ScientificChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeFalsy()
	expect(result.message).toEqual("le format de réponse n'est pas une notation scientifique.")
})

test('value is less than one, but more than 10', () => {
	const config = '3'
	const expected = '1.234*10^-2'

	const checker = new ScientificChecker(config)

	const unitsValue = ['10', '2', '0', '-1', '-2', '-10']
	const unitsResult = [false, true, false, true, true, false]

	for (let i = 0; i < unitsValue.length; i++) {
		const given = `${unitsValue[i]}.234*10^-2`
		const result = checker.check(given, expected)

		expect(result.result).toBeFalsy()

		if (!unitsResult[i]) {
			expect(result.message).toEqual("la partie significative n'est pas entre 1 et 10 (non compris)")
		} else {
			expect(result.message).not.toEqual("la partie significative n'est pas entre 1 et 10 (non compris)")
		}
	}
})
