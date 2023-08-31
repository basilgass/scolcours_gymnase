import {ExactChecker} from "@/Composables/Checkers/ExactChecker"
import {stripFirstCharacter, stripLastCharacter} from "@/Composables/checkersConfig"
import {PiMath} from "pimath/esm"
import {NumberChecker} from "@/Composables/Checkers/NumberChecker"
import {FractionChecker} from "@/Composables/Checkers/FractionChecker"

const name = "vector"
const description = `vector,[paramètres]

**paramètres**
- co=accepte un vecteur colinéaire
- nb= les composantes sont des nombres
- frac= les composantes sont des fractions
`
export function VectorChecker(options) {
	// TODO: vectorchecker is by default using exactChecker. Might also be good to use nb or simple fraction checker
	options = options??[]
	let checker
	if(options.includes("nb")){
		checker = NumberChecker()
	}else if(options.includes("frac")){
		checker = FractionChecker()
	}else{
		checker = ExactChecker()
	}

	return {
		name, description,
		format: () => "Vecteur sous la forme \\(\\begin{pmatrix}a\\\\b\\end{pmatrix}\\)",
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

			if(options.includes("co")){
				// suppose that each values are fraction
				let a, b, k

				for(let i=0; i<values.length; i++){
					a = new PiMath.Fraction(values[i])
					b = new PiMath.Fraction(expectedValues[i])

					if((a.isZero() && b.isNotZero()) || a.isNotZero() && b.isZero()){
						return{
							result: false,
							message: `la ${i+1}e composante est fausse.`
						}
					}

					if(a.isNotZero() && b.isNotZero()){
						if(k===undefined){
							k = new PiMath.Fraction(a.clone().divide(b))
						}else{
							if(a.isNotEqual(b.clone().multiply(k))){
								return {
									result: false,
									message: `la ${i+1}e composante n'est pas proportionnelle`
								}
							}
						}
					}
				}
			}else{
				for(let i=0; i<values.length; i++){
					let result = checker.check(expectedValues[i], values[i])
					if(!result.result){
						return {
							result: false,
							message: `la ${i===0?"1ère":(i+1)+"ème"} composante n'est pas juste.<br>${result.message}`
						}
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
