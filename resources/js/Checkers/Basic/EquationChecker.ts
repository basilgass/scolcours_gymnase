import {CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"
import {CheckerAbstract} from "@/Checkers/CheckerAbstract"
import {isEquation, isEquationCircle, isEquationPeak, isEquationReduced} from "@/Checkers/checkMathString.ts"

// const name = "equation"
const description = `equation,[paramètres]

**paramètres**
- r=réduit
- c=canonique
- sommet=forme du sommet
- circle=forme centre rayon
`

/** TODO: ajouter les contrôles des formats droites et plans.
 * - 2d=équation de la droite en 2D (ax+by+c=0) ou (ax+by=c)
 * - mx+h=droite du plan, sous la forme y=mx+h
 * - 3d=équation du plan en 3D (ax+by+cz+d=0) ou (ax+by+cz=d)
 */

export class EquationChecker extends CheckerAbstract {
	#isCanonical: boolean
	#isCentreRayon: boolean
	#isPeak: boolean
	#isReduced: boolean

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.EQUATION
		this.description = description

		this.#isReduced =
			this.config.includes("r") ||
			this.config.includes("reduced") ||
			this.config.includes("re")

		this.#isCanonical =
			this.config.includes("c") ||
			this.config.includes("canonical") ||
			this.config.includes("ca")

		this.#isPeak =
			this.config.includes("s") || this.config.includes("sommet")

		this.#isCentreRayon =
			this.config.includes("cercle") || this.config.includes("circle")
	}

	get format(): string {
		const opts = []

		if (this.#isCanonical) {
			opts.push("canonique")
		} else if (this.#isCentreRayon) {
			opts.push(" (forme centre - rayon)")
		} else if (this.#isPeak) {
			opts.push(" (forme du sommet)")
		}

		if (this.#isReduced) {
			opts.push("réduite")
		}

		return `équation ${opts.join(", ")}`
	}

	override checkFormat(value: string): string {
		return isEquation(value)
			? ""
			: "ce n'est pas une équation reconnue."

	}

	override checkValue(value: string): CheckerResult {

		const A = isEquation(value)
		const Q = isEquation(this.answer)

		if (A === false) return makeCheckerResult("ce n'est pas une équation reconnue.")
		if (Q === false) return makeCheckerResult("la réponse n'est pas une équation reconnue.")

		// Must be the same equation.
		const A2 = A.clone().moveLeft().simplify()
		const Q2 = Q.clone().moveLeft().simplify()

		// L'expression de gauche est soit égale, soit opposée.
		if (!A2.isLinearTo(Q2)) {
			return makeCheckerResult("l'équation n'est pas juste.")
		}

		// à ce stade, la fonction correspond au résultat. On doit juste contrôler le format.
		if (this.#isCanonical) {
			if (!A.right.isZero() && !A.left.isZero()) {
				return makeCheckerResult("l'équation n'est pas sous sa forme canonique \\(\\ldots=0\\)", 0.5)
			}
		}

		if (this.#isPeak) {
			return isEquationPeak
				? makeCheckerResult()
				: makeCheckerResult("l'équation n'est pas sous la forme du sommet")
		}

		if (this.#isCentreRayon) {
			return isEquationCircle(value)
				? makeCheckerResult()
				: makeCheckerResult("l'équation n'est pas sous la forme centre-rayon")
		}

		if (this.#isReduced) {
			return isEquationReduced(value)
				? makeCheckerResult()
				: makeCheckerResult("l'équation n'est pas réduite.")
		}

		// If all tests passes, it is correct !
		return makeCheckerResult()
	}
}
