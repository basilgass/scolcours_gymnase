import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"

// const name = "number"
const description = `number|nb,[paramètres]

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

		// Nombre de décimales (le premier élément est le nombre de décimales)
		if (isNaN(+this.config[0])) {
			this.config = ["0", ...this.config]
		}

		// Valeur strict (donc en given===answer)
		this._isStrict = this.config.includes("s")
	}

	get format(): string {
		return +this.config[0] === 0
			? "réponse numérique"
			: `réponse avec ${this._isStrict ? 'exactement ' : ''}${this.config[0]} chiffre(s) après la virgule`
	}

	override checkFormat(value: string): string {
		const minusCount = (value.match(/-/g) ?? []).length
		if (minusCount > 1) {
			return "Le signe `-` ne peut apparaître qu'une seule fois."
		}
		if (minusCount === 1 && value[0] !== '-') {
			return "Le signe `-` doit être en première position."
		}

		const dotCount = (value.match(/\./g) ?? []).length
		if (dotCount > 1) {
			return "Le point décimal ne peut apparaître qu'une seule fois."
		}
		if (dotCount === 1 && !/\d\./.test(value)) {
			return "Un chiffre doit précéder le point décimal."
		}

		if (isNaN(+value)) {
			return "Veuillez entrer un nombre"
		}

		return ""
	}

	override checkValue(value: string): CheckerResult {
		const nbDigits = +this.config[0]

		// Les valeurs (version numérique)
		const answerValue = +this.answer
		const givenValue = +value

		if (!this._isStrict) {
			if (givenValue === answerValue) {
				// les valeurs (numériques) sont les mêmes  avec la possibilité d'enlever des zéros en trop
				return makeCheckerResult()
			}
		}

		// A partir de là, il ne s'agit plus que d'erreurs.

		if (givenValue === -answerValue) {
			return makeCheckerResult("Peut être un problème de signe...", 0.5)
		}

		// on sépare l'unité et la partie décimale
		const [expectedUnit, expectedDigits] = this.answer.split(".")
		const [unit, digits] = value.split(".")


		// On contrôle la partie entière.
		if (+unit !== +expectedUnit) return makeCheckerResult("La réponse n'est pas juste.")

		// On contrôle la partie décimale

		// Le nombre de chiffres après la virgule n'est pas juste
		const givenDigitsLength = digits?.length ?? 0

		if (givenDigitsLength !== nbDigits) {
			if (nbDigits === 0) {
				return makeCheckerResult("La réponse ne doit pas avoir de décimales.", 0)
			}

			// Crédit partiel : l'utilisateur a donné moins de décimales mais la valeur arrondie est correcte
			const isRoundedCorrectly = givenDigitsLength < nbDigits &&
				givenValue === +(answerValue).toFixed(givenDigitsLength)

			return makeCheckerResult(
				isRoundedCorrectly
					? `Il faut ${nbDigits} chiffre(s) après la virgule.`
					: "La réponse n'est pas juste.",
				isRoundedCorrectly ? 0.7 : 0
			)
		}

		// S'il y a des décimales :
		// Le dernier chiffre n'est pas juste - il s'agit peut-être d'un problème d'arrondi ?
		if (givenDigitsLength) {
			const lastDigit = +digits[digits.length - 1]
			const lastExpectedDigit = +expectedDigits[expectedDigits.length - 1]

			if (Math.abs(lastDigit - lastExpectedDigit) === 1) {
				return makeCheckerResult(
					"Peut être un problème d'arrondi ?",
					0.7
				)
			}
		}

		// Tous les autres cas non gérés.
		return makeCheckerResult("La réponse n'est pas juste.")
	}
}
