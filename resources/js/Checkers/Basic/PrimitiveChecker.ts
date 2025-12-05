import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {ExpChecker} from "./ExpChecker"
import {LogChecker} from "./LogChecker"
import {PolynomChecker} from "./PolynomChecker"
import {CheckerResult, CHECKERS} from "../checker.config"

// const name = "primitive"
const description = `primitive,[paramètres]

**paramètres**
aucun
`

export class PrimitiveChecker extends CheckerAbstract {
	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.PRIMITIVE
		this.description = description
	}

	readonly format = "primitive d'une fonction"


	override checkValue(value: string): CheckerResult {
		let subchk: CheckerAbstract

		// TODO: contrôle des primitive avec exp et log... à revoir.
		if (value.includes("e")) {
			subchk = new ExpChecker(this._config)
		} else if (value.includes('ln')) {
			subchk = new LogChecker(this._config)
		} else {
			subchk = new PolynomChecker(this._config)
		}

		// On vérifie sans la constante !
		const result = subchk.check(
			this.answer.replaceAll('+c', ''),
			value.replaceAll('+c', '')
		)

		if (!result.result) {
			return result
		}

		if (!value.endsWith('+c')) {
			return makeCheckerResult("il manque la constante...", 0.8)
		}

		return makeCheckerResult()
	}
}
