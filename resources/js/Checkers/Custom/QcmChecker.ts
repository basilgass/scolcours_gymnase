import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {CheckerResult, CHECKERS} from "../checker.config"

// const name = "qcm"
const description = "qcm,[paramètres]"

export class QcmChecker extends CheckerAbstract{
	readonly format = ""

	constructor(config: string[]|string){
		super(config)
		this.type = CHECKERS.QCM
		this.description = description
	}

	checkValue(value: string): CheckerResult {
		return makeCheckerResult("La réponse n'est pas correcte")
	}

}
