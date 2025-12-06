import {CheckerAbstract, CheckerResult, CHECKERS, ExactChecker, makeCheckerResult} from "@/Checkers"
import {checkParentheses, parseCoordinates} from "@/Checkers/checkerHelperFunctions.ts"

// const name = "coord"
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

	get format(): string {
		return `coordonnées d'un point sous la forme \\((a;b)\\)`
	}

	override checkFormat(value: string): string {
		// Manque les parenthèses
		return checkParentheses(value)
			? ""
			: "des coordonnées commencent et se terminent par des parenthèses"
	}

	override checkValue(value: string): CheckerResult {
		const values = parseCoordinates(value)
		const expectedValues = parseCoordinates(this.answer)

		if (values.length === 1) {
			return makeCheckerResult("des coordonnées ont au moins deux valeurs, séparées par un \\(;\\)")
		}

		if (values.length !== expectedValues.length) {
			return makeCheckerResult("la dimension de la coordonnée ne correspond pas")
		}

		return this.secondaryCheckValues(
			values,
			expectedValues,
			(i: number, message: string) =>
				`la ${i === 0 ? "1ère" : (i + 1) + "ème"} coordonnée n'est pas juste.<br>\\(\\rightarrow\\) ${message}`
		)
	}


}
