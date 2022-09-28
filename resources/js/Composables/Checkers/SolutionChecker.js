import {asciiToTex} from "@/keyboards"

export function SolutionChecker(options) {

	return {
		format: () => "Solution de la forme \\(\\mathcal{S}=\\{3;5\\}\\)",
		check: (expectedAnswer, answer = []) => {

			if(expectedAnswer===answer){
				return {
					result: expectedAnswer===answer,
					message: ""
				}
			}

			function isEmptyOrReal(value){
				return value==="!!" || value === "RR"
			}

			// Ensemble vide / réelles entre accolades.
			if(isEmptyOrReal(expectedAnswer)){
				if(answer===`{${answer}}`){
					return {
						result: false,
						message: `${asciiToTex(expectedAnswer)} est déjà un ensemble.`
					}
				}
			}

			// Manque les parenthèses
			if(expectedAnswer.startsWith("{") && !isEmptyOrReal(answer)){
				if(!answer.startsWith("{")) {
					return {
						result: false,
						message: "L'ensemble des solutions doit avoir des \\(\\{\ \\}\\)."
					}
				}

				// vérifie qu'on a bien le bon nombre d'accolade ouvrante et fermante
				if(answer.split("{").length!==answer.split("}").length){
					return {
						result: false,
						message: "Le nombre d'accolades ouvrantes est différent des fermantes."
					}
				}
			}

			// Ce n'est pas dans le bon ordre (cas des ensembles, pas des intervalles)
			if(!expectedAnswer.includes("]") && !expectedAnswer.includes("[")){
				const internalExpectedValue = expectedAnswer.replace("{", "").replace("}", "").split(";").sort().join(";"),
					internalAnswer = answer.replace("{", "").replace("}", "").split(";").sort().join(";")

				return {
					result: internalAnswer===internalExpectedValue,
					message: internalAnswer===internalExpectedValue?"":"Une ou plusieurs valeurs sont fausses."
				}
			}

			return {
				result: false,
				message: ""
			}
		}
	}
}
