import {CheckerAbstract} from "@/Checkers"
import {braceSorter} from "@/Checkers/checkerHelperFunctions.ts"
import {CHECKERS} from "@/Checkers"
import AsciiMathParser from "@/asciimath2tex.ts"

const name = "solution"
const description = `solution|sol,[paramètres]

**paramètres**
checker = par défaut, c'est le "exact"
`

export class SolutionChecker extends CheckerAbstract {

	constructor(config?: string[] | string) {
		super(config)
		this.type = CHECKERS.SOLUTION
		this.description = description

	}

	get format(): string {
		return `Solution de la forme \\(\\mathcal{S}=\\{3;5\\}\\)<br/>${this.secondaryChecker?.format}`
	}


	override checkValue(value: string): string {
		// Ensemble vide / réelles entre accolades.
		if (isEmptyOrReal(value)) {
			// IR ou (vide) est entre accolade.
			if (value === `{${this.answer}} `) {
				return `${new AsciiMathParser().parse(
					this.answer,
				)} est déjà un ensemble.`
			}

			// De toute façon, ce n'est pas le bonne ensemble de solution.
			return "Ce n'est pas le bon ensemble de solution."
		} else if (isEmptyOrReal(this.answer)) {
			// la réponse donnée n'est pas un cas particulier, mais on devrait l'avoir...
			return "Ce n'est pas le bon ensemble de solution."
		}

		// La réponse donnée et espérée ne sont pas des cas particuliers

		// La solution espérée est avec des accolades
		if (this.answer.startsWith("{")) {
			if (!value.startsWith("{")) {
				// Manque les accolades
				return "L'ensemble des solutions doit avoir des \\(\\{ \\}\\)."
			}

			// vérifie qu'il y a bien le bon nombre d'accolades ouvrantes et fermantes
			if (value.split("{").length !== value.split("}").length) {
				return "Le nombre d'accolades ouvrantes est différent des fermantes."
			}
		}

		// Si la solution est avec intervalle mais pas la réponse.
		if (isWithInterval(this.answer) && !isWithInterval(value)) {
			return isWithInterval(this.answer)
				? "La solution contient un intervalle."
				: "La solution ne contient pas d'intervalle."
		}

		// La solution n'est pas un intervalle.
		if (!isWithInterval(this.answer)) {
			// On devrait être dans la situation : {a;b;c;d}
			const expectedValues = this.answer
				.substring(1, this.answer.length - 1)
				.split(";")

			const givenValues = value
				.substring(1, value.length - 1)
				.split(";")
			let correctAnswers = 0

			expectedValues.forEach((checkValue) => {


				for (let i = 0; i < givenValues.length; i++) {
					if (
						this.secondaryChecker?.check(checkValue, givenValues[i]).result ?? false
					) {
						givenValues.splice(i, 1)
						correctAnswers++
						break
					}
				}
			})

			if (correctAnswers !== expectedValues.length) {
				return `Il y a ${correctAnswers} réponse(s) juste sur ${expectedValues.length}`
			} else {
				return ""
			}
		}

		// La solution peut être du type IR\setminus {a;b;c}

		// Ce n'est pas dans le bon ordre (cas des ensembles, pas des intervalles)
		if (!this.answer.includes("]") && !this.answer.includes("[")) {
			const inBracketsExpectedValue = braceSorter(this.answer),
				inBracketsGivenValue = braceSorter(value)

			return inBracketsGivenValue === inBracketsExpectedValue
				? ""
				: "Une ou plusieurs valeurs sont fausses."
		}

		return ""
	}
}

function isWithInterval(value: string): boolean {
	return value.includes("[") || value.includes("]")
}

function isEmptyOrReal(value: string): boolean {
	return (
		value === "!!" ||
		value === "RR" ||
		value === "RR^**" ||
		value === "RR_+" ||
		value === "RR_+^**" ||
		value === "RR_-" ||
		value === "RR_-^**"
	)
}
