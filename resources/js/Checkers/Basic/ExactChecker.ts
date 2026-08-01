import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {Fraction, NumExp} from "pimath"
import {CheckerResult, CHECKERS} from "../checker.config"
import {normalizeExpression} from "@/Checkers/normalizeExpression"

// const name = "exact"
const description = `exact

**paramètres**
soft = valeur numérique juste, mais pas sous la forme attendue
`

export class ExactChecker extends CheckerAbstract {
	readonly format = "réponse sous forme exacte, réduite"
	#isSoft: boolean

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.EXACT
		this.description = description

		this.#isSoft = this.config.includes("soft")
	}

	override checkValue(value: string): CheckerResult {
		// Le résultat est exactement ce qui est demandé
		const stringAnswer = value.toString()
		const asciiAnswer = stringAnswer.startsWith("#")
			? stringAnswer.substring(1)
			: stringAnswer

		// Normalisation canonique (partagée avec les autres checkers) avant évaluation.
		const expectedExpression = normalizeExpression(this.answer)
		const givenExpression = normalizeExpression(asciiAnswer)

		// Maybe with the reformating, the answers is exactly the same.
		if (expectedExpression === givenExpression) {
			return makeCheckerResult()
		}

		// Parse et évalue une expression en valeur numérique.
		// Renvoie null (au lieu de lever) si l'expression est invalide ou non évaluable :
		// le constructeur NumExp comme evaluate() peuvent lancer sur une entrée malformée.
		const toNumber = (expression: string): number | null => {
			try {
				const exp = new NumExp(expression)
				return exp.isValid ? exp.evaluate() : null
			} catch {
				return null
			}
		}

		const givenValue = toNumber(givenExpression)
		if (givenValue === null) {
			return makeCheckerResult("La réponse n'est pas une valeur exacte reconnue.")
		}

		const expectedValue = toNumber(expectedExpression)
		if (expectedValue === null) {
			return makeCheckerResult("La réponse attendue n'est pas une valeur exacte reconnue.")
		}

		if (givenValue.toFixed(10) === expectedValue.toFixed(10)) {
			if (this.#isSoft) {
				// Si les deux nombres sont les mêmes valeurs...
				return makeCheckerResult()
			}

			// On a la bonne réponse, mais pas sous la forme attendue.
			const message: string[] = [
				"La réponse donnée est juste, mais pas sous la forme attendue.",
			]

			// Contrôle si c'est une fraction.
			if (Fraction.isFraction(this.answer) && Fraction.isFraction(value)) {
				const F = new Fraction(value)
				if (!F.isReduced()) {
					message.push('Il faut réduire la fraction.')
				}
			}

			const [, den] = value.split('/')
			if (den !== undefined && den.includes('sqrt')) {
				message.push("Il y a encore une racine au dénominateur")
			}

			return makeCheckerResult(message, 0.3)
		}

		return makeCheckerResult("La réponse donnée n'est pas juste.")
	}

}
