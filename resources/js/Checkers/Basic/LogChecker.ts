import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {NumExp} from "pimath"
import {CheckerResult, CHECKERS} from "../checker.config"

const name = "log"
const description = `log,[paramètres]

**paramètres**
`

export class LogChecker extends CheckerAbstract {
	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.LOGARITHM
		this.description = description
	}

	readonly format = "réponse sous la forme \\(\\log(a)-3/5\\)"

	override checkFormat(value: string): string {
		// Il ne peut pas y avoir de point.
		if (value.includes(".")) {
			return "La réponse n'est pas sous forme exact (nombres entiers)"
		}

		const fractionOutsideLog = value
			.replace(
				/log\([^)]*\/[^)]*\)/g,
				match => match.replace(/\//g, "")
			)

		if (fractionOutsideLog.split("/").length > 2) {
			return "La réponse ne peut contenir qu'une seule barre de fraction hors du log."
		}

		return ""
	}

	override checkValue(value: string): CheckerResult {
		const ND: string[] = value.split("/")
		// Il ne doit y avoir qu'une fraction.
		let userN, userD
		try {
			userN = new NumExp(ND[0]).evaluate()
		} catch {
			return makeCheckerResult(`${ND.length === 1 ? "La réponse" : "Le numérateur"} n'est pas correctement formé.`)
		}
		if (ND.length === 2) {
			try {
				userD = new NumExp(ND[1]).evaluate()
			} catch {
				return makeCheckerResult("Le dénominateur n'est pas correctement formé.")
			}
		} else {
			userD = 1
		}


		const [expN, expD] = this.answer.split("/")
		let expNValue: number, expDValue: number

		try {
			expNValue = new NumExp(expN).evaluate()
		} catch {
			// Do nothing
			expNValue = 1
		}
		if (expD === undefined) {
			expDValue = 1
		} else {
			try {
				expDValue = new NumExp(expD).evaluate()
			} catch {
				// Do nothing
				expDValue = 1
			}
		}


		const answerDecimal = userN / userD,
			expectedDecimal = expNValue / expDValue

		if (answerDecimal.toFixed(8) !== expectedDecimal.toFixed(8)) {
			return makeCheckerResult("La réponse sous forme exacte ne donne pas la bonne valeur.")
		}

		return makeCheckerResult()
	}


}


