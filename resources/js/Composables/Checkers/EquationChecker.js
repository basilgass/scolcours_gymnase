import {PiMath} from "pimath/esm"

export function EquationChecker(options) {
	if(options===undefined){options = []}

	const isReduced = (options.includes("r") || options.includes("reduced")),
		isCanonical = options.includes("c") || options.includes("canonical")

	return {
		format: () => {
			let opts = []

			if (isCanonical) {
				opts.push("canonique")
			}
			if (isReduced) {
				opts.push("réduite")
			}

			return `équation ${opts.join(", ")}`
		},
		check: (expectedAnswer, answer) => {
			let A = new PiMath.Equation(answer),
				Q = new PiMath.Equation(expectedAnswer)

			if(isCanonical){
				if(!A.right.isZero() && !A.left.isZero()){
					return {
						result: false,
						message: "le polynôme n'est pas sous sa forme canonique."
					}
				}
			}

			// Must be the same equation.
			const A2 = A.clone().moveLeft(), Q2 = Q.clone().moveLeft()
			A2.simplify()
			Q2.simplify()
			if(!A2.left.isEqual(Q2.left)){
				return {
					result: false,
					message: "le polynôme n'est pas juste."
				}
			}

			if(isReduced){
				const lcmL = A.left.commonMonom().coefficient.value,
					lcmR = A.right.commonMonom().coefficient.value,
					lcm = PiMath.Numeric.lcm(lcmL, lcmR)

				if(lcm!==1){
					return {
						result: false,
						message: "le polynôme n'est pas réduit."
					}

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
