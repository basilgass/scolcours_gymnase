import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"

// const name = "input"
const description = `input,[paramètres]

**paramètres**
- checker
`

export class InputChecker extends CheckerAbstract {
	readonly format = "Réponse textuelle"

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.INPUT
		this.description = description

		// TODO: gérer les paramètres comme normalisation du texte ?
	}

	checkValue(value: string): CheckerResult {
		return makeCheckerResult("La réponse n'est pas correcte")
	}
}
