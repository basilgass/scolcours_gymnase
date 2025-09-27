import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {Fraction} from "pimath"
import {CheckerResult, CHECKERS} from "../checker.config"

const name = "fraction"

const description = `fraction,[paramètres]

**paramètres**
- r=réduit
`

export class FractionChecker extends CheckerAbstract {
	private expectReduced: boolean

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.FRACTION
		this.description = description

		this.expectReduced = this.config.includes("r") || this.config.includes("reduced")
	}

	get format(): string {
		const opts = []
		if (this.expectReduced) {
			opts.push("réduite")
		}

		return `réponse sous forme de fraction ${opts.join(",")}`
	}

	override checkFormat(value: string): string {
		try {
			new Fraction(value)
			return ""
		} catch {
			return "La fraction n'est pas formatée correctement."
		}
	}

	override checkValue(value: string): CheckerResult {

		const FAnswer = new Fraction(value)
		const FExpected = new Fraction(this.answer)

		if (FAnswer.isNotEqual(FExpected)) {
			return makeCheckerResult("La réponse donnée n'est pas juste.")
		}

		if (FAnswer.denominator < 0) {
			return makeCheckerResult("Le dénominateur doit être positif.", true)
		}

		if (!FAnswer.isReduced() && this.expectReduced) {
			return makeCheckerResult("La fraction n'est pas réduite.", true)
		}

		return makeCheckerResult()
	}


}
