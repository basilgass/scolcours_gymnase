import {describe, expect, test} from "vitest"
import {RationalChecker} from "@/Checkers/Basic/RationalChecker"
import {Fraction, Polynom} from "pimath"
import {splitIfOutsideParentheses} from "@/Checkers/checkerHelperFunctions.ts"

describe("RationalChecker — checkValue", () => {
	test('marqueur d\'erreur !! signalé', () => {
		const checker = new RationalChecker('')
		const result = checker.check('!!', 'x/(x+1)')

		expect(result.result).toBe(false)
		expect(result.message).toBe("Il semble qu'il y ait une erreur quelque part...")
	})

	test('getter format : entièrement factorisée réduite', () => {
		expect(new RationalChecker('F,r').format).toContain("entièrement factorisée")
		expect(new RationalChecker('F,r').format).toContain("réduite")
		expect(new RationalChecker('d').format).toContain("développée")
	})

	test('numérateur incorrect signalé', () => {
		const checker = new RationalChecker('')
		const result = checker.check('x/(x+1)', '(x+2)/(x+1)')

		expect(result.result).toBe(false)
		expect(result.message).toBe("le numérateur ne correspond pas à la réponse")
	})

	test('dénominateur incorrect signalé', () => {
		const checker = new RationalChecker('')
		const result = checker.check('x/(x+1)', 'x/(x+2)')

		expect(result.result).toBe(false)
		expect(result.message).toBe("le dénominateur ne correspond pas à la réponse")
	})

	test('config développée : numérateur factorisé refusé', () => {
		const checker = new RationalChecker('d')
		const result = checker.check('(x+1)(x+1)/(x-1)', '(x^2+2x+1)/(x-1)')

		expect(result.result).toBe(false)
		expect(result.message).toBe("le numérateur n'est pas développé")
	})

	test('config réduite : fraction non réduite refusée', () => {
		const checker = new RationalChecker('r')
		const result = checker.check('(x+1)(x-1)/(x-1)', 'x+1')

		expect(result.result).toBe(false)
		expect(result.message).toBe("la fraction rationnelle n'est pas réduite !")
	})
})

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

	// Notation BINAIRE (checkPolynomIsFactorized, référence partagée avec PolynomChecker).
	// L'ancien crédit partiel (0.9/0.5 via _checkFactorisation) a été retiré : le
	// résultat est désormais accepté ou refusé, sans score intermédiaire.

	test('facteur numérique non sorti : accepté en mode f (non strict)', () => {
		// `2x+40` n'a pas le 2 mis en évidence. En mode `f`, un facteur commun
		// NUMÉRIQUE est toléré (il serait refusé en mode `F` strict) → réponse acceptée.
		chk.answer = '(6(3x-5)^4(x+20))/(x+4)^4'
		const given = '3(3x-5)^4(2x+40)/(x+4)^4'

		const result = chk.checkValue(given)

		expect(result.result).toBe(true)
		expect(result.score).toBe(1)
	})

	test('facteur monomial non sorti : refusé (numérateur pas factorisé)', () => {
		// `2x^2+40x` = 2x(x+20) écrit développé : réellement pas factorisé (le facteur
		// commun est un monôme, pas un nombre) → réponse refusée.
		chk.answer = '(6x(3x-5)^4(x+20))/(x+4)^4'
		const given = '3(3x-5)^4(2x^2+40x)/(x+4)^4'

		const result = chk.checkValue(given)

		expect(result.result).toBe(false)
		expect(result.message).toContain("n'est pas factorisé")
	})

	test('check if factorized', () => {
		const chk_f = new RationalChecker('f')
		chk_f.answer = '6(x+3)(x-5)/(x+2)^2'

		const given = '(6x+18)(x-5)/(x+2)^2'
		const result_f = chk_f.checkValue(given)
		expect(result_f.score).toBe(1)

		const given_d = '(6x+18)(x-5)/x^2+4x+4'
		const result_d = chk_f.checkValue(given_d)
		expect(result_d.score).toBe(0)

		const chk_F = new RationalChecker('F')
		chk_F.answer = chk_f.answer
		const result_F = chk_F.checkValue(given)
		expect(result_F.score).toBe(0)

		const given_err = '6x(x+3)-30(x+3)/(x+2)^2'
		const result_err = chk_f.checkValue(given_err)
		expect(result_err.score).toBe(0)
	})
})
