import {Equation, Numeric} from "pimath"
import {CheckerAbstract} from "../CheckerAbstract";
import {PolynomChecker} from "./PolynomChecker";
import {CHECKERS} from "../checker.config";

const name = "equation"
const description = `equation,[paramètres]

**paramètres**
- r=réduit
- circle=forme centre rayon
- 2d=équation de la droite en 2D (ax+by+c=0)
- mx+h=droite du plan, sous la forme y=mx+h
- sommet=forme du sommet
- 3d=équation du plan en 3D (ax+by+cz+d=0)
`

export class CartesianChecker extends CheckerAbstract {
	#reduced = false
	#circle = false
	#line2d = false
	#slope = false
	#minmax = false
	#line3d = false

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.CARTESIAN
		this.description = description

		this.#reduced =
			this.config.includes("r") ||
			this.config.includes("reduced") ||
			this.config.includes("re")
		this.#circle =
			this.config.includes("circle")
		this.#line2d =
			this.config.includes("2d")
		this.#slope =
			this.config.includes("mx+h")
		this.#minmax =
			this.config.includes("minmax")
		this.#line3d =
			this.config.includes("3d")

		this.secondaryChecker = new PolynomChecker(['s'])
	}

	get format(): string {
		const opts = []

		if (this.#circle) {
			opts.push("du cercle, forme centre - rayon")
		}

		if (this.#line2d) {
			opts.push("de la droite du plan, forme ax+by+c=0")
		}
		if (this.#slope) {
			opts.push("de la droite du plan, forme y=mx+h")
		}
		if (this.#minmax) {
			opts.push("de la droite du plan, forme du sommet")
		}
		if (this.#line3d) {
			opts.push("de l'équation du plan, forme ax+by+cz+d=0")
		}

		if (this.#reduced) {
			opts.push("réduite")
		}

		return `équation ${opts.join(", ")}`
	}


	override checkFormat(value: string): string {
		if (!value.includes("=")) {
			return "il manque un signe d'égalité."
		}

		try {
			new Equation(value)
		} catch {
			return "l'équation n'est pas correctement formée."
		}

		return ""
	}

	override checkValue(value: string): string {

		// Contrôle des données
		const A = new Equation(value)
		const Q = new Equation(this.answer)

		// Must be the same equation.
		const A2 = A.clone().moveLeft(),
			Q2 = Q.clone().moveLeft()
		A2.simplify()
		Q2.simplify()

		// L'expression de gauche est soit égale, soit opposée.
		if (!A2.isLinearTo(Q2)) {
			return "l'équation n'est pas juste."
		}



		if (this.#line2d || this.#line3d) {
			// Must be:
			// ax+by+c=0
			// ax+c=0
			// by+c=0
			// ax+by=0
			// Allows x=c, y=c
			if (A.right.variables.length > 0) {
				return  "Toutes les variables doivent être à gauche."
			}

			if (
				A.left.variables.length >= 2 &&
				!A.right.isZero()
			) {
				// There are two variables : everything must be right
				return  "l'équation n'est pas correctement formée."
			}
		}

		if (this.#slope) {
			// Must be:
			// y=mx+h
			// y=h
			// y=mx
			// Allows x=h, y=h
			if (
				(A.left.variables.length === 2) ||
				(A.left.variables.length === 1 && !A.left.monoms[0].coefficient.isOne())
			) {
				// There are two variables : everything must be right
				return "Il faut isoler la variable y à gauche."
			}
		}

		if (this.#minmax) {
			// Come from Polynom checker.
			// Left or right part must be correctly formed.
			// y = [a](x-b)^2[ + c]
			// y = [a]x^2[ + c]
			const [left, right] = value.split("="),
				[eLeft, eRight] = this.answer.split("=")

			const polynomY = left === "y" ? left : right,
				polynomSommet = left === "y" ? right : left,
				expectedSommet = eLeft === "y" ? eRight : eLeft

			if (polynomY !== "y") {
				return "Un côté de l'équation doit juste être (y)"
			}

			return this.secondaryChecker?.check(expectedSommet, polynomSommet).message ?? ""
		}

		if (this.#circle) {
			// TODO: Check que c'est l'équation sous la forme centre - rayon.
			// x^2  + (y-b)^2 = r^2
			// (x-a)^2 + y^2 = r^2
			// x^2+y^2 = r^2
			// (x-a)^2 + (y-b)^2 = r^2

			// Must be a polynom of degree 2 in x and y.
			if (A.degree("x").value !== 2 || A.degree("y").value !== 2) {
				return "L'équation n'a pas les bons degrés."
			}

			// One part of the equation must be of degree zero.
			let center = ""

			if (
				A.left.degree("x").value === 2 &&
				A.right.degree("x").isZero() &&
				A.left.degree("y").value === 2 &&
				A.right.degree("y").isZero()
			) {
				center = value.split("=")[0]
			} else if (
				A.right.degree("x").value === 2 &&
				A.left.degree("x").isZero() &&
				A.right.degree("y").value === 2 &&
				A.left.degree("y").isZero()
			) {
				center = value.split("=")[1]
			} else {
				return "L'équation n'est pas correctement formée pour la forme centre - rayon."
			}

			// radius should be ok and does not need more checks
			// center must be correctly formed.
			// Transform ^(2) into ^2
			center = center.replaceAll("^(2)", "^2")

			if (
				center.match(/\(x[+-][0-9/]+\)\^2\+\(y[+-][0-9/]+\)\^2/) ||
				center.match(/x\^2\+\(y[+-][0-9/]+\)\^2/) ||
				center.match(/\(x[+-][0-9/]+\)\^2\+y\^2/) ||
				center === "x^2+y^2" ||
				center === "y^2+x^2"
			) {
				return ""
			} else {
				return "L'équation n'est pas dans le bon format."
			}
		}

		if (this.#reduced) {
			const lcmL = A.left.commonMonom().coefficient.value,
				lcmR = A.right.commonMonom().coefficient.value,
				lcm = Numeric.lcm(lcmL, lcmR)

			if (lcm !== 1) {
				return "l'équation n'est pas réduite."
			}
		}

		// If all tests passes, it is correct !
		return ""
	}
}
