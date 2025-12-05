import {Equation} from "pimath"
import {
	checkCircle,
	CheckerAbstract,
	CheckerResult,
	CHECKERS,
	checkFormatEquation,
	checkMinMaxEquation,
	checkReducedEquation,
	makeCheckerResult,
	PolynomChecker
} from "@/Checkers"

// const name = "equation"
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
	#circle = false
	#line2d = false
	#line3d = false
	#minmax = false
	#reduced = false
	#slope = false

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
		return checkFormatEquation(value)
	}

	override checkValue(value: string): CheckerResult {

		// Contrôle des données
		const A = new Equation(value)
		const Q = new Equation(this.answer)

		// Must be the same equation.
		const A2 = A.clone().moveLeft().simplify()
		const Q2 = Q.clone().moveLeft().simplify()

		// L'expression de gauche est soit égale, soit opposée.
		if (!A2.isLinearTo(Q2)) {
			return makeCheckerResult("l'équation n'est pas juste.")
		}


		if (this.#line2d || this.#line3d) {
			// Must be:
			// ax+by+c=0
			// ax+c=0
			// by+c=0
			// ax+by=0
			// Allows x=c, y=c
			if (A.right.variables.length > 0) {
				return makeCheckerResult("Toutes les variables doivent être à gauche.")
			}

			if (
				A.left.variables.length >= 2 &&
				!A.right.isZero()
			) {
				// There are two variables : everything must be right
				return makeCheckerResult("l'équation n'est pas correctement formée.")
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
				return makeCheckerResult("Il faut isoler la variable y à gauche.")
			}
		}

		if (this.#minmax) {
			return makeCheckerResult(checkMinMaxEquation(value, this.answer, this.secondaryChecker))
		}

		if (this.#circle) {
			return makeCheckerResult(checkCircle(value, A))
		}

		if (this.#reduced) {
			return makeCheckerResult(checkReducedEquation(A))
		}

		// If all tests passes, it is correct !
		return makeCheckerResult()
	}
}
