import {CheckerAbstract} from "../CheckerAbstract";
import {NumExp} from "pimath";
import {CHECKERS} from "../checker.config";

const name = "exact"
const description = `exact

**paramètres**
soft = valeur numérique juste, mais pas sous la forme attendue
`

export class ExactChecker extends CheckerAbstract {
	private isSoft: boolean

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.EXACT
		this.description = description

		this.isSoft = this.config.includes("soft")
	}

	readonly format = "réponse sous forme exacte, réduite"

	override checkValue(value: string): string {
		// Le résultat est exactement ce qui est demandé
		const stringAnswer = value.toString(),
			asciiAnswer = stringAnswer.startsWith("#")
				? stringAnswer.substring(1)
				: stringAnswer

		// Parse the expected answer as a number
		// Replace "sqrt" by "sqrt(" and ")" by ")", then evaluate
		const expectedExpression = this.answer.replace(/sqrt([0-9]+)/g, "sqrt($1)")
		const givenExpression = asciiAnswer.replace(/sqrt([0-9]+)/g, "sqrt($1)")

		// Maybe with the reformating, the answers is exactly the same.
		if (expectedExpression === givenExpression) {
			return  ""
		}

		// Parse the formated answers as a number
		const expectedNumber = new NumExp(expectedExpression)
		const givenNumber = new NumExp(givenExpression)

		if (expectedNumber.isValid && givenNumber.isValid) {
			if (
				expectedNumber.evaluate().toFixed(10) ===
				givenNumber.evaluate().toFixed(10)
			) {
				if (this.isSoft) {
					return  ""
				}

				const message: string[] = [
					"La réponse donnée est juste, mais pas sous la forme attendue.",
				]

				if (value.includes("/sqrt")) {
					message.push("Il y a encore une racine au dénominateur")
				}
				return message.join("<br/>")
			}
		}

		return  "La réponse donnée n'est pas juste."
	}

}
