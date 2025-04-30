import {CheckerAbstract} from "../CheckerAbstract";
import {ExpChecker} from "./ExpChecker";
import {LogChecker} from "./LogChecker";
import {PolynomChecker} from "./PolynomChecker";
import {CHECKERS} from "../checker.config";

const name = "primitive"
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


	override checkValue(value: string): string {
		let subchk
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
			return result.message
		}

		const s = value.split('+c').length
		if (s !== 2) {
			return s === 1 ? "il manque la constante." : `il y a ${s - 1} constantes...`
		}

		return result.message
	}
}
