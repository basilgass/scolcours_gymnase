import {CheckerAbstract} from "../CheckerAbstract";
import {NumberChecker} from "./NumberChecker";
import {CHECKERS} from "../checker.config";

const name = "scientific"
const description = `scientific|scn,[paramètres]

//TODO: scn: mode stricte
**paramètres**
- [1,2,3,4,...]: nombre de chiffre après la virgule
- s: strict (1.2 ne passe pas pour 1.20)
`

export class ScientificChecker extends CheckerAbstract {
    private digits: number
    constructor(config:string[]|string) {
        super(config)
        this.type = CHECKERS.SCIENTIFIC
        this.description = description
        this.digits = isNaN(+this.config[0])?0:+this.config[0]

		this.secondaryChecker = new NumberChecker([this.digits.toString()])
    }


    get format(): string {
        return this.digits ?
            "réponse en notation scientifique" :
            `réponse en notation scientifique à ${this.digits} chiffre(s) significatif(s)`
    }


	override checkValue(value: string): string {
		// On vérifie que le format est bien de type scientifique.
		const PS = +(value.split("*")[0]),
			OG = +(value.split("10^")[1] || 0),
			ePS = +(this.answer.split("*")[0]),
			eOG = +(this.answer.split("10^")[1] || 0)

		// On vérifie la partie significative
		if (Math.abs(PS) < 1 || Math.abs(PS) >= 10) {
			return "la partie significative n'est pas entre 1 et 10 (non compris)"
		}

		if (PS !== ePS) {
			return "erreur dans la partie significative: " +
				this.secondaryChecker?.check(ePS.toString(), PS.toString()).message
		}

		if (!value.includes("*10^")) {
			return "le format de réponse n'est pas une notation scientifique."
		}

		// On vérifie l'ordre de grandeur.
		if (OG !== eOG) {
			return "l'ordre de grandeur n'est pas juste..."
		}

		return ""
	}

}
