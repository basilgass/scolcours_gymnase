import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"

// const name = "study"
const description = `study

**paramètres**
aucun
`

export class StudyChecker extends CheckerAbstract {
	readonly format = "Tracer le graphe"

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.STUDY
		this.description = description
	}

	override checkValue(value: string): CheckerResult {
		const arrayAnswer = value.split(",").sort()
		const arrayExpected = this.answer.split(",").sort()
		const d = arrayExpected.length - arrayAnswer.length

		// pas le même nombre d'éléments
		if (d > 0) {
			return makeCheckerResult(`il manque ${d} élément${d > 1 ? "s" : ""}`)
		} else if (d < 0) {
			return makeCheckerResult(`il y a ${-d} élément${-d > 1 ? "s" : ""} en trop`)
		}

		const erreurs = []
		const traceErrors = []


		// TODO : analyser et comprendre ce checker et améliorer l'aide
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
			return makeCheckerResult(`il y a ${erreurs.length} erreur${erreurs.length > 1 ? "s" : ""}`)
		}

		if (traceErrors.length > 0) {
			return makeCheckerResult(`il y a ${traceErrors.length} erreur${traceErrors.length > 1 ? "s" : ""} dans le tracé`)
		}

		return makeCheckerResult()

	}


}

