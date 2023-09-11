import AsciiMathParser from "@/asciimath2tex"
import {braceSorter} from "@/helpers/helperFunctions"

const name = "solution"
const description = `solution|sol,[paramètres]

**paramètres**
checker = par défaut, c'est le "exact"
`
export function SolutionChecker(options) {
	options = options ?? []

	return {
		name, description,
		format: () => "Solution de la forme \\(\\mathcal{S}=\\{3;5\\}\\)",
		check: (expectedAnswer, answer = []) => {

			// C'est exactement la bonne valeur.
			if (expectedAnswer === answer) {
				return {
					result: expectedAnswer === answer,
					message: ""
				}
			}

			// Ensemble vide / réelles entre accolades.
			if (isEmptyOrReal(answer)) {
				if (answer === `{${expectedAnswer}}`) {
					return {
						result: false,
						message: `${ new AsciiMathParser().parse(expectedAnswer)} est déjà un ensemble.`
					}
				}

				return {result: false, message: "Ce n'est pas le bon ensemble de solution."}
			}else if(isEmptyOrReal(expectedAnswer)){
				// la réponse donnée n'est pas un cas particulier, mais on devrait l'avoir...
				return {
					result: false,
					message: "Ce n'est pas le bon ensemble de solution."
				}
			}


			// La réponse donnée et espérée ne sont pas des cas particuliers

			// La solution espérée est avec des accolades
			if (expectedAnswer.startsWith("{")) {
				if (!answer.startsWith("{")) {
					// Manque les accolades
					return {
						result: false,
						message: "L'ensemble des solutions doit avoir des \\(\\{\ \\}\\)."
					}
				}

				// vérifie qu'il y a bien le bon nombre d'accolades ouvrantes et fermantes
				if (answer.split("{").length !== answer.split("}").length) {
					return {
						result: false,
						message: "Le nombre d'accolades ouvrantes est différent des fermantes."
					}
				}

			}

			// La solution peut être du type IR\setminus {a;b;c}

			// Ce n'est pas dans le bon ordre (cas des ensembles, pas des intervalles)
			if (!expectedAnswer.includes("]") && !expectedAnswer.includes("[")) {
				let inBracketsExpectedValue = braceSorter(expectedAnswer),
					inBracketsGivenValue = braceSorter(answer)

				return {
					result: inBracketsGivenValue === inBracketsExpectedValue,
					message: inBracketsGivenValue === inBracketsExpectedValue ? "" : "Une ou plusieurs valeurs sont fausses."
				}
			}

			return {
				result: false,
				message: ""
			}
		}
	}
}

function isEmptyOrReal(value) {
	return value === "!!" ||
		value === "RR" ||
		value === "RR^**" ||
		value === "RR_+" ||
		value === "RR_+^**" ||
		value === "RR_-" ||
		value === "RR_-^**"
}
