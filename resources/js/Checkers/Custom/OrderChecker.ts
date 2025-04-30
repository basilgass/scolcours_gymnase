import {CheckerAbstract} from "../CheckerAbstract";
import {CHECKERS} from "../checker.config";

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

}
