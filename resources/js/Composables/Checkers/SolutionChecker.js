import {asciiToTex} from "@/keyboards"

export function SolutionChecker(options) {
	return {
		format: () => "Solution de la forme \\(\\mathcal{S}=\\{3;5\\}\\)",
		check: (expectedAnswer, answer = []) => {

			if (expectedAnswer === answer) {
				return {
					result: expectedAnswer === answer,
					message: ""
				}
			}

			function isEmptyOrReal(value) {
				return value === "!!" || value === "RR"
			}

			// Ensemble vide / réelles entre accolades.
			if (isEmptyOrReal(expectedAnswer)) {
				if (answer === `{${answer}}`) {
					return {
						result: false,
						message: `${asciiToTex(expectedAnswer)} est déjà un ensemble.`
					}
				}
			}

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
