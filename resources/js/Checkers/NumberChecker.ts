import { CheckerBase } from "@/Checkers/CheckerBase"

const name = "number",
	description = `number|nb,[paramètres]

**paramètres**
- [1,2,3,4,...]: nombre de chiffres après la virgule
- s (soft): significatif (donc 2.3 ne passe pas pour 2.30)
`

export class NumberChecker extends CheckerBase {
	constructor(config?: string[] | string) {
		super(config)
		this.name = name
		this.description = description
		if (isNaN(+this.config[0])) {
			this.config = ["0", ...this.config]
		}
	}

	get format(): string {
		return +this.config[0] === 0
			? "réponse numérique"
			: `réponse avec ${this.config[0]} chiffre(s) après la virgule`
	}

	check(
		expected: string,
		given: string,
	): { result: boolean; message: string } {
		const nbDigits = +this.config[0],
			nbExpectedDigits = (expected.split(".")[1] || []).length
		if (nbExpectedDigits !== nbDigits) {
			return {
				result: false,
				message:
					"Problème dans la configuration du checker ou de la réponse",
			}
		}

		// Le résultat est exactement ce qui est demandé
		if (given === expected) {
			return {
				result: true,
				message: "",
			}
		}

		if (this.config.includes("s") || this.config.includes("soft")) {
			if (+given === +expected) {
				return {
					result: true,
					message: "",
				}
			}
		}

		// Nombre de décimales de la réponse
		const crtDigits: string = given.split(".")[1] || ""

		// Le nombre de chiffres après la virgule n'est pas juste
		if (crtDigits.length !== nbDigits) {
			return {
				result: false,
				message: `Il faut ${nbDigits} chiffre(s) après la virgule.`,
			}
		}

		// Le dernier chiffre n'est pas juste - il s'agit peut être d'un problème d'arrondi ?
		const lastDigit = +crtDigits[crtDigits.length - 1],
			lastExpectedDigit = +expected[expected.length - 1]
		if (Math.abs(lastDigit - lastExpectedDigit) === 1) {
			return {
				result: false,
				message: "Peut être un problème d'arrondi ?",
			}
		}

		return {
			result: false,
			message: "",
		}
	}
}
