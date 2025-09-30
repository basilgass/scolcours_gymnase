import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {CheckerResult, CHECKERS} from "../checker.config"

// const name = "input"
const description = `input,[paramètres]

**paramètres**
- checker
`

export class InputChecker extends CheckerAbstract {
	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.INPUT
		this.description = description
	}


	readonly format = "Réponse textuelle"

	checkValue(value: string): CheckerResult {
		return makeCheckerResult("La réponse n'est pas correcte")
	}
}
