import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"
import {NumExp} from "pimath"

// const name = "string"
const description = "algebra checker (frac pour fraction automatique)"

export class AlgebraChecker extends CheckerAbstract {
	#autoFraction = false

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.STRING
		this.description = description

		if (this.config.includes('frac')) this.#autoFraction = true
	}

	readonly format = "expression algébrique"

	checkValue(value: string): CheckerResult {
		// On enlève toutes les multiplications
		const given = normalizeExpression(value)
		const answer = normalizeExpression(this.answer)

		if (given === answer) return makeCheckerResult()

		// On essaie d'évaluer les deux éléments à l'aide de 5 valeurs
		try {
			const aExp = new NumExp(answer)
			const gExp = new NumExp(given)

			let test_count = 0
			let result = 0
			let x = 0
			try {
				while (test_count++ < 20) {
					const aValue = aExp.evaluate({x: x})
					const gValue = gExp.evaluate({x: x})

					// prochaine valeur de x
					x = x > 0 ? -x : (-x + 5)
					
					if (isNaN(aValue) && isNaN(gValue)) {
						// on vient de tester avec une valeur non tolérée.
						continue
					}

					result++

					if (aValue !== gValue) {
						return makeCheckerResult("La réponse n'est pas correcte (comparaison numérique)")
					}

					// On arrête si on a au moins trois valeurs justes
					if (result >= 3) break
				}
			} catch {
				return makeCheckerResult("La réponse n'est pas une expression reconnue (valeurs)")
			}

		} catch {
			return makeCheckerResult("La réponse n'est pas une expression reconnue.")
		}

		// Sur un échantillon de 5 valeurs, les deux expressions donnent le même résultat.
		// Il s'agit donc just d'une différence de formatage - on l'accepte tel quel ?
		return makeCheckerResult()
	}
}

function normalizeExpression(value: string): string {
	// Transform 'root([0-9])(...)' en 'nthroot([0-9],...)'

	return value.replace(/(?<!\d)\*|\*(?!\d)/g, '')
		.replaceAll(/root\(([0-9]+)\)\(/g, 'nthrt($1,')
		.replaceAll(/\^\(([0-9]+)\)/g, '^$1')
}
