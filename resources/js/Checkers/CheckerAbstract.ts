import {type CheckerResult, CHECKERS} from "./checker.config"

/**
 * Formatter le résultat d'un checker, en fonction de sa valeur et de son score.
 * @param value
 * @param score
 */
export function makeCheckerResult(value?: string | string[], score?: number): CheckerResult {
	const result = value === undefined || value.length === 0 || score === 1

	const message = result
		? ""
		: typeof value === "string"
			? value
			: value.join('<br/>')

	return {
		message,
		result,
		score: result ? 1 : score === undefined ? 0 : Number(score)
	}
}

export abstract class CheckerAbstract {
	protected constructor(config?: string[] | string) {
		this._description = ""
		this._answer = ""

		if (config === undefined) {
			this._config = []
		} else if (typeof config === "string") {
			this._config = config.split(',')
		} else {
			this._config = [...config]
		}

		this._secondaryChecker = null
	}

	protected _answer: string

	get answer(): string {
		return this._answer
	}

	set answer(value: string) {
		this._answer = value
	}

	protected _config: string[]

	get config(): string[] {
		return this._config
	}

	set config(value: string[]) {
		this._config = value
	}

	protected _description: string

	get description(): string {
		return this._description
	}

	set description(value: string) {
		this._description = value
	}

	protected _secondaryChecker: CheckerAbstract | null

	get secondaryChecker(): CheckerAbstract | null {
		return this._secondaryChecker
	}

	set secondaryChecker(value: CheckerAbstract | null) {
		this._secondaryChecker = value
	}

	protected _type: CHECKERS | undefined

	get type(): CHECKERS | undefined {
		return this._type
	}

	set type(value: CHECKERS) {
		this._type = value
	}

	abstract get format(): string

	check(given: string, expected: string): CheckerResult {
		// Define the answer
		this.answer = expected

		// No value given
		if (given === "") {
			return makeCheckerResult("Veuillez entrer une valeur")
		}

		// The result is exactly what is expected
		if (expected === given) {
			return makeCheckerResult()
		}

		// The format is wrong
		const message = this.checkFormat(given)
		if (message !== "") {
			return makeCheckerResult(message)
		}

		// The value given is a usual error, handled by an @error:<value> <description>
		// The value is not correct
		return this.checkValue(given)
	}

	checkFormat(value: string): string {
		return value ? "" : "Veuillez entrer une réponse"
	}

	abstract checkValue(value: string): CheckerResult

	secondaryCheckValues(values: string[], expectedValues: string[], callback?: (index: number, message: string) => string): CheckerResult {
		const checks: CheckerResult[] = []

		const cb = callback === undefined
			? (index: number, message: string) => `(${index}): ${message}`
			: callback

		if (values.length !== expectedValues.length) {
			return makeCheckerResult("Il n'y a pas le bon nombre de réponses.")
		}

		// Fabrication de tous les résultats
		for (let i = 0; i < values.length; i++) {
			checks.push({
				...this.secondaryChecker.check(values[i], expectedValues[i]),
				index: i
			})
		}

		// Extraction des erreurs
		const errors = checks.filter(check => !check.result)

		// S'il y a des erreurs:
		if (errors.length) {
			return makeCheckerResult(
				errors.map(chk => cb(chk.index, chk.message)).join('<br/>'),
				errors.reduce((a, b) => a < b.score ? a : b.score, 1)
			)
		}

		// Aucune erreur trouvée.
		return makeCheckerResult()
	}
}

