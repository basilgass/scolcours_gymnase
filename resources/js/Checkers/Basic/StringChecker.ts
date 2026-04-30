import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"

// const name = "string"
const description = "string"

export class StringChecker extends CheckerAbstract {
	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.STRING
		this.description = description
	}

	readonly format = "réponse textuelle"

	checkValue(value: string): CheckerResult {
		return makeCheckerResult("La réponse n'est pas correcte")
	}

}
