import {PiMath} from "pimath/esm"

export function PolynomChecker(options) {
	return {
		format: () => {
			let opts = []

			if (options.includes("f") || options.includes("factors")) {
				opts.push("factorisé")
			} else if (options.includes("d") || options.includes("develop")) {
				opts.push("développé")
			}

			return `polynôme ${opts.join(", ")}`
		},
		check: (expectedAnswer, answer) => {
			let A = new PiMath.Polynom(answer),
				Q = new PiMath.Polynom(expectedAnswer)

			// Polynom must be equals.
			if (!Q.isEqual(A)) {
				return {
					result: false,
					message: "Le polynôme n'est pas le même."
				}
			}

			/** Polynom checker options */

			// Factorized
			if (options.includes("f") || options.includes("factor")) {
				try {
					if (!Q.isFactorized(answer)) {
						return {
							result: false,
							message: "Le polynôme n'est pas (entièrement) factorisé."
						}
					}
				} catch {
					return {
						result: false,
						message: "Le polynôme n'est pas (entièrement) factorisé."
					}
				}
			}

			// Developed
			if (options.includes("d") || options.includes("develop")) {
				if (!Q.isDeveloped(answer)) {
					return {
						result: false,
						message: "Le polynôme n'est pas (entièrement) développé."
					}
				}
			}

			// Reduced
			if (options.includes("r") || options.includes("reduced")) {
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
	}

}
