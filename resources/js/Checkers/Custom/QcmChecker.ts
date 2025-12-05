import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {CheckerResult, CHECKERS} from "../checker.config"

// const name = "qcm"
const description = "qcm,[paramètres]"

export class QcmChecker extends CheckerAbstract {
	readonly format = "questionnaire à choix multiples"

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.QCM
		this.description = description
	}


	checkValue(value: string): CheckerResult {
		const sorted = value.split(',').sort()
		const expectedSorted = this.answer.split(',').sort()

		if (sorted.join(',') === expectedSorted.join(',')) {
			return makeCheckerResult()
		}

		return makeCheckerResult("La réponse n'est pas correcte")
	}

}
