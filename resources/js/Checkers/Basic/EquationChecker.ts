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


export class EquationChecker extends CheckerAbstract {
	#isCanonical: boolean
	#isCenterRadius: boolean
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

		this.#isCenterRadius =
			this.config.includes("cercle") || this.config.includes("circle") || this.config.includes("circ")
	}

	get format(): string {
		const opts = []

		if (this.#isCanonical) {
			opts.push("canonique")
		} else if (this.#isCenterRadius) {
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

			// Les monômes doivent être dans l'ordre x, y, z
			//
			//
			// if (
			// 	value.includes('x') && value.includes('y') &&
			// 	value.indexOf('x') > value.indexOf('y')
			// ) {
			// 	return makeCheckerResult("de manière conventionnelle, on écrit le monôme en \\(x\\) en premier", 0.9)
			// }

			const [left, right] = value.split('=')
			const canonical = left === '0' ? right : left

			const parts = canonical.split(/[+-]/)
				.filter(m => m !== '') // [3x,2y,5] ou [3x^2,2x,4y^2,5y,8]
				.map(getRank)

			// Les parties doivent être dans l'ordre: x^2, x, y^2, y, z^2, z
			if (parts.some((r, i) => i > 0 && r < parts[i - 1])) {
				return makeCheckerResult("conventionnellement, on écrit les variables dans l'ordre alphabétique.")
			}
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

		if (this.#isCenterRadius) {
			return isEquationCircle(value, this.answer.includes('z'))
				? makeCheckerResult()
				: makeCheckerResult("l'équation n'est pas sous la forme centre-rayon")
		}


		// If all tests passes, it is correct !
		return makeCheckerResult()
	}
}

function getRank(monom: string) {
	const letters = ['x', 'y', 'z']

	// pas de lettre : c'est la constante, qui doit avoir le plus grand rang.
	if (!/[xyz]/.test(monom)) {
		return letters.length * 2
	}

	// si ce n'est pas de la forme x ou x^2 ou x^3 ou ... , retourne infini (donc dernier rang)
	const match = monom.match(/^(\d+)?([xyz])(\^(\d+))?$/)
	if (!match) return Infinity

	// on récupère la lettre
	const letter = match[2]
	// on récupère la puissance
	const power = match[4] ? parseInt(match[4]) : 1
	// on récupère l'index de la lettre: x=0, y=1, z=2
	const letterIndex = letters.indexOf(letter)

	// x^2 -> 0
	// x   -> 1
	// y^2 -> 2
	// y   -> 3
	return letterIndex * 2 + (power === 2 ? 0 : 1)
}
