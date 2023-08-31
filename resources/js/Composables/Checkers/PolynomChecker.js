import {PiMath} from "pimath/esm"

const name = "polynom"
const description = `polynom,[paramètres]

**paramètres**
- f=factorisé
- F=entièrement factorisé \\((2x+4)(x-3)\\) ne passe pas.
- d=développé
`

export function PolynomChecker(options) {
	options = options ?? []

	return {name, description,
		format: () => {
			let opts = []

			if (options.includes("f") || options.includes("factors")) {
				opts.push("factorisé")
			} else if (options.includes("F") || options.includes("FACTORS")) {
				opts.push("entièrement factorisé")
			} else if (options.includes("d") || options.includes("develop")) {
				opts.push("développé")
			}

			return `polynôme ${opts.join(", ")}`
		},
		check: (expectedAnswer, answer) => {
			// Make sur the polynom is constructable
			let A, Q

			try{
				A = new PiMath.Polynom(answer)
				Q = new PiMath.Polynom(expectedAnswer)
			}catch{
				return {
					result: false,
					message: "Le polynôme n'est pas formé correctement."
				}
			}



			// Polynom must be equals.
			if (!Q.isEqual(A)) {
				return {
					result: false,
					message: "Le polynôme n'est pas le même."
				}
			}

			/** Polynom checker options */
			// Factorized
			if (options.includes("f") || options.includes("factor") || options.includes("F") || options.includes("FACTORS")) {
				try {
					if (!A.isFactorized(answer, options.includes("f") || options.includes("factor"))) {
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
				if (!A.isDeveloped(answer)) {
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
