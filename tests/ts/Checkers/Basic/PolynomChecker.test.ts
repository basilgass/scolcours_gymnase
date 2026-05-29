import {describe, expect, test} from "vitest"
import {checkPolynomIsFactorized, PolynomChecker} from "@/Checkers"

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

	test('polynome désordré', () => {
		const chk = new PolynomChecker('')
		chk.answer = 'xyz'

		console.log(chk.checkValue('xyz'))
		console.log(chk.checkValue('yzx'))
		console.log(chk.checkValue('zyx'))
	})
})
