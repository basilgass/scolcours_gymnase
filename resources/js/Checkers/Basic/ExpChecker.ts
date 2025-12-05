import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {splitAtSigns, splitIfOutsideParentheses} from "../checkerHelperFunctions.ts"
import {Polynom} from "pimath"
import {CheckerResult, CHECKERS} from "../checker.config"
import {PolynomChecker} from "@/Checkers"

// const name = "exp"
const description = `exp,[paramètres]

**paramètres**
aucun
`

export class ExpChecker extends CheckerAbstract {
	readonly format = "polynôme avec des exponentielles <br/>\\((x-3)e^{x^2-3}\\)"

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.EXPONENTIAL
		this.description = description
	}

	override checkValue(value: string): CheckerResult {
		// plusieurs possible:
		// ae^(polynom)
		// ae^(polynom) + be^(polynom)
		// ae^(polynom) + be^(polynom) / ae^(polynom) + be^(polynom)

		// on coupe en numérateur / dénominateur
		// on recherche un endroit qui n'est pas entre parenthèse.
		const [N, D] = splitIfOutsideParentheses(value, "/")
		const [eN, eD] = splitIfOutsideParentheses(this.answer, "/")

		// contrôle de cohérence
		if (D === undefined && eD !== undefined) {
			return makeCheckerResult("Un dénominateur est attendu...")
		}

		if (D !== undefined && eD === undefined) {
			return makeCheckerResult("Aucun dénominateur n'est prévu dans cette réponse.")
		}

		let check = expCompare(N, eN)

		if (!check.result) {
			return makeCheckerResult([
				"il y a une erreur au numérateur",
				check.message
			], check.score)
		}

		// On contrôle les dénominateurs
		if (D !== undefined && eD !== undefined) {
			check = expCompare(D, eD)

			if (!check.result) {
				return makeCheckerResult([
						"il y a une erreur au dénominateur",
						check.message
					],
					check.score)
			}
		}

		return makeCheckerResult()
	}

}


function expCompare(value: string, eValue: string): CheckerResult {
	if (eValue === value) {
		return makeCheckerResult()
	}

	// On contrôle maintenant les numérateurs
	const elements = splitAtSigns(value)
	const expectedElements = splitAtSigns(eValue)

	if (expectedElements.length !== elements.length) {
		return makeCheckerResult("Il n'y a pas le bon nombre d'éléments")
	}


	if (expectedElements.length >= 2) return multiExpCompare(elements, expectedElements)


	return expCompareParts(value, eValue)
}

function expCompareParts(givenElement: string, expectedElement: string): CheckerResult {
	const given = displayPolynomForSorting(givenElement)
	const expected = displayPolynomForSorting(expectedElement)

	// comparer le polynom
	const chk = new PolynomChecker([]).check(given.polynom, expected.polynom)
	if (!chk.result) return chk

	// comparer l'exposant
	return new PolynomChecker([]).check(given.polynom, expected.polynom)

}

function multiExpCompare(elements: string[], expectedElements: string[]): CheckerResult {
	// Chaque élément est maintenant de la forme
	// (polynom)e^(polynom)

	// Préparation de tous les éléments sous la forme d'un tableau:
	// [ {polynom, exponent} ]

	// TODO: move the exponential polynom to PiMathExt and a dedicated class.
	const elementsArr: {
		polynom: string,
		exponent: string,
		sort: string
	}[] = sortPolynomials(elements)

	const expectedElementsArr: {
		polynom: string,
		exponent: string,
		sort: string
	}[] = sortPolynomials(expectedElements)

	// Tous les éléments sont "alignés"
	let errors = 0
	for (let i = 0; i < expectedElementsArr.length; i++) {
		if (expectedElementsArr[i].sort !== elementsArr[i].sort) {
			errors++
		}
	}
	if (errors > 0) {
		return makeCheckerResult(`Il y a ${errors} élément${errors === 1 ? "" : "s"} qui ${errors === 1 ? "est" : "sont"} faux.`)
	}

	return makeCheckerResult()
}

function sortPolynomials(values: string[]) {
	return values.map(element => {
		return displayPolynomForSorting(element)
	}).sort((a, b) => {
		return a.sort < b.sort ? 1 : -1
	})
}

function displayPolynomForSorting(element: string): { polynom: string, exponent: string, sort: string } {
	const match = element.match(/^(\S+)?(e\^(\S+))$/)

	// cas (poly1)e^(poly2)
	// poly1 est optionnel
	let poly1, poly2

	if (match) {
		try {
			poly1 = new Polynom(match[1]).reorder().display
		} catch {
			poly1 = match[1] ? match[1] : ""
		}
		try {
			poly2 = new Polynom(match[3]).reorder().display
		} catch {
			poly2 = match[3] ? match[3] : ""
		}

		return {
			polynom: match[1],
			exponent: match[3],
			sort: poly1 + poly2,
		}
	}

	// Cas où il n'y a pas d'exponentiel
	let poly3
	try {
		poly3 = new Polynom(element).reorder().display
	} catch {
		poly3 = element
	}

	return {
		polynom: element,
		exponent: "",
		sort: poly3
	}

}
