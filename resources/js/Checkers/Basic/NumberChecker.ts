import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {CheckerResult, CHECKERS} from "../checker.config"

const name = "number",
	description = `number|nb,[paramètres]

**paramètres**
- [1,2,3,4,...]: nombre de chiffres après la virgule
- s (strict): significatif (donc 2.3 ne passe pas pour 2.30)
`

export class NumberChecker extends CheckerAbstract {
	private readonly _isStrict: boolean

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.NUMBER
		this.description = description

		if (isNaN(+this.config[0])) {
			this.config = ["0", ...this.config]
		}

		this._isStrict = this.config.includes("s")
	}

	get format(): string {
		return +this.config[0] === 0
			? "réponse numérique"
			: `réponse avec ${this.config[0]} chiffre(s) après la virgule`
	}

	override checkFormat(value: string): string {
		if (isNaN(+value)) {
			return "Veuillez entrer un nombre"
		}

		return ""
	}

	override checkValue(value: string): CheckerResult {
		const nbDigits = +this.config[0]
		const [expectedUnit, expectedDigits] = this.answer.split(".")
		const nbExpectedDigits = expectedDigits?.length ?? 0

		if (nbExpectedDigits !== nbDigits && this._isStrict) {
			return makeCheckerResult("Problème dans la configuration du checker ou de la réponse")
		}

		if (!this._isStrict) {
			if (+value === +this.answer) {
				return makeCheckerResult()
			}
		}

		const [unit, digits] = value.split(".")
		if (+unit !== +expectedUnit) {
			return makeCheckerResult("la partie entière n'est pas juste.")
		}

		// Le nombre de chiffres après la virgule n'est pas juste
		if (digits.length > nbDigits) {
			return makeCheckerResult(
				`Il faut ${nbDigits} chiffre(s) après la virgule.`,
				(+digits).toFixed(nbDigits) === expectedDigits
			)
		}

		// Le dernier chiffre n'est pas juste - il s'agit peut être d'un problème d'arrondi ?
		const lastDigit = +digits[digits.length - 1],
			lastExpectedDigit = +this.answer[this.answer.length - 1]
		if (Math.abs(lastDigit - lastExpectedDigit) === 1) {
			return makeCheckerResult(
				"Peut être un problème d'arrondi ?",
				true
			)
		}

		return makeCheckerResult("La réponse n'est pas juste.")
	}
}
