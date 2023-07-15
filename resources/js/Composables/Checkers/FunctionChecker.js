import {PiMath} from "pimath/esm"

export function FunctionChecker(options) {
	if(options===undefined){options = []}

	const isReduced = (options.includes("r") || options.includes("reduced") || options.includes("re"))

	return {
		name: "function",
		format: () => {
			let opts = []

			if (isReduced) {
				// TODO: reduced function does not work for now...
				opts.push("réduite")
			}

			return `équation ${opts.join(", ")}`
		},
		check: (expectedAnswer, answer) => {
			let A = new PiMath.Polynom(answer),
				Q = new PiMath.Polynom(expectedAnswer)

			// Must be the same equation.
			if(!A.isEqual(Q)){
				return {
					result: false,
					message: "la fonction n'est pas juste."
				}
			}

			// If all tests passes, it is correct !
			return {
				result: true,
				message: ""
			}
		}
	}
}
