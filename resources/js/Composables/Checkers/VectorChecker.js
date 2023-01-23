import {ExactChecker} from "@/Composables/Checkers/ExactChecker"
import {stripFirstCharacter, stripLastCharacter} from "@/Composables/useCheckers"

export function VectorChecker(options) {
	// TODO: vectorchecker is by default using exactChecker. Might also be good to use nb checker

	return {
		format: () => "Vecteur d'un point sous la forme \\(\\begin{pmatrix}a\\\\b\\end{pmatrix}\\)",
		check: (expectedAnswer, answer = []) => {
			// Manque les parenthèses
			if(answer[0]!=="(" || answer[answer.length-1]!==")"){
				return {
					result: false,
					message: "des vecteurs commencent et se terminent par des parenthèses"
				}
			}

			// On récupère les valeurs
			let values = answer.split(";"),
				expectedValues = expectedAnswer.split(";")

			if(values.length===1){
				return {
					result: false,
					message: "des vecteurs ont au moins deux valeurs"
				}
			}

			if(values.length!== expectedValues.length){
				return {
					result: false,
					message: "la dimension du vecteur ne correspond pas"
				}
			}

			// remove the parentese from the first and last value.
			values[0] = stripFirstCharacter(values[0])
			values[values.length-1] = stripLastCharacter(values[values.length-1])

			if(expectedValues[0].startsWith("(")){expectedValues[0] = stripFirstCharacter(expectedValues[0])}

			if(expectedValues[expectedValues.length-1].endsWith(")")){
				expectedValues[expectedValues.length-1] = stripLastCharacter(expectedValues[expectedValues.length-1])
			}


			let eChecker = ExactChecker(options)
			for(let i=0; i<values.length; i++){
				let result = eChecker.check(expectedValues[i], values[i])
				if(!result.result){
					return {
						result: false,
						message: `la ${i===0?"1ère":(i+1)+"ème"} composante n'est pas juste.<br>${result.message}`
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
