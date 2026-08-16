import {describe, expect, test} from "vitest"
import {checkPolynomIsFactorized, PolynomChecker} from "@/Checkers"

describe("PolynomChecker — checkValue et format", () => {
	test('getter format : factorisé / entièrement factorisé / développé', () => {
		expect(new PolynomChecker('f').format).toBe("polynôme factorisé")
		expect(new PolynomChecker('F').format).toBe("polynôme entièrement factorisé")
		expect(new PolynomChecker('d').format).toBe("polynôme développé")
	})

	test('polynôme différent signalé', () => {
		const checker = new PolynomChecker('')
		const result = checker.check('x+1', 'x+2')

		expect(result.result).toBe(false)
		expect(result.message).toBe("le polynôme n'est pas le même.")
	})

	test('équivalent mais ordre différent accepté', () => {
		const checker = new PolynomChecker('')
		// même polynôme, écriture différente -> pas de court-circuit exact, checkValue OK
		const result = checker.check('1+2x+x^2', 'x^2+2x+1')

		expect(result.result).toBe(true)
	})

	test('config développé : forme factorisée refusée', () => {
		const checker = new PolynomChecker('d')
		const result = checker.check('(x+1)(x+1)', 'x^2+2x+1')

		expect(result.result).toBe(false)
		expect(result.message).toBe("le polynôme n'est pas (entièrement) développé.")
	})

	test('config factorisé : forme factorisée acceptée', () => {
		const checker = new PolynomChecker('f')
		const result = checker.check('(x-1)(x+1)', 'x^2-1')

		expect(result.result).toBe(true)
	})

	test('config factorisé : forme développée refusée', () => {
		const checker = new PolynomChecker('f')
		const result = checker.check('x^2-1', '(x-1)(x+1)')

		expect(result.result).toBe(false)
		expect(result.message).toBe("le polynôme n'est pas (entièrement) factorisé.")
	})

	test('config sommet : forme du sommet acceptée', () => {
		const checker = new PolynomChecker('s')
		// (x-1)^2+3 == x^2-2x+4
		const result = checker.check('(x-1)^2+3', 'x^2-2x+4')

		expect(result.result).toBe(true)
	})

	test('config sommet : forme développée refusée', () => {
		const checker = new PolynomChecker('s')
		const result = checker.check('x^2-2x+4', '(x-1)^2+3')

		expect(result.result).toBe(false)
		expect(result.message).toBe("le polynôme n'est pas dans le bon format.")
	})
})

describe("PolynomChecker", () => {
	test("contrôle qu'un polynome du premier degré est entièrement factorisé", () => {
		const value = "x-1"
		const result = checkPolynomIsFactorized(value, true)

		expect(result).toBe(true)
	})
	test("contrôle qu'un polynome du premier degré n'est pas entièrement factorisé", () => {
		const value = "2x-4"
		const result = checkPolynomIsFactorized(value, true)

		expect(result).toBe(false)
	})
	test('contrôle que le polynome est entièrement factorisé', () => {
		const value = "(x-3)(x+5)^2"
		const result = checkPolynomIsFactorized(value, true)

		expect(result).toBe(true)
	})

	test("contrôle que le polynome (2ème degré, sans parenthèse) n'est pas entièrement factorisé", () => {
		const value = "x^2-1"
		const result = checkPolynomIsFactorized(value, true)

		expect(result).toBe(false)
	})

	test("contrôle que le polynome est factorisé", () => {
		const value = "(2x+4)(x-3)"
		const result = checkPolynomIsFactorized(value, false)

		expect(result).toBe(true)
	})

	test("contrôle que le polynome est factorisé (1-x)", () => {
		const value = "(x+3)(1-x)"
		const result = checkPolynomIsFactorized(value, false)

		expect(result).toBe(true)
	})

	test("contrôle que le polynome est factorisé", () => {
		const value = "5(3-x)(x+1)(x+7)^2"
		const result = checkPolynomIsFactorized(value, false)

		expect(result).toBe(true)
	})

	test('polynome désordonné', () => {
		const chk = new PolynomChecker('')
		chk.answer = 'xyz'
	})

	test('polynôme entièrement factorisé', () => {
		const chk = new PolynomChecker('F')
		chk.answer = '-15/4(x-1)(x+1)'
		expect(chk.checkValue('-15/4(x+1)(x-1)').result).toBe(true)
	})
})
