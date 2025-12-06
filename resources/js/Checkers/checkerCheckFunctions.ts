import {Equation, Numeric, Polynom} from "pimath"
import type {CheckerAbstract} from "@/Checkers/CheckerAbstract.ts"


export function checkMinMaxEquation(value: string, answer: string, secondaryChecker: CheckerAbstract): string {
	// Come from Polynom checker.
	// Left or right part must be correctly formed.
	// y = [a](x-b)^2[ + c]
	// y = [a]x^2[ + c]
	const [left, right] = value.split("=")
	const [eLeft, eRight] = answer.split("=")

	const polynomY = left === "y" ? left : right,
		polynomSommet = left === "y" ? right : left,
		expectedSommet = eLeft === "y" ? eRight : eLeft

	return polynomY !== "y"
		? "Un côté de l'équation doit juste être (y)"
		: secondaryChecker?.check(polynomSommet, expectedSommet).message ?? ""
}

export function checkReducedEquation(A: Equation): string {
	const lcmL = A.left.commonMonom().coefficient.value,
		lcmR = A.right.commonMonom().coefficient.value,
		lcm = Numeric.lcm(lcmL, lcmR)

	return lcm !== 1 ? "l'équation n'est pas réduite." : ""
}

export function checkCircle(value: string, A: Equation): string {
	// x^2  + (y-b)^2 = r^2
	// (x-a)^2 + y^2 = r^2
	// x^2+y^2 = r^2
	// (x-a)^2 + (y-b)^2 = r^2

	// Must be a polynom of degree 2 in x and y.
	if (A.degree("x").value !== 2 || A.degree("y").value !== 2) {
		return "L'équation n'a pas les bons degrés."
	}

	// One part of the equation must be of degree zero.
	let center = ""

	if (
		A.left.degree("x").value === 2 &&
		A.right.degree("x").isZero() &&
		A.left.degree("y").value === 2 &&
		A.right.degree("y").isZero()
	) {
		center = value.split("=")[0]
	} else if (
		A.right.degree("x").value === 2 &&
		A.left.degree("x").isZero() &&
		A.right.degree("y").value === 2 &&
		A.left.degree("y").isZero()
	) {
		center = value.split("=")[1]
	} else {
		return "L'équation n'est pas correctement formée pour la forme centre - rayon."
	}

	// radius should be ok and does not need more checks
	// center must be correctly formed.
	// Transform ^(2) into ^2
	center = center.replaceAll("^(2)", "^2")

	if (
		center.match(/\(x[+-][0-9/]+\)\^2\+\(y[+-][0-9/]+\)\^2/) ||
		center.match(/x\^2\+\(y[+-][0-9/]+\)\^2/) ||
		center.match(/\(x[+-][0-9/]+\)\^2\+y\^2/) ||
		center === "x^2+y^2" ||
		center === "y^2+x^2"
	) {
		return ""
	} else {
		return "L'équation n'est pas dans le bon format."
	}
}

function getFactors(value: string): string[] {
	if (!value.includes('(')) {
		return [value]
	}

	const matches = value.match(/\(([^)]+)\)/g) ?? []
	return matches.map(m => m.slice(1, -1))
}

export function checkPolynomIsFactorized(value: string) {
	const factors = getFactors(value)

	// On vérifie que chaque polynôme est entièrement factorisé
	return factors.every(factor => {
		return new Polynom(factor).factorize().length === 1
	})
}
