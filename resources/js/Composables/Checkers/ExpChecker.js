import {splitAtSigns, splitIfOutsideParentheses} from "@/helpers/helperFunctions"

const name = "exp"
const description = `exp,[paramètres]

**paramètres**
aucun
`

export function ExpChecker(options) {
	options = options ?? []

	return {
		name, description,
		format: () => {
			return "polynôme avec des exponentielles"
		},
		check: (expectedAnswer, answer = []) => {
			// Le résultat est exactement ce qui est demandé
			const stringAnswer = answer.toString(),
				asciiAnswer = stringAnswer.startsWith("#") ? stringAnswer.substring(1) : stringAnswer

			if (asciiAnswer === expectedAnswer.toString()) {
				return {
					result: true,
					message: ""
				}
			}

			// plusieurs possible:
			// ae^(polynom)
			// ae^(polynom) + be^(polynom)
			// ae^(polynom) + be^(polynom) / ae^(polynom) + be^(polynom)

			// on coupe en numérateur / dénominateur
			// on recherche un endroit qui n'est pas entre parenthèse.
			let [N, D] = splitIfOutsideParentheses(answer),
				[eN, eD] = splitIfOutsideParentheses(expectedAnswer)

			if(D===undefined && eD !== undefined){
				return {
					result: false,
					message: "Un dénominateur est attendu..."
				}
			}

			if(D!==undefined && eD === undefined){
				return {
					result: false,
					message: "Aucun dénominateur n'est prévu dans cette réponse."
				}
			}

			const resultatNumerateur = expCompare(eN, N)

			if(!resultatNumerateur.result)return resultatNumerateur

			// On contrôle les dénominateurs
			if(D!==undefined && eD !== undefined){
				return expCompare(eD, D)
			}

			return {
				result: true,
				message: ""
			}
		}
	}
}

function expCompare(eValue, value){
	// On contrôle maintenant les numérateurs
	let elements_N = splitAtSigns(value),
		elements_eN = splitAtSigns(eValue)
	if(elements_eN.length!==elements_N.length){
		return {
			result: false,
			message: "il n'y a pas le bon nombre d'éléments au numérateur"
		}
	}

	// Chaque élément est maintenant de la forme
	// (polynom)e^(polynom)
	let missing_N = []
	elements_N.forEach((element, index) => {
		if(elements_eN.includes(element)){
			elements_eN = elements_eN.splice(index, 1)
		}
	})

	if(elements_eN.length>0){
		// Il faut encore contrôler chaque morceau comme des polynômes rationnels.
		// TODO: exp : on doit contrôler que (polynom)e^(polynom) peut être formaté différemment
		const cnt = elements_eN.length
		return {
			result: false,
			message: `Il y a ${cnt} élément${cnt===1?"":"s"} qui ${cnt===1?"est":"sont"} faux.`
		}
	}

	return {
		result: true,
		message: ""
	}
}
