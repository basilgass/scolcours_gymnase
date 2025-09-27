import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {CheckerResult, CHECKERS} from "../checker.config"

const name = "order"
const description = `order,[paramètres]

**paramètres**
aucun
`

export class OrderChecker extends CheckerAbstract {

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.ORDER
		this.description = description
	}

	readonly format = ""

	checkValue(value: string): CheckerResult {
		return makeCheckerResult("La réponse n'est pas correcte")
	}

}
