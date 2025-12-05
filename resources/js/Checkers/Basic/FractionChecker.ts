import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"
import {Fraction} from "pimath"

// const name = "fraction"

const description = `fraction,[paramètres]

**paramètres**
- r=réduit
`

export class FractionChecker extends CheckerAbstract {
	#reduced: boolean

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.FRACTION
		this.description = description

		this.#reduced = this.config.includes("r") || this.config.includes("reduced")
	}

	get format(): string {
		const opts = []
		if (this.#reduced) {
			opts.push("réduite")
		}

		return `réponse sous forme de fraction ${opts.join(",")}`
	}

	override checkFormat(value: string): string {
		try {
			if (value === '' || value === '-') {
				return "merci de donner une fraction..."
			}

			new Fraction(value)
			return ""
		} catch {
			return "La fraction n'est pas formatée correctement."
		}
	}

	override checkValue(value: string): CheckerResult {
		const FGiven = new Fraction(value)
		const FExpected = new Fraction(this.answer)

		if (FGiven.isNotEqual(FExpected)) {
			return makeCheckerResult("La réponse donnée n'est pas juste.")
		}

		if (FGiven.denominator < 0) {
			return makeCheckerResult("Le dénominateur doit être positif.", 0.8)
		}

		if (!FGiven.isReduced() && this.#reduced) {
			return makeCheckerResult("La fraction n'est pas réduite.", 0.5)
		}

		return makeCheckerResult()
	}


}
