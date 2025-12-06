import {Equation, Polynom} from "pimath"
import {splitIfOutsideParentheses} from "@/Checkers/checkerHelperFunctions.ts"

export function isPolynom(value: string): false | Polynom {
	// TODO : Maybe find a better way to check if a value is a polynom.
	try {
		return new Polynom(value)
	} catch {
		return false
	}
}

export function isFraction(value: string): boolean {
	const [n, d, ...x] = value.split('/')

	if (x.length > 0) return false

	if (isNaN(+n)) return false

	if (d !== undefined && isNaN(+d)) return false

	return true
}

/**
 * Determine if a polynom string is in the form a(x-s1)^2+s2
 * @param value
 * Doit être au format
 * a(x+b)^2+c
 * (x+b)^2+c
 * x^2+c
 * (x+b)^2
 */
export function isPolynomPeak(value: string): boolean {
	return !!(value.match(/^(-?[\d]+(\/\d+)?)?\(x([+-](\d+(\/\d+)?)?)?\)\^2([+-]\d+(\/\d+)?)?$/,) ||
		value.match(/^(-?[\d]+(\/\d+)?)?x\^2([+-]\d+(\/\d+)?)?$/))
}

export function isEquationPeak(value: string): boolean {
	const [a, b] = value.split('=')

	if (a === 'y') return isPolynomPeak(b)

	if (b === 'y') return isPolynomPeak(a)

	return false
}

export const sortPartsByVariable = ((s1, s2) => {
	const s1HasX = s1.includes('x')
	const s2HasX = s2.includes('x')
	if (s1HasX && !s2HasX) return -1
	if (!s1HasX && s2HasX) return 1
	return 0
})

export function isEquationReduced(value: string): boolean {
	const equ = new Equation(value)
	equ.moveLeft()
	return equ.left.commonMonom().coefficient.value === 1
}

export function isEquationCircle(value: string): boolean {
	const [a, b] = value.split("=")

	const aF = isFraction(a)
	const bF = isFraction(b)

	if (!aF && !bF) return false

	// on doit contrôler que le polynôme est de la forme
	// (x+a)^2+(y+b)^2
	// (x+a)^2+y^2
	// x^2+(y+b)^2
	// x^2+y^2
	const [x, y] = splitIfOutsideParentheses(aF ? b : a, '+')
		.sort(sortPartsByVariable)

	if (y === undefined) return false

	if (!(x === 'x^2' || x.match(/\(x([+-](\d+(\/\d+)?)?)?\)\^2/))) return false

	if (!(y === 'y^2' || y.match(/\(y([+-](\d+(\/\d+)?)?)?\)\^2/))) return false

	return true
}

export function isEquation(value: string): false | Equation {
	if (!value.includes("=")) {
		return false
	}

	try {
		return new Equation(value)
	} catch {
		return false
	}
}
