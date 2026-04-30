import {describe, expect, test} from "vitest"
import {RationalChecker} from "@/Checkers"
import {Fraction, Polynom} from "pimath"
import {splitIfOutsideParentheses} from "@/Checkers/checkerHelperFunctions.ts"

function getFactorsFromPolynom(value: string, isNumerator = true) {
	const matches = value
		.match(/\(([^)]+)\)(?:\^(-?[0-9]+|\(-?[0-9]+(?:\/[0-9]+)?\)))?/g) ?? []

	let monoms = value + ''
	matches.forEach((factor) => {
		monoms = monoms.replaceAll(factor, ',')
	})


	// reformat the output
	const factors = [...monoms.split(','), ...matches]
		.filter(x => x !== '')

	return factors.map(factor => {
		let [f, p] = factor.split('^')

		if (!f.startsWith('(')) {
			// 7x^2, 3x, ...
			return {
				factor: new Polynom(factor),
				pow: new Fraction(isNumerator ? 1 : -1)
			}
		}

		// remove the parentheses
		f = f.slice(1, -1)

		// strip parentheses from rational powers like (4/3) or (-3/7)
		const powStr = p === undefined ? '1' : p.replace(/[()]/g, '')
		const pow = new Fraction(powStr)

		if (!isNumerator) pow.opposite()

		return {
			factor: new Polynom(f),
			pow
		}
	})
}

function getFactorsWithPow(value: string) {
	const [num, den] = splitIfOutsideParentheses(value, '/')

	if (den === undefined) return getFactorsFromPolynom(num, true)

	return [
		...getFactorsFromPolynom(num, true),
		...getFactorsFromPolynom(den, false)
	]
}

describe("rational checker", () => {
	const chk = new RationalChecker(['f'])

	test('Simple check', () => {
		chk.answer = '(3(3x-5)^4(2x+25))/(x+4)^4'
		const given = '3(3x-5)^4(2x+25)/(x+4)^4'

		console.log(chk.checkValue(given))
	})

	test('get factors', () => {
		const given = '3(3x-5)^4(2x+25)2x/7x^2(x+4)^4'
		console.log(getFactorsWithPow(given)
			.map(x => {
				return {
					f: x.factor.display, p: x.pow.display
				}
			})
		)
	})

	test('get factors with rational power', () => {
			const given = '3(3x-5)^(4/3)(2x+25)2x/7x^2(x+4)^4'
			console.log(getFactorsWithPow(given)
				.map(x => {
					return {
						f: x.factor.display, p: x.pow.display
					}
				}))
		}
	)

	test('get factors with rational power not factorized', () => {
			const given = '3(3x-5)^(4/3)(2x+25)2x/7x^2(x+4)^4'
			// check if it has only factors.
			const isFactors = splitIfOutsideParentheses(given, '+').filter(x => x !== '').length === 1 &&
				splitIfOutsideParentheses(given, '-').filter(x => x !== '').length === 1 &&
				splitIfOutsideParentheses(given, '/').length <= 2

			console.log(isFactors)
		}
	)

	test('compare rational fraction with opposite polynom', () => {
		chk.answer = '(-3(3x-5)^4(2x-25))/(x+4)^4'
		const given = '3(3x-5)^4(-2x+25)/(x+4)^4'

		const result = chk.checkValue(given)

		expect(result.score).toBe(1)
	})

	test('compare rational fraction with partial factorisation (number factor)', () => {
		chk.answer = '(6(3x-5)^4(x+20))/(x+4)^4'
		const given = '3(3x-5)^4(2x+40)/(x+4)^4'

		const result = chk.checkValue(given)

		expect(result.score).toBe(0.9)
	})

	test('compare rational fraction with partial factorisation (monom factor)', () => {
		chk.answer = '(6x(3x-5)^4(x+20))/(x+4)^4'
		const given = '3(3x-5)^4(2x^2+40x)/(x+4)^4'

		const result = chk.checkValue(given)
		expect(result.score).toBe(0.5)
	})
})
