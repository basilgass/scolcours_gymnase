import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {stripFirstCharacter, stripLastCharacter} from "../checkerHelperFunctions.ts"
import {Fraction} from "pimath"
import {ExactChecker} from "./ExactChecker"
import {CheckerResult, CHECKERS} from "../checker.config"

const name = "vector"
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

	get format(): string {
		return `Vecteur ${this._colinear ? 'colinéaire ' : ''}sous la forme \\(\\begin{pmatrix}a\\\\b\\end{pmatrix}\\)<br>${this.secondaryChecker?.format}`
	}

	override checkFormat(value: string): string {

		if (value[0] !== "(" || value[value.length - 1] !== ")") {
			return "des vecteurs commencent et se terminent par des parenthèses"
		}

		return ""
	}

	override checkValue(value: string): CheckerResult {
		// On récupère les valeurs
		const values = value.split(";"),
			expectedValues = this.answer.split(";")


		if (values.length === 1) {
			return makeCheckerResult("des vecteurs ont au moins deux valeurs")
		}

		if (values.length !== expectedValues.length) {
			return makeCheckerResult("la dimension du vecteur ne correspond pas")
		}

		// remove the parentese from the first and last value.
		values[0] = stripFirstCharacter(values[0])
		values[values.length - 1] = stripLastCharacter(values[values.length - 1])

		if (expectedValues[0].startsWith("(")) {
			expectedValues[0] = stripFirstCharacter(expectedValues[0])
		}

		if (expectedValues[expectedValues.length - 1].endsWith(")")) {
			expectedValues[expectedValues.length - 1] = stripLastCharacter(expectedValues[expectedValues.length - 1])
		}

		if (this.config.includes("co")) {
			// suppose that each values are fraction
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
		}

		return this.secondaryCheckValues(
			values, expectedValues,
			(i: number, message: string) => `la ${i === 0 ? "1ère" : (i + 1) + "ème"} composante n'est pas juste.<br>${message}`
		)

	}

}


