import {CheckerAbstract, CheckerResult, CHECKERS, ExactChecker, makeCheckerResult} from "@/Checkers"
import {NumberChecker} from "@/Checkers/Basic/NumberChecker"
import {FractionChecker} from "@/Checkers/Basic/FractionChecker"
import {checkParentheses, parseCoordinates} from "@/Checkers/checkerHelperFunctions.ts"

// const name = "coord"
const description = `coord,[paramètres]

**paramètres**
- nb= les coordonnées sont des nombres
- frac= les coordonnées sont des fractions
`

export class CoordChecker extends CheckerAbstract {

	protected _termName = 'coordonnées'

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.COORDINATES
		this.description = description
		this.secondaryChecker = this._buildSecondaryChecker()
	}

	protected _buildSecondaryChecker() {
		if (this.config.includes('nb')) return new NumberChecker()
		if (this.config.includes('frac')) return new FractionChecker()
		return new ExactChecker()
	}

	get format(): string {
		return `coordonnées d'un point sous la forme \\((a;b)\\)`
	}

	override checkFormat(value: string): string {
		if (!checkParentheses(value)) {
			return `des ${this._termName} commencent et se terminent par des parenthèses`
		}
		const values = parseCoordinates(value)
		if (values.length < 2) {
			return `des ${this._termName} ont au moins deux valeurs, séparées par un \\(;\\)`
		}
		return ""
	}

	override checkValue(value: string): CheckerResult {
		const values = parseCoordinates(value)
		const expectedValues = parseCoordinates(this.answer)

		if (values.length !== expectedValues.length) {
			return makeCheckerResult("la dimension ne correspond pas")
		}

		return this.secondaryCheckValues(
			values,
			expectedValues,
			(i: number, message: string) =>
				`la ${i === 0 ? "1ère" : (i + 1) + "ème"} coordonnée n'est pas juste.<br>\\(\\rightarrow\\) ${message}`
		)
	}
}
