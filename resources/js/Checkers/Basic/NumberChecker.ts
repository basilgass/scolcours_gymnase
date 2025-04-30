import {CheckerAbstract} from "../CheckerAbstract";
import {CHECKERS} from "../checker.config";

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

	override checkValue(value: string): string {
		const nbDigits = +this.config[0],
			nbExpectedDigits = (this.answer.split(".")[1] || []).length

		if (nbExpectedDigits !== nbDigits && this._isStrict) {
			return "Problème dans la configuration du checker ou de la réponse"
		}

		if (!this._isStrict) {
			if (+value === +this.answer) {
				return ""
			}
		}

		// Nombre de décimales de la réponse
		const crtDigits: string = value.split(".")[1] || ""

		// Le nombre de chiffres après la virgule n'est pas juste
		if (crtDigits.length !== nbDigits) {
			return `Il faut ${nbDigits} chiffre(s) après la virgule.`
		}

		// Le dernier chiffre n'est pas juste - il s'agit peut être d'un problème d'arrondi ?
		const lastDigit = +crtDigits[crtDigits.length - 1],
			lastExpectedDigit = +this.answer[this.answer.length - 1]
		if (Math.abs(lastDigit - lastExpectedDigit) === 1) {
			return "Peut être un problème d'arrondi ?"
		}

		return	"La réponse n'est pas juste."
	}
}
