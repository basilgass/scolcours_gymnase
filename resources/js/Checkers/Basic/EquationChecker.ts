import {CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"
import {CheckerAbstract} from "@/Checkers/CheckerAbstract"
import {isEquation, isEquationCircle, isEquationPeak, isEquationReduced} from "@/Checkers/checkMathString.ts"
import {Fraction} from "pimath"

// const name = "equation"
const description = `equation,[paramètres]

**paramètres**
- r=réduit
- c=canonique
- mxh=forme où y est isolé, de type y=mx+h
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
	#isMxh: boolean
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

		this.#isMxh = this.config.includes('mxh') ||
			this.config.includes('mx+h')

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
		} else if (this.#isMxh) {
			opts.push(" (forme pente + ordonnée)")
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

		if (this.#isReduced && isEquationReduced(value)) {
			return makeCheckerResult("l'équation n'est pas réduite.")
		}

		// à ce stade, la fonction correspond au résultat. On doit juste contrôler le format.
		if (this.#isCanonical) {
			if (!A.right.isZero() && !A.left.isZero()) {
				return makeCheckerResult("l'équation n'est pas sous sa forme canonique \\(\\ldots=0\\)", 0.5)
			}

			// Convention d'écriture
			if (value.startsWith('-')) {
				return makeCheckerResult("on évite de commencer par un nombre négatif", 0.9)
			}

			if (
				value.includes('x') && value.includes('y') &&
				value.indexOf('x') > value.indexOf('y')
			) {
				return makeCheckerResult("de manière conventionnelle, on écrit le monôme en \\(x\\) en premier", 0.9)
			}

			const parts = value.split('=').map(part => part.split(/[+-]/)).flat().filter(m => m !== '')
			const xIndex = parts.findIndex(m => m.includes('x'))	// -1 or 0
			if (xIndex > 0) return makeCheckerResult("le monôme en \\(x\\) est conventionnellement placé en première position.", 0.9)
			const yIndex = parts.findIndex(m => m.includes('y'))	// -1 or 0 or 1 si xIndex=0
			if (yIndex > xIndex + 1) return makeCheckerResult("le monôme en \\(y\\) est conventionnellement placé avant la constante.", 0.9)

		}

		if (this.#isMxh) {
			// on cherche la forme y = mx+h
			if (!value.startsWith('y=')) {
				return makeCheckerResult("l'équation commence par \\(y=\\ldots\\)")
			}

			const mxh = value.substring(2)

			if (!isNaN(+mxh)) {
				// cas de type y = 5
				const H = new Fraction(mxh)
				if (!H.isReduced()) return makeCheckerResult("on peut réduire l'ordonnée à l'origine...", 0.5)

				// Pas d'autres contrôles dans ce cas.
				return makeCheckerResult()
			}

			// TODO: possibilité d'améliorer contre les réponses "débiles"s

			try {
				const [m, h] = mxh.split('x').map(v => new Fraction(v.startsWith('+') ? v.substring(1) : v))

				if (!m.isReduced()) {
					return makeCheckerResult("on peut réduire la pente...", 0.5)
				}

				if (!h.isReduced()) {
					return makeCheckerResult("on peut réduire l'ordonnée à l'origine...", 0.5)
				}

			} catch {
				return makeCheckerResult("la pente ou l'ordonnée n'est pas reconnue.")
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


		// If all tests passes, it is correct !
		return makeCheckerResult()
	}
}
