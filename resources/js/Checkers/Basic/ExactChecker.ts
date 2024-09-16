import { CheckerAbstract } from "@/Checkers/CheckerAbstract"
import  PiMath from "pimath"

const name = "exact"
const description = `exact

**paramètres**
soft = valeur numérique juste, mais pas sous la forme attendue
`

export class ExactChecker extends CheckerAbstract {
	private isSoft: boolean
	constructor(config: string[] | string) {
		super(config)
		this.name = name
		this.description = description

		this.isSoft = this.config.includes("soft")
	}

	get format(): string {
		return "réponse sous forme exacte, réduite"
	}

	check(
		expected: string,
		given: string,
	): { result: boolean; message: string } {
		// Le résultat est exactement ce qui est demandé
		const stringAnswer = given.toString(),
			asciiAnswer = stringAnswer.startsWith("#")
				? stringAnswer.substring(1)
				: stringAnswer

		if (asciiAnswer === expected.toString()) {
			return {
				result: true,
				message: "",
			}
		}

		// Parse the expected answer as a number
		// Replace "sqrt" by "sqrt(" and ")" by ")", then evaluate
		const expectedExpression = expected.replace(/sqrt([0-9]+)/g, "sqrt($1)")
		const givenExpression = asciiAnswer.replace(/sqrt([0-9]+)/g, "sqrt($1)")

		// Maybe with the reformating, the answers is exactly the same.
		if (expectedExpression === givenExpression) {
			return {
				result: true,
				message: "",
			}
		}

		// Parse the formated answers as a number
		const expectedNumber = new PiMath.NumExp(expectedExpression)
		const givenNumber = new PiMath.NumExp(givenExpression)

		if (expectedNumber.isValid && givenNumber.isValid) {
			if (
				expectedNumber.evaluate({}).toFixed(10) ===
				givenNumber.evaluate({}).toFixed(10)
			) {
				if (this.isSoft) {
					return {
						result: true,
						message: "",
					}
				}

				const message: string[] = [
					"La réponse donnée est juste, mais pas sous la forme attendue.",
				]

				if (given.includes("/sqrt")) {
					message.push("Il y a encore une racine au dénominateur")
				}
				return {
					result: false,
					message: message.join("<br/>"),
				}
			}
		}

		return {
			result: false,
			message: "La réponse donnée n'est pas juste.",
		}
	}
}
