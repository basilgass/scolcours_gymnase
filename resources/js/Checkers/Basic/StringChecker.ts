import {CheckerAbstract} from "../CheckerAbstract";
import {CHECKERS} from "../checker.config";

const name = "string"
const description = "string"

export class StringChecker extends CheckerAbstract {
	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.STRING
		this.description = description
	}

	readonly format = "réponse textuelle"

}
