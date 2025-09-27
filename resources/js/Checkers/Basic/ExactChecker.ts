import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {Fraction, NumExp} from "pimath"
import {CheckerResult, CHECKERS} from "../checker.config"

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

	override checkValue(value: string): CheckerResult {
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
			return makeCheckerResult()
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
					return makeCheckerResult()
				}

				const message: string[] = [
					"La réponse donnée est juste, mais pas sous la forme attendue.",
				]

				// Contrôle si c'est une fraction.
				if(isFraction(this.answer) && isFraction(value)){
					const F = new Fraction(value)
					if(!F.isReduced()){
						message.push('Il faut réduire la fraction.')
					}
				}

				if (value.includes("/sqrt")) {
					message.push("Il y a encore une racine au dénominateur")
				}

				return makeCheckerResult(message.join("<br/>"), true)
			}
		}

		return makeCheckerResult("La réponse donnée n'est pas juste.")
	}

}


function isFraction(value: string){
	const [num, den] = value.split('/')
	return !isNaN(+num) && (den===undefined || !isNaN(+den))
}
