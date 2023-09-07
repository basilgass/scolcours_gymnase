import {PiMath} from "pimath/esm"

const name = "equation"
const description = `equation,[paramètres]

**paramètres**
- r=réduit
- c=canonique
- sommet=forme du sommet
- circle=forme centre rayon
`

export function EquationChecker(options) {
	options = options??[]

	const isReduced = (options.includes("r") || options.includes("reduced") || options.includes("re")),
		isCanonical = (options.includes("c") || options.includes("canonical") || options.includes("ca")),
		isSommet = (options.includes("sommet")),
		isCentreRayon = (options.includes("cercle")) || (options.includes("circle"))

	return {
		name, description,
		format: () => {
			let opts = []

			if (isCanonical) {
				opts.push("canonique")
			} else if (isCentreRayon) {
				opts.push(" (forme centre - rayon)")
			}

			if (isReduced) {
				opts.push("réduite")
			}


			return `équation ${opts.join(", ")}`
		},
		check: (expectedAnswer, answer) => {
			if (!answer.includes("=")) {
				return {
					result: false,
					message: "il manque un signe d'égalité."
				}
			}

			let A, Q

			try {
				A = new PiMath.Equation(answer)
			} catch {
				return {
					result: false,
					message: "l'équation n'est pas correctement formée."
				}
			}
			try {
				Q = new PiMath.Equation(expectedAnswer)
			} catch {
				return {
					result: false,
					message: "la réponse n'est pas correctement formée."
				}
			}

			// Must be the same equation.
			const A2 = A.clone().moveLeft(), Q2 = Q.clone().moveLeft()
			A2.simplify()
			Q2.simplify()

			// L'expression de gauche est soit égale, soit opposée.
			if (!A2.isLinearTo(Q2)) {
				return {
					result: false,
					message: "l'équation n'est pas juste."
				}
			}

			if (isCanonical) {
				if (!A.right.isZero() && !A.left.isZero()) {
					return {
						result: false,
						message: "l'équation n'est pas sous sa forme canonique."
					}
				}
			}

			if (isCentreRayon) {
				// TODO: Check que c'est l'équation sous la forme centre - rayon.
				// x^2  + (y-b)^2 = r^2
				// (x-a)^2 + y^2 = r^2
				// x^2+y^2 = r^2
				// (x-a)^2 + (y-b)^2 = r^2

				// Must be a polynom of degree 2 in x and y.
				if (A.degree("x").value !== 2 || A.degree("y").value !== 2) {
					return {result: false, message: "L'équation n'a pas les bons degrés."}
				}

				// One part of the equation must be of degree zero.
				let center = "", radius = ""
				if (
					A.left.degree("x").value === 2 && A.right.degree("x").isZero() &&
					A.left.degree("y").value === 2 && A.right.degree("y").isZero()
				) {
					[center, radius] = answer.split("=")
				} else if (
					A.right.degree("x").value === 2 && A.left.degree("x").isZero() &&
					A.right.degree("y").value === 2 && A.left.degree("y").isZero()
				) {
					[radius, center] = answer.split("=")
				} else {
					return {
						result: false,
						message: "L'équation n'est pas correctement formée pour la forme centre - rayon."
					}
				}

				// radius should be ok and does not need more checks
				// center must be correctly formed.
				// Transform ^(2) into ^2
				center = center.replaceAll("^(2)", "^2")

				if (center.match(/\(x[+-][0-9]+\)\^2\+\(y[+-][0-9]+\)\^2/) ||
					center.match(/x\^2\+\(y[+-][0-9]+\)\^2/) ||
					center.match(/\(x[+-][0-9]\+\)\^2+y\^2/) ||
					center.match(/\(x\^2\+y\^2/)
				) {
					return {result: true, message: ""}
				} else {
					return {result: false, message: "L'équation n'est pas dans le bon format."}
				}
			}


			if (isReduced) {
				const lcmL = A.left.commonMonom().coefficient.value,
					lcmR = A.right.commonMonom().coefficient.value,
					lcm = PiMath.Numeric.lcm(lcmL, lcmR)

				if (lcm !== 1) {
					return {
						result: false,
						message: "l'équation n'est pas réduite."
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
