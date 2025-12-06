import {CheckerAbstract, CheckerResult, CHECKERS, ExactChecker, makeCheckerResult} from "@/Checkers"
import {Fraction} from "pimath"
import {checkParentheses, parseCoordinates} from "@/Checkers/checkerHelperFunctions.ts"

// const name = "vector"
const description = `vector,[paramètres]

**paramètres**
- co=accepte un vecteur colinéaire
- nb= les composantes sont des nombres
- frac= les composantes sont des fractions
`

export class VectorChecker extends CheckerAbstract {

	private _colinear = false


	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.VECTOR
		this.description = description

		if (this.config.includes("co")) {
			this._colinear = true
		}

		this.secondaryChecker = new ExactChecker()
	}

	override get format(): string {
		return `Vecteur ${this._colinear ? 'colinéaire ' : ''}sous la forme \\(\\begin{pmatrix}a\\\\b\\end{pmatrix}\\)<br>${this.secondaryChecker?.format}`
	}

	checkCollinearity(values: string[], expectedValues: string[]): CheckerResult {
		// des valeurs colinéaires impliquent des fractions
		let a, b, k

		for (let i = 0; i < values.length; i++) {
			a = new Fraction(values[i])
			b = new Fraction(expectedValues[i])

			if ((a.isZero() && b.isNotZero()) || a.isNotZero() && b.isZero()) {
				return makeCheckerResult(`la ${i + 1}e composante est fausse.`)
			}

			if (a.isNotZero() && b.isNotZero()) {
				if (k === undefined) {
					k = new Fraction(a.clone().divide(b))
				} else {
					if (a.isNotEqual(b.clone().multiply(k))) {
						return makeCheckerResult(`la ${i + 1}e composante n'est pas proportionnelle`)
					}
				}
			}
		}

		return makeCheckerResult()
	}

	override checkFormat(value: string): string {

		return checkParentheses(value)
			? ""
			: "des vecteurs commencent et se terminent par des parenthèses"
	}

	override checkValue(value: string): CheckerResult {
		const values = parseCoordinates(value)
		const expectedValues = parseCoordinates(this.answer)

		if (values.length === 1) {
			return makeCheckerResult("des vecteurs ont au moins deux valeurs")
		}

		if (values.length !== expectedValues.length) {
			return makeCheckerResult("la dimension du vecteur ne correspond pas")
		}


		if (this.config.includes("co")) {
			const colinearCheck = this.checkCollinearity(values, expectedValues)
			if (!colinearCheck.result) {
				return colinearCheck
			}
		}

		return this.secondaryCheckValues(
			values,
			expectedValues,
			(i: number, message: string) =>
				`la ${i === 0 ? "1ère" : (i + 1) + "ème"} composante n'est pas juste.<br>${message}`
		)

	}

}


