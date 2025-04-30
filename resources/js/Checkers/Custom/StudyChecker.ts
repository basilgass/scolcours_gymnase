import {CheckerAbstract} from "../CheckerAbstract";
import {CHECKERS} from "../checker.config";

const name = "study"
const description = `study

**paramètres**
aucun
`
export class StudyChecker extends CheckerAbstract {
	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.STUDY
		this.description = description
	}


	readonly format = "Tracer le graphe"

	override checkValue(value: string): string {
		const arrayAnswer = value.split(",").sort(),
			arrayExpected = this.answer.split(",").sort(),
			d = arrayExpected.length - arrayAnswer.length

		if (d > 0) {
			return `il manque ${d} élément${d > 1 ? "s" : ""}`
		} else if (d < 0) {
			return `il y a ${-d} élément${-d > 1 ? "s" : ""} en trop`
		}

		const erreurs = [],
			traceErrors = []
		for (let i = 0; i <= arrayAnswer.length; i++) {
			if (arrayAnswer[i] !== arrayExpected[i]) {

				if (arrayExpected[i].split("&")[0] === arrayAnswer[i].split("&")[0]) {
					traceErrors.push(i + 1)
				} else {
					erreurs.push(i + 1)
				}
			}
		}

		if (erreurs.length > 0) {
			return `il y a ${erreurs.length} erreur${erreurs.length > 1 ? "s" : ""}`
		}

		if (traceErrors.length > 0) {
			return `il y a ${traceErrors.length} erreur${traceErrors.length > 1 ? "s" : ""} dans le tracé`
		}

		return ""

	}


}

