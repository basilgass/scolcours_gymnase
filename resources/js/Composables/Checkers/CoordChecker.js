import {ExactChecker} from "@/Composables/Checkers/ExactChecker"

export function CoordChecker(options) {
	// TODO: coordchecker is by default using exactChecker. Might also be good to use nb checker

	return {
		format: () => "Coordonnées d'un point sous la forme \\((a;b)\\)",
		check: (expectedAnswer, answer = []) => {
			// Manque les parenthèses
			if(answer[0]!=="(" || answer[answer.length-1]!==")"){
				return {
					result: false,
					message: "des coordonnées commencent et se terminent par des parenthèses"
				}
			}

			// On récupère les valeurs
			let values = answer.split(";"),
				expectedValues = expectedAnswer.split(",")
			if(values.length===1){
				return {
					result: false,
					message: "des coordonnées ont au moins deux valeurs, séparées par un \\(;\\)"
				}
			}

			if(values.length!== expectedValues.length){
				return {
					result: false,
					message: "la dimension de la coordonnées ne correspond pas"
				}
			}

			// remove the parentese from the first and last value.
			values[0] = values[0].substring(1)
			values[values.length-1] = values[values.length-1].substring(0, values[values.length-1].length-1)

			let eChecker = ExactChecker(options)
			for(let i=0; i<values.length; i++){
				let result = eChecker.check(expectedValues[i], values[i])
				if(!result.result){
					return {
						result: false,
						message: `la ${i===0?"1ère":(i+1)+"ème"} coordonnée n'est pas juste.<br>${result.message}`
					}
				}
			}

			// tous les tests sont passés ! La réponse est donc juste
			return {
				result: true,
				message: ""
			}
		}
	}
}
