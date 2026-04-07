import {CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"
import {Fraction} from "pimath"
import {checkParentheses, parseCoordinates} from "@/Checkers/checkerHelperFunctions.ts"
import {CoordChecker} from "@/Checkers/Basic/CoordChecker"

// const name = "vector"
const description = `vector,[paramètres]

**paramètres**
- co=accepte un vecteur colinéaire
- nb= les composantes sont des nombres
- frac= les composantes sont des fractions
`

export class VectorChecker extends CoordChecker {

	private readonly _colinear: boolean

	constructor(config?: string[] | string) {
		super(config)
		this._termName = 'vecteurs'
		this.type = CHECKERS.VECTOR
		this.description = description
		this._colinear = this.config.includes("co")
	}

	override get format(): string {
		return `Vecteur ${this._colinear ? 'colinéaire ' : ''}sous la forme \\(\\begin{pmatrix}a\\\\b\\end{pmatrix}\\)<br>${this.secondaryChecker?.format}`
	}

	override checkFormat(value: string): string {
		return checkParentheses(value)
			? ""
			: `des ${this._termName} commencent et se terminent par des parenthèses`
	}

	private checkCollinearity(values: string[], expectedValues: string[]): CheckerResult {
		let k: Fraction | undefined

		for (let i = 0; i < values.length; i++) {
			const a = new Fraction(values[i])
			const b = new Fraction(expectedValues[i])

			if (a.isZero() !== b.isZero()) {
				return makeCheckerResult(`la ${i + 1}e composante est fausse.`)
			}

			if (a.isNotZero()) {
				const ratio = new Fraction(a.clone().divide(b))
				if (k === undefined) {
					k = ratio
				} else if (ratio.isNotEqual(k)) {
					return makeCheckerResult(`la ${i + 1}e composante n'est pas proportionnelle`)
				}
			}
		}

		return makeCheckerResult()
	}

	override checkValue(value: string): CheckerResult {
		const values = parseCoordinates(value)
		const expectedValues = parseCoordinates(this.answer)

		if (values.length !== expectedValues.length) {
			return makeCheckerResult("la dimension ne correspond pas")
		}

		if (this._colinear) {
			return this.checkCollinearity(values, expectedValues)
		}

		return this.secondaryCheckValues(
			values,
			expectedValues,
			(i: number, message: string) =>
				`la ${i === 0 ? "1ère" : (i + 1) + "ème"} composante n'est pas juste.<br>${message}`
		)
	}
}
