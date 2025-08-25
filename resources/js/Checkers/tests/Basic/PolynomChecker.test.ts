import {describe, expect, test} from "vitest"
import {checkPolynomIsFactorized} from "@/Checkers"

describe("PolynomChecker", ()=>{
	test("contrôle qu'un polynome du premier degré est entièrement factorisé", ()=>{
		const value = "x-1"
		const result = checkPolynomIsFactorized(value)

		expect(result).toBe(true)
	})
	test("contrôle qu'un polynome du premier degré n'est pas entièrement factorisé", ()=>{
		const value = "2x-4"
		const result = checkPolynomIsFactorized(value)

		expect(result).toBe(false)
	})
	test('contrôle que le polynome est entièrement factorisé', ()=>{
		const value = "(x-3)(x+5)^2"
		const result = checkPolynomIsFactorized(value)

		expect(result).toBe(true)
	})

	test("contrôle que le polynome (2ème degré, sans parenthèse) n'est pas entièrement factorisé", ()=>{
		const value = "x^2-1"
		const result = checkPolynomIsFactorized(value)

		expect(result).toBe(false)
	})
})
