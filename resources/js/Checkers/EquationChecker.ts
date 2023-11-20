import { PiMath } from "pimath/esm"
import { CheckerBase } from "@/Checkers/CheckerBase"
import { customCheck } from "@/Composables/checkersConfig"

const name = "equation"
const description = `equation,[paramètres]

**paramètres**
- r=réduit
- c=canonique
- sommet=forme du sommet
- circle=forme centre rayon
`

export class EquationChecker extends CheckerBase {
	private isCentreRayon: boolean
	private isReduced: boolean
	private isCanonical: boolean
	private isSommet: boolean

	constructor(config: string[] | string) {
		super(config)
		this.name = name
		this.description = description

		this.isReduced =
			this.config.includes("r") ||
			this.config.includes("reduced") ||
			this.config.includes("re")
		this.isCanonical =
			this.config.includes("c") ||
			this.config.includes("canonical") ||
			this.config.includes("ca")
		this.isSommet =
			this.config.includes("s") || this.config.includes("sommet")
		this.isCentreRayon =
			this.config.includes("cercle") || this.config.includes("circle")
	}

	get format(): string {
		const opts = []

		if (this.isCanonical) {
			opts.push("canonique")
		} else if (this.isCentreRayon) {
			opts.push(" (forme centre - rayon)")
		} else if (this.isSommet) {
			opts.push(" (forme du sommet)")
		}

		if (this.isReduced) {
			opts.push("réduite")
		}

		return `équation ${opts.join(", ")}`
	}

	check(
		expected: string,
		given: string,
	): { result: boolean; message: string } {
		if (!given.includes("=")) {
			return {
				result: false,
				message: "il manque un signe d'égalité.",
			}
		}

		// If expected and given are the same, it is correct.
		if (expected === given) {
			return {
				result: true,
				message: "",
			}
		}

		let A, Q

		try {
			A = new PiMath.Equation(given)
		} catch {
			return {
				result: false,
				message: "l'équation n'est pas correctement formée.",
			}
		}
		try {
			Q = new PiMath.Equation(expected)
		} catch {
			return {
				result: false,
				message: "la réponse n'est pas correctement formée.",
			}
		}

		// Must be the same equation.
		const A2 = A.clone().moveLeft(),
			Q2 = Q.clone().moveLeft()
		A2.simplify()
		Q2.simplify()

		// L'expression de gauche est soit égale, soit opposée.
		if (!A2.isLinearTo(Q2)) {
			return {
				result: false,
				message: "l'équation n'est pas juste.",
			}
		}

		if (this.isCanonical) {
			if (!A.right.isZero() && !A.left.isZero()) {
				return {
					result: false,
					message: "l'équation n'est pas sous sa forme canonique.",
				}
			}
		}

		if (this.isCentreRayon) {
			// TODO: Check que c'est l'équation sous la forme centre - rayon.
			// x^2  + (y-b)^2 = r^2
			// (x-a)^2 + y^2 = r^2
			// x^2+y^2 = r^2
			// (x-a)^2 + (y-b)^2 = r^2

			// Must be a polynom of degree 2 in x and y.
			if (A.degree("x").value !== 2 || A.degree("y").value !== 2) {
				return {
					result: false,
					message: "L'équation n'a pas les bons degrés.",
				}
			}

			// One part of the equation must be of degree zero.
			let center = ""

			if (
				A.left.degree("x").value === 2 &&
				A.right.degree("x").isZero() &&
				A.left.degree("y").value === 2 &&
				A.right.degree("y").isZero()
			) {
				center = given.split("=")[0]
			} else if (
				A.right.degree("x").value === 2 &&
				A.left.degree("x").isZero() &&
				A.right.degree("y").value === 2 &&
				A.left.degree("y").isZero()
			) {
				center = given.split("=")[1]
			} else {
				return {
					result: false,
					message:
						"L'équation n'est pas correctement formée pour la forme centre - rayon.",
				}
			}

			// radius should be ok and does not need more checks
			// center must be correctly formed.
			// Transform ^(2) into ^2
			center = center.replaceAll("^(2)", "^2")

			if (
				center.match(/\(x[+-][0-9/]+\)\^2\+\(y[+-][0-9/]+\)\^2/) ||
				center.match(/x\^2\+\(y[+-][0-9/]+\)\^2/) ||
				center.match(/\(x[+-][0-9/]+\)\^2\+y\^2/) ||
				center.match(/x\^2\+y\^2/)
			) {
				return { result: true, message: "" }
			} else {
				return {
					result: false,
					message: "L'équation n'est pas dans le bon format.",
				}
			}
		}

		if (this.isSommet) {
			// Come from Polynom checker.
			// Left or right part must be correctly formed.
			// y = [a](x-b)^2[ + c]
			// y = [a]x^2[ + c]
			const [left, right] = given.split("="),
				[eLeft, eRight] = expected.split("=")

			const polynomY = left === "y" ? left : right,
				polynomSommet = left === "y" ? right : left,
				expectedSommet = eLeft === "y" ? eRight : eLeft

			if (polynomY !== "y") {
				return {
					result: false,
					message: "Un côté de l'équation doit juste être (y)",
				}
			}

			return customCheck("polynom,s", expectedSommet, polynomSommet)
		}

		if (this.isReduced) {
			const lcmL = A.left.commonMonom().coefficient.value,
				lcmR = A.right.commonMonom().coefficient.value,
				lcm = PiMath.Numeric.lcm(lcmL, lcmR)

			if (lcm !== 1) {
				return {
					result: false,
					message: "l'équation n'est pas réduite.",
				}
			}
		}

		// If all tests passes, it is correct !
		return {
			result: true,
			message: "",
		}
	}
}
