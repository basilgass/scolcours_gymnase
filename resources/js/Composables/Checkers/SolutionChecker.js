import AsciiMathParser from "@/asciimath2tex"

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
			}

			// La réponse donnée n'est pas un cas particulier.


			// Manque les parenthèses
			if (expectedAnswer.startsWith("{") && !isEmptyOrReal(answer)) {
				if (!answer.startsWith("{")) {
					return {
						result: false,
						message: "L'ensemble des solutions doit avoir des \\(\\{\ \\}\\)."
					}
				}

				// vérifie qu'on a bien le bon nombre d'accolade ouvrante et fermante
				if (answer.split("{").length !== answer.split("}").length) {
					return {
						result: false,
						message: "Le nombre d'accolades ouvrantes est différent des fermantes."
					}
				}
			}

			// Ce n'est pas dans le bon ordre (cas des ensembles, pas des intervalles)
			if (!expectedAnswer.includes("]") && !expectedAnswer.includes("[")) {
				let inBracketsExpectedValue = expectedAnswer.split("{")[0] + "{" +
						expectedAnswer.split("{")[1].split("}")[0].split(";").sort().join(";") +
						"}" + (expectedAnswer.split("}")[1] ?? ""),
					inBracketsGivenValue = answer.split("{")[0] + "{" +
						answer.split("{")[1].split("}")[0].split(";").sort().join(";") +
						"}" + (answer.split("}")[1] ?? "")

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
