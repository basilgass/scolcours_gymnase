import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"
import {Cipher} from "@/helpers/cipher.ts"

// const name = "input"
const description = `input,[paramètres]

**paramètres**
- norm : normaliser le texte automatiquement
`

export class InputChecker extends CheckerAbstract {
	readonly format = "Réponse textuelle"
	#normalize = false

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.INPUT
		this.description = description

		if (this.config.includes('norm')) this.#normalize = true
	}

	checkValue(value: string): CheckerResult {
		if (this.#normalize) {
			const normalizedAnswer = Cipher._normalize(this.answer)
			const normalizedGiven = Cipher._normalize(value)

			// Si normalisé, on a la même réponse : OK
			if (normalizedAnswer === normalizedGiven) {
				return makeCheckerResult()
			}
		}
		return makeCheckerResult("La réponse n'est pas correcte")
	}
}
