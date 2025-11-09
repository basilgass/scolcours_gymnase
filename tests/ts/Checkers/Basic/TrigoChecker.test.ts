import {TrigoChecker} from "@/Checkers/Basic/TrigoChecker.ts"
import {describe, expect, test} from "vitest"

const chk = new TrigoChecker('p')
describe('radian with periodic', () => {
	chk.answer = "5pi/4+k3pi/2"
	test('with fractions', () => {
		const result = chk.checkValue('5pi/4+k3pi/2')
		expect(result.result).toBe(true)
	})

	test('pi+kpi', () => {
		const result = chk.checkValue('pi+kpi')

		expect(result.result).toBe(false)
		expect(result.message).toBe("La partie périodique n'est pas juste.")

		const result0 = chk.checkValue("pi+k3pi/2")
		expect(result0.result).toBe(false)
		expect(result0.message).toBe("L'angle n'est pas juste.")
	})

	test('k2pi', () => {
		const chk = new TrigoChecker('p')
		chk.answer = 'k2pi'
		const result = chk.checkValue('k2pi')
		expect(result.result).toBe(true)
	})

	test("angle modulo périodicité.", () => {
		const result = chk.checkValue("11pi/4+k3pi/2")
		expect(result.result).toBe(true)

		const result0 = chk.checkValue('-pi/4+k3pi/2')
		expect(result0.result).toBe(true)
	})
})


describe('degree with periodic', () => {
	test('basic', () => {
		const chk = new TrigoChecker('p,d,@check:nb,2')

		chk.answer = '1.23+k4.56'

		const r0 = chk.checkValue('1.23+k4.56')
		expect(r0.result).toBe(true)

		const r1 = chk.checkValue('1.23+k4.57')
		expect(r1.result).toBe(false)
		expect(r1.message).toContain("La partie périodique n'est pas juste",)
		expect(r1.message).toContain('Peut être un problème d\'arrondi ?')
	})
})

describe('single tests', () => {
	test('exercice équation trigonométrique élémentaire du premier degré (i) => 1', () => {
		const trigoChk = new TrigoChecker('checker:trigo,p')

		const chk1 = trigoChk.check('-5pi/6+k2pi/3', 'pi/2+k2pi/3')
		const chk2 = trigoChk.check('pi/2+k2pi/3', 'pi/2+k2pi/3')

		expect(chk1.result).toBe(true)
		expect(chk2.result).toBe(true)
	})
})
