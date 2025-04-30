import {CheckerAbstract} from "../CheckerAbstract";
import {CHECKERS} from "../checker.config";

const name = "input"
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
}
