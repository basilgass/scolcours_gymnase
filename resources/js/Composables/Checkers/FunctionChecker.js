import {PiMath} from "pimath/esm"

export function FunctionChecker(options) {
	if(options===undefined){options = []}

	const isDevelopped = (options.includes("d") || options.includes("developped") || options.includes("dev"))

	return {
		name: "function",
		format: () => {
			let opts = []

			if (isDevelopped) {
				// TODO: develop function does not work for now...
				opts.push("développée")
			}

			return `fonction ${opts.join(", ")}`
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
