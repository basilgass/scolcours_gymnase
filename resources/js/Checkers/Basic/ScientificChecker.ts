import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {NumberChecker} from "./NumberChecker"
import {CheckerResult, CHECKERS} from "../checker.config"

// const name = "scientific"
const description = `scientific|scn,[paramètres]

**paramètres**
- [1,2,3,4,...]: nombre de chiffre après la virgule
- s: strict (1.2 ne passe pas pour 1.20)
`

export class ScientificChecker extends CheckerAbstract {
	private digits: number

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.SCIENTIFIC
		this.description = description

		this.digits = isNaN(+this.config[0]) ? 0 : +this.config[0]

		this.secondaryChecker = new NumberChecker([this.digits.toString()])
	}


	get format(): string {
		return this.digits ?
			`réponse en notation scientifique à ${this.digits} chiffre(s) significatif(s)` :
			"réponse en notation scientifique"
	}


	override checkValue(value: string): CheckerResult {
		// On vérifie que le format est bien de type scientifique.
		const PS = +(value.split("*")[0])
		const OG = +(value.split("10^")[1] || 0)
		const ePS = +(this.answer.split("*")[0])
		const eOG = +(this.answer.split("10^")[1] || 0)

		// On vérifie la partie significative
		if (Math.abs(PS) < 1 || Math.abs(PS) >= 10) {
			return makeCheckerResult("la partie significative n'est pas entre 1 et 10 (non compris)")
		}

		if (PS !== ePS) {
			return makeCheckerResult("erreur dans la partie significative: " +
				this.secondaryChecker?.check(ePS.toString(), PS.toString()).message)
		}
		
		// On vérifie l'ordre de grandeur.
		if (OG !== eOG) {
			return makeCheckerResult("l'ordre de grandeur n'est pas juste...")
		}

		return makeCheckerResult()
	}

}
