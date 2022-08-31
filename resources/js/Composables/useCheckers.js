import {PiMath} from "pimath/esm"

export function useCheckers(checkerData) {
	const options = checkerData.split(","),
		checker = options.shift()

	return {
		check: (expectedAnswer, answer)=> {
			switch(checker){
			case "polynom":
				return new PolynomChecker(expectedAnswer, answer, options)
			// case "scn":
			// 	return new ScnNumberChecker(expectedAnswer, answer, options)
			default:
				return new StringChecker(expectedAnswer, answer, options)
			}
		},
		format: formatChecker(checker, options)
	}
}

function formatChecker(checker, options){
	switch(checker){
	case "scn":
		if(isNaN(options)) {
			return "réponse en notation scientifique"
		}else{
			return `réponse en notation scientifique à ${options} chiffre(s) significatif(s)`
		}
	default:
		return ""
	}
}




/**
 *
 * @param expectedAnswer
 * @param answer
 * @param options
 * @constructor
 */
function StringChecker(expectedAnswer, answer, options) {
	if(typeof answer !== "string"){
		answer = answer.toString()
	}
	if(typeof expectedAnswer !== "string"){
		expectedAnswer = expectedAnswer.toString()
	}

	return {
		result: expectedAnswer===answer.toString(),
		message: ""
	}
}


/**
 *
 * @param expectedAnswer
 * @param answer
 * @param options
 * @constructor
 */
function PolynomChecker(expectedAnswer, answer, options = []){
	let A = new PiMath.Polynom(answer),
		Q = new PiMath.Polynom(expectedAnswer)

	// Polynom must be equals.
	if(!Q.isEqual(A)){
		return {
			result: false,
			message: "Le polynôme n'est pas le même."
		}
	}

	/** Polynom checker options */

	// Factorized
	if(options.includes("f") || options.includes("factor")){
		try {
			if (!Q.isFactorized(answer)) {
				return {
					result: false,
					message: "Le polynôme n'est pas (entièrement) factorisé."
				}
			}
		}catch{
			return {
				result: false,
				message: "Le polynôme n'est pas (entièrement) factorisé."
			}
		}
	}

	// Developed
	if(options.includes("d") || options.includes("develop")){
		if(!Q.isDeveloped(answer)){
			return {
				result: false,
				message: "Le polynôme n'est pas (entièrement) développé."
			}
		}
	}

	// Reduced
	if(options.includes("r") || options.includes("reduced")){
		// if(!Q.isReduced(answer)){
		// 	return {
		// 		result: false,
		// 		message: "Le polynôme n'est pas (entièrement) réduit."
		// 	}
		//
		// }
	}

	// If all tests passes, it is correct !
	return {
		result: true,
		message: ""
	}
}
