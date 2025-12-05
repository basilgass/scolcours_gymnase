import {Equation} from "pimath"
import {
	CheckerResult,
	CHECKERS,
	checkFormatEquation,
	checkMinMaxEquation,
	checkReducedEquation,
	makeCheckerResult
} from "@/Checkers"
import {CheckerAbstract} from "@/Checkers/CheckerAbstract"
import {checkCircle} from "@/Checkers/checkerCheckFunctions.ts"

// const name = "equation"
const description = `equation,[paramètres]

**paramètres**
- r=réduit
- c=canonique
- sommet=forme du sommet
- circle=forme centre rayon
`

export class EquationChecker extends CheckerAbstract {
	private isCentreRayon: boolean
	private isReduced: boolean
	private isCanonical: boolean
	private isSommet: boolean

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.EQUATION
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

	override checkFormat(value: string): string {
		return checkFormatEquation(value)

	}

	override checkValue(value: string): CheckerResult {

		const A = new Equation(value)
		const Q = new Equation(this.answer)

		// Must be the same equation.
		const A2 = A.clone().moveLeft(),
			Q2 = Q.clone().moveLeft()
		A2.simplify()
		Q2.simplify()

		// L'expression de gauche est soit égale, soit opposée.
		if (!A2.isLinearTo(Q2)) {
			return makeCheckerResult("l'équation n'est pas juste.")
		}

		if (this.isCanonical) {
			if (!A.right.isZero() && !A.left.isZero()) {
				return makeCheckerResult("l'équation n'est pas sous sa forme canonique.", 0.5)
			}
		}

		if (this.isCentreRayon) {
			return makeCheckerResult(
				checkCircle(value, A)
			)
		}

		if (this.isSommet) {
			return makeCheckerResult(
				checkMinMaxEquation(value, this.answer, this.secondaryChecker)
			)
		}

		if (this.isReduced) {
			return makeCheckerResult(
				checkReducedEquation(A)
			)
		}

		// If all tests passes, it is correct !
		return makeCheckerResult()
	}
}
