import {CheckerAbstract} from "../CheckerAbstract"
import {stripFirstCharacter, stripLastCharacter} from "../checkerHelperFunctions.ts"
import {ExactChecker} from "./ExactChecker"
import {CheckerResult, CHECKERS} from "../checker.config"

const name = "coord"
const description = `coord,[paramètres]

**paramètres**
- nb= les coordonnées sont des nombres
- frac= les coordonnées sont des fractions
`

export class CoordChecker extends CheckerAbstract {

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.COORDINATES
		this.description = description

		this.secondaryChecker = new ExactChecker()
	}

	readonly format = "Coordonnées d'un point sous la forme \\((a;b)\\)"

	override checkFormat(value: string): string {
		// Manque les parenthèses
		if (value[0] !== "(" || value[value.length - 1] !== ")") {
			return "des coordonnées commencent et se terminent par des parenthèses"
		}

		return ""
	}

	override checkValue(value: string): CheckerResult {

		// On récupère les valeurs
		const values = value.split(";"),
			expectedValues = this.answer.split(";")

		if (values.length === 1) {
			return this.makeCheckerResult("des coordonnées ont au moins deux valeurs, séparées par un \\(;\\)")
		}

		if (values.length !== expectedValues.length) {
			return this.makeCheckerResult("la dimension de la coordonnées ne correspond pas")
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


		// let eChecker = ExactChecker(config)
		return this.secondaryCheckValues(values, expectedValues, (i: number, message: string) =>
			`la ${i === 0 ? "1ère" : (i + 1) + "ème"} coordonnée n'est pas juste.<br>\\(\\rightarrow\\) ${message}`
		)
	}

}
