import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"
import {NumberChecker} from "@/Checkers/Basic/NumberChecker"

// const name = "scientific"
const description = `scientific|scn,[paramètres]

**paramètres**
- [1,2,3,4,...]: nombre de chiffres significatifs
- s: strict (1.2 ne passe pas pour 1.20)
`

export class ScientificChecker extends CheckerAbstract {
	private readonly digits: number

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.SCIENTIFIC
		this.description = description

		this.digits = isNaN(+this.config[0]) ? 0 : +this.config[0]
		this.secondaryChecker = new NumberChecker([this.digits.toString()])
	}

	get format(): string {
		return this.digits
			? `réponse en notation scientifique à ${this.digits} chiffre(s) significatif(s)`
			: "réponse en notation scientifique"
	}

	override checkFormat(value: string): string {
		if (!value.includes('*10^')) {
			return "le format de réponse n'est pas une notation scientifique."
		}

		const PS = +(value.split("*")[0])
		const OG = +(value.split("10^")[1])

		if (isNaN(PS) || isNaN(OG)) {
			return "le format de réponse n'est pas une notation scientifique."
		}

		if (Math.abs(PS) < 1 || Math.abs(PS) >= 10) {
			return "la partie significative n'est pas entre 1 et 10 (non compris)"
		}

		return ""
	}

	override checkValue(value: string): CheckerResult {
		const PS = +(value.split("*")[0])
		const OG = +(value.split("10^")[1])
		const ePS = +(this.answer.split("*")[0])
		const eOG = +(this.answer.split("10^")[1] || 0)

		if (PS !== ePS) {
			return makeCheckerResult("erreur dans la partie significative: " +
				this.secondaryChecker?.check(PS.toString(), ePS.toString()).message)
		}

		if (OG !== eOG) {
			return makeCheckerResult("l'ordre de grandeur n'est pas juste...")
		}

		return makeCheckerResult()
	}
}