import {TrigoChecker} from "@/Checkers/Basic/TrigoChecker.ts"
import {describe, expect, test} from "vitest"

const chk = new TrigoChecker('p')
describe('radian with periodic', () => {
	chk.answer = "5pi/4+k3pi/2"
	test('with fractions', ()=>{
		const result = chk.checkValue('5pi/4+k3pi/2')
		expect(result.result).toBe(true)
	})

	test('pi+kpi', ()=>{
		const result = chk.checkValue('pi+kpi')

		expect(result.result).toBe(false)
		expect(result.message).toBe("La partie périodique n'est pas juste.")

		const result0 = chk.checkValue("pi+k3pi/2")
		expect(result0.result).toBe(false)
		expect(result0.message).toBe("L'angle n'est pas juste.")
	})

	test("angle modulo périodicité.", ()=>{
		const result = chk.checkValue("11pi/4+k3pi/2")
		expect(result.result).toBe(true)

		const result0 = chk.checkValue('-pi/4+k3pi/2')
		expect(result0.result).toBe(true)
	})
})
