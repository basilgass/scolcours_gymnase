import {describe, expect, test} from "vitest"
import {PiRadian} from "@/PiMathExtended/PiRadian.ts"

describe('Trigo class', () => {
	test('check if a string is a radian angle', () => {
		expect(PiRadian.checkString('pi')).toBe(true)
		expect(PiRadian.checkString('2pi')).toBe(true)
		expect(PiRadian.checkString('23pi')).toBe(true)
		expect(PiRadian.checkString('pi/2')).toBe(true)
		expect(PiRadian.checkString('2pi/6')).toBe(true)
		expect(PiRadian.checkString('2pi/61')).toBe(true)

		expect(PiRadian.checkString('-pi')).toBe(true)
		expect(PiRadian.checkString('-2pi')).toBe(true)
		expect(PiRadian.checkString('-2pi/5')).toBe(true)
	})

	test('check if a string is a raidn angle with periodic part', () => {
		expect(PiRadian.checkString('pi+kpi')).toBe(true)
		expect(PiRadian.checkString('2pi/3+k3pi')).toBe(true)
		expect(PiRadian.checkString('2pi/3+k3pi/8')).toBe(true)
		expect(PiRadian.checkString('-2pi/3+k3pi/8')).toBe(true)
		expect(PiRadian.checkString('pi+kpi+5')).toBe(false)
	})

	test('check if a string is a radian, with a zero angle', () => {
		expect(PiRadian.checkString('kpi')).toBe(true)
		expect(PiRadian.checkString('kpi/2')).toBe(true)
		expect(PiRadian.checkString('k3pi/2')).toBe(true)
	})

	test('should construct a radian angle from a string', () => {
		const A = new PiRadian('2pi/3+kpi/5')

		expect(A.angle.display).toBe('2/3')
		expect(A.periodic.display).toBe('1/5')
	})

	test('should construct a radian angle from a string', () => {
		const A = new PiRadian('kpi/5')

		expect(A.angle.display).toBe('0')
		expect(A.periodic.display).toBe('1/5')
	})

	test('should construct a radian angle from a number of degree', () => {
		expect(new PiRadian().fromDegree(60).display).toBe('pi/3')
	})

	test('should get the degrees from an angle in radians', () => {
		expect(new PiRadian('2pi/3').toDegree().value).toBe(120)
	})

	test('should output in display mode', () => {
		const values = [
			'0',
			'pi',
			'-pi',
			'2pi',
			'pi/3',
			'-pi/3',
			'2pi/3',
			'pi+kpi/2',
			'2pi/5+k3pi/2',
		]

		values.forEach(value => {
			expect(new PiRadian(value).display).toBe(value)
		})
	})

	test('should output in TeX mode', () => {
		const values = [
			'0',
			'pi',
			'-pi',
			'2pi',
			'pi/3',
			'-pi/3',
			'2pi/3',
			'pi+kpi/2',
			'2pi/5+k3pi/2',
		]

		const TeX = [
			'0',
			'\\pi',
			'-\\pi',
			'2\\pi',
			'\\frac{ \\pi }{ 3 }',
			'-\\frac{ \\pi }{ 3 }',
			'\\frac{ 2\\pi }{ 3 }',
			'\\pi+k\\frac{ \\pi }{ 2 }',
			'\\frac{ 2\\pi }{ 5 }+k\\frac{ 3\\pi }{ 2 }'

		]

		values.forEach((value, index) => {
			expect(new PiRadian(value).tex).toBe(TeX[index])
		})
	})

	test('should compare two radians', () => {
		expect(
			new PiRadian('2pi/3')
				.isSame(
					new PiRadian('4pi/6'))
		).toBe(true)

		expect(
			new PiRadian('2pi/3+kpi/6')
				.isSame(
					new PiRadian('2pi/3'))
		).toBe(true)

		expect(
			new PiRadian('2pi/3')
				.isSame(
					new PiRadian('2pi/3'))
		).toBe(true)

		expect(
			new PiRadian('2pi/3+kpi/6')
				.isSame(
					new PiRadian('2pi/3+kpi/5'))
		).toBe(false)

		expect(
			new PiRadian('2pi/3+kpi/6')
				.isSame(
					new PiRadian('7pi/3'))
		).toBe(true)

		expect(
			new PiRadian('2pi/3+kpi/6')
				.isSame(
					new PiRadian('-pi/3'))
		).toBe(true)

		expect(
			new PiRadian('2pi/3+kpi/2')
				.isSame(
					new PiRadian('pi/6'))
		).toBe(true)
		expect(
			new PiRadian('2pi/3+kpi/2')
				.isSame(
					new PiRadian('5pi/6'))
		).toBe(false)
	})

	test('should get radians from tan', () => {
		const R0 = PiRadian.fromRatio('tan', 0)
		const R30 = PiRadian.fromRatio('tan', -Math.sqrt(3) / 3)
		const R60 = PiRadian.fromRatio('tan', Math.sqrt(3))

		expect(R0[0].display).toBe('kpi')
		expect(R30[0].display).toBe('-pi/6+kpi')
		expect(R60[0].display).toBe('pi/3+kpi')

	})

	test('should get radians from cos', () => {
		const R0 = PiRadian.fromRatio('cos', 1)
		const R30 = PiRadian.fromRatio('cos', Math.sqrt(3) / 2)
		const R45 = PiRadian.fromRatio('cos', Math.sqrt(2) / 2)
		const R60 = PiRadian.fromRatio('cos', -1 / 2)
		const R90 = PiRadian.fromRatio('cos', 0)

		expect(R0[0].display).toBe('k2pi')
		expect(R0[1]).toBe(undefined)
		expect(R30[0].display).toBe('pi/6+k2pi')
		expect(R30[1].display).toBe('-pi/6+k2pi')
		expect(R45[0].display).toBe('pi/4+k2pi')
		expect(R45[1].display).toBe('-pi/4+k2pi')
		expect(R60[0].display).toBe('2pi/3+k2pi')
		expect(R60[1].display).toBe('-2pi/3+k2pi')
		expect(R90[0].display).toBe('pi/2+k2pi')
		expect(R90[1].display).toBe('-pi/2+k2pi')

	})

	test('should get radians from sin', () => {
		const R0 = PiRadian.fromRatio('sin', 0)
		const R30 = PiRadian.fromRatio('sin', 1 / 2)
		const R45 = PiRadian.fromRatio('sin', Math.sqrt(2) / 2)
		const R60 = PiRadian.fromRatio('sin', -Math.sqrt(3) / 2) // -pi/3 and 4pi/3
		const R90 = PiRadian.fromRatio('sin', 1)

		expect(R0[0].display).toBe('k2pi')
		expect(R0[1].display).toBe('pi+k2pi')
		expect(R30[0].display).toBe('pi/6+k2pi')
		expect(R30[1].display).toBe('5pi/6+k2pi')
		expect(R45[0].display).toBe('pi/4+k2pi')
		expect(R45[1].display).toBe('3pi/4+k2pi')
		expect(R60[0].display).toBe('-pi/3+k2pi')
		expect(R60[1].display).toBe('4pi/3+k2pi')
		expect(R90[0].display).toBe('pi/2+k2pi')
		expect(R90[1]).toBe(undefined)

	})

	test('should reduce a radian to the smalles positive angle', () => {
		expect(new PiRadian('7pi+k3pi').reduce().display).toBe('pi+k3pi')
		expect(new PiRadian('7pi/3+k3pi/5').reduce().display).toBe('8pi/15+k3pi/5')
		expect(new PiRadian('-7pi/3+k3pi/5').reduce().display).toBe('pi/15+k3pi/5')
	})

	test('should get the ratio of any angle', () => {
		expect(new PiRadian('2pi/3').toRatio('sin').display).toBe('sqrt3/2')
		expect(new PiRadian('-2pi/3').toRatio('sin').display).toBe('-sqrt3/2')

		expect(new PiRadian('2pi/3').toRatio('cos').display).toBe('-1/2')
		expect(new PiRadian('-2pi/3').toRatio('cos').display).toBe('-1/2')

		expect(new PiRadian('2pi/3').toRatio('tan').display).toBe('-sqrt3')
		expect(new PiRadian('-2pi/3').toRatio('tan').display).toBe('sqrt3')

	})
})
