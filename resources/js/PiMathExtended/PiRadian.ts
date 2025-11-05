import {Fraction, InputValue} from "pimath"

export type TRIGO_RATIO = "cos" | "sin" | "tan"

export class PiRadian {

	static exactDegrees = [
		0, 30, 45, 60,
		90, 120, 135, 150,
		180, 210, 225, 240,
		270, 300, 315, 330
	]
	#angle: Fraction = new Fraction(0)
	#periodic: Fraction = new Fraction(0)

	constructor(value?: string | Fraction | PiRadian) {
		if (value !== undefined) {
			if (typeof value === "string") {
				this.fromString(value)
			} else if (value instanceof Fraction) {
				this.fromFraction(value)
			} else if (value instanceof PiRadian) {
				this.#angle = value.angle.clone()
				this.#periodic = value.periodic.clone()
			}
		}
	}

	get angle(): Fraction {
		return this.#angle
	}

	set angle(value: Fraction) {
		this.#angle = value
	}

	get display(): string {
		const anglePart = this.#angle.isZero()
			? ''
			: this.#angleToDisplay(this.#angle)

		const periodicPart = this.#periodic.isZero()
			? ''
			: ('k' + this.#angleToDisplay(this.#periodic))

		const output = [anglePart, periodicPart]
			.filter(a => a !== '')
			.join('+')


		return output === '' ? '0' : output

	}

	get periodic(): Fraction {
		return this.#periodic
	}

	set periodic(value: Fraction) {
		this.#periodic = value
	}

	get tex(): string {
		const anglePart = this.#angle.isZero()
			? ''
			: this.#angleToTeX(this.#angle)

		const periodicPart = this.#periodic.isZero()
			? ''
			: ('k' + this.#angleToTeX(this.#periodic))

		const output = [anglePart, periodicPart]
			.filter(a => a !== '')
			.join('+')

		return output === '' ? '0' : output
	}

	/**
	 * Check if the given value is api/b or api/b+kcpi/d
	 * @param value
	 */
	static checkString(value: string): boolean {
		if (value === '0') {
			return true
		}

		const angleRegExp = /^(-?\d*pi\/\d+|-?\d*pi)$/

		if (value.includes('+')) {
			const [a, p, ...other] = value.split('+k')
			if (other && other.length > 0) {
				// There should not be a third argument
				return false
			}

			return angleRegExp.test(a) && angleRegExp.test(p)
		}

		// No periodic part or no angle !
		if (value.startsWith('k')) {
			return angleRegExp.test(value.substring(1))
		}

		return angleRegExp.test(value)

	}

	static fromRatio(ratio: TRIGO_RATIO, value: number): PiRadian[] {
		// value can be:
		// sin or cos: 0, +-0.5, +- 0.707, +-0.866, +-1
		// tan: 0, +-0.577, +-1, +-1.732
		const v = +value.toFixed(3)

		if (ratio === 'tan') {
			if (![0, 0.577, 1, 1.732, -0.577, -1, -1.732].includes(v)) {
				throw new Error('Can only get radians from "usual" ratio')
			}
		} else {
			if (![0, 0.5, 0.707, 0.866, 1, -0.5, -0.707, -0.866, -1].includes(v)) {
				throw new Error('Can only get radians from "usual" ratio')
			}
		}

		switch (ratio) {
			case "tan":
				return [tanRatioToRadian(v)]
			case "cos":
				return [...cosRatioToRadian(v)]
			case "sin":
				return [...sinRatioToRadian(v)]
		}

		return []
	}

	clone(): PiRadian {
		const R = new PiRadian()
		R.angle = this.#angle.clone()
		R.periodic = this.#periodic.clone()

		return R
	}

	divide(value: InputValue<Fraction>): this {
		const D = new Fraction(value)

		this.#angle.divide(D).reduce()
		this.#periodic.divide(D).abs().reduce()

		return this
	}

	fromDegree(value: InputValue<Fraction>): this {
		const F = new Fraction(value)

		this.#angle = F.divide(180).reduce()
		this.#periodic = new Fraction(0)
		return this
	}

	fromFraction(value: InputValue<Fraction>, periodic?: InputValue<Fraction>): this {
		this.#angle = new Fraction(value)
		this.#periodic = periodic === undefined ? new Fraction(0) : new Fraction(periodic)

		return this
	}

	fromString(value: string): this {
		if (!PiRadian.checkString(value)) {
			throw new Error(`${value} is not recognized as an angle in radians`)
		}

		if (value === "0") {
			this.#angle = new Fraction(0)
			this.#periodic = new Fraction(0)
			return this
		}

		if (value.startsWith('k')) {
			// Assume it's only the periodic part
			this.#angle = new Fraction(0)
			this.#periodic = new Fraction(this.#parseAngleInRadian(value.substring(1)))
			return this
		}

		const [angle, periodic] = value.split('+k')

		this.#angle = new Fraction(this.#parseAngleInRadian(angle))
		this.#periodic = periodic
			? new Fraction(this.#parseAngleInRadian(periodic))
			: new Fraction(0)

		return this
	}

	isEqual(value: PiRadian): boolean {
		return this.isSame(value) && this.#periodic.isEqual(value.periodic)
	}

	isPeriodic(): boolean {
		return this.#periodic.isZero()
	}

	isSame(value: PiRadian): boolean {
		// value has periodic => periodic must be the same.
		if (!value.periodic.isZero()) {
			if (!value.periodic.isEqual(this.#periodic)) {
				return false
			}
		}

		if (this.#periodic.isZero()) {
			// No periodic at all...
			return this.#angle.isEqual(value.angle)
		}


		// Periodic value are the same (or value has no periodic).
		const diff = value.angle.clone()
			.subtract(this.#angle)
			.divide(this.#periodic)

		return diff.isRelative()
	}

	multiply(value: InputValue<Fraction>): this {
		const D = new Fraction(value)

		this.#angle.multiply(D).reduce()
		this.#periodic.multiply(D).abs().reduce()

		return this
	}

	reduce(): this {
		if (this.#periodic.isZero()) {
			this.#angle.reduce()
			return this
		}

		this.#periodic.reduce()

		// Set the angle to the smallest positive value.
		if (this.#angle.isNegative()) {
			const k = Math.trunc(-this.#angle.value / this.#periodic.value) + 1
			this.#angle.add(this.#periodic.clone().multiply(k))
			return this
		}

		const k = Math.trunc(this.#angle.value / this.#periodic.value)
		if (k > 0) {
			this.#angle.subtract(this.#periodic.clone().multiply(k))
			return this
		}

		return this
	}

	toDegree(): Fraction {
		return this.#angle.clone().multiply(180).reduce()
	}

	toRatio(ratio: TRIGO_RATIO): { display: string, tex: string } {
		// we have the smallest positive value.

		if (ratio === 'tan') {
			return toRatioDisplay(+Math.tan(this.angle.value * Math.PI).toFixed(3))
		}

		if (ratio === 'cos') {
			return toRatioDisplay(+Math.cos(this.angle.value * Math.PI).toFixed(3))
		}

		if (ratio === 'sin') {
			return toRatioDisplay(+Math.sin(this.angle.value * Math.PI).toFixed(3))
		}


		return undefined
	}

	#angleToDisplay(rad: Fraction): string {
		const value =
			rad.numerator === 1 ? ''
				: rad.numerator === -1
					? '-'
					: Math.abs(rad.numerator)
		const num = `${value}pi`

		return rad.isRational() ? `${num}/${rad.denominator}` : num
	}

	#angleToTeX(rad: Fraction): string {
		const value =
			Math.abs(rad.numerator) === 1
				? ''
				: Math.abs(rad.numerator).toString()

		const sign = rad.numerator < 0 ? '-' : ''
		const num = `${value}\\pi`
		return rad.isRational()
			? `${sign}\\frac{ ${num} }{ ${rad.denominator} }`
			: `${sign}${num}`
	}

	#parseAngleInRadian(rad: string): Fraction {
		const [num, den] = rad.split('/')

		const F = new Fraction()

		F.numerator = num === 'pi'
			? 1
			: num === '-pi'
				? -1
				: +num.replace('pi', '')

		F.denominator = den === undefined ? 1 : +den

		return F
	}
}

function cosRatioToRadian(value: number): PiRadian[] {
	// sin or cos: 0, +-0.5, +- 0.707, +-0.866, +-1
	const R = new PiRadian()
	R.periodic = new Fraction(2)

	switch (value) {
		case 0:
			R.angle = new Fraction('1/2')
			break
		case 0.5:
		case -0.5:
			R.angle = new Fraction('1/3')
			break
		case 0.707:
		case -0.707:
			R.angle = new Fraction('1/4')
			break
		case 0.866:
		case -0.866:
			R.angle = new Fraction('1/6')
			break
		case 1:
		case -1:
			R.angle = new Fraction('0')
			break
	}

	if (value < 0) {
		R.angle = new Fraction(1).subtract(R.angle)
	}

	if (R.angle.isZero()) {
		return [R]
	}


	const R2 = new PiRadian()
	R2.periodic = new Fraction(2)
	R2.angle = R.angle.clone().opposite()
	return [R, R2]
}

function sinRatioToRadian(value: number): PiRadian[] {
// sin or cos: 0, +-0.5, +- 0.707, +-0.866, +-1
	const R = new PiRadian()
	R.periodic = new Fraction(2)

	switch (value) {
		case 0:
			R.angle = new Fraction('0')
			break
		case 0.5:
		case -0.5:
			R.angle = new Fraction('1/6')
			break
		case 0.707:
		case -0.707:
			R.angle = new Fraction('1/4')
			break
		case 0.866:
		case -0.866:
			R.angle = new Fraction('1/3')
			break
		case 1:
		case -1:
			R.angle = new Fraction('1/2')
			break
	}

	if (value < 0) {
		R.angle.opposite()
	}

	if (R.angle.display === '1/2') {
		return [R]
	}


	const R2 = new PiRadian()
	R2.periodic = new Fraction(2)
	R2.angle = new Fraction(1).subtract(R.angle)
	return [R, R2]
}

function tanRatioToRadian(value: number): PiRadian {
	// 0, 0.577, 1, 1.732, -0.577, -1, -1.732
	const R = new PiRadian()
	R.periodic = new Fraction(1)
	switch (value) {
		case 0:
			R.angle = new Fraction(0)
			break
		case 0.577:
		case -0.577:
			R.angle = new Fraction('1/6')
			break
		case 1:
		case -1:
			R.angle = new Fraction('1/4')
			break
		case 1.732:
		case -1.732:
			R.angle = new Fraction('1/3')
			break
	}

	if (value < 0) {
		R.angle.opposite()
	}

	return R
}

function toRatioDisplay(value: number): { display: string, tex: string } {
	const sign = value > 0 ? '' : '-'

	//  0, +-0.5, +- 0.707, +-0.866, +-1
	// 0, 0.577, 1, 1.732, -0.577, -1, -1.732
	//
	if (value === 0) {
		return {display: '0', tex: '0'}
	}

	const v = Math.abs(value)

	if (v === 0.5) {
		return {display: `${sign}1/2`, tex: `${sign}\\frac{ 1 }{ 2 }`}
	}
	if (v === 0.707) {
		return {display: `${sign}sqrt2/2`, tex: `${sign}\\frac{ \\sqrt{2} }{ 2 }`}
	}
	if (v === 0.866) {
		return {display: `${sign}sqrt3/2`, tex: `${sign}\\frac{ \\sqrt{3} }{ 2 }`}
	}
	if (v === 1) {
		return {display: `${sign}1`, tex: `${sign}1`}
	}

	if (v === 0.577) {
		return {display: `${sign}sqrt3/3`, tex: `${sign}\\frac{ \\sqrt{3} }{ 3 }`}
	}
	if (v === 1.732) {
		return {display: `${sign}sqrt3`, tex: `${sign}\\sqrt{3}`}
	}
}


