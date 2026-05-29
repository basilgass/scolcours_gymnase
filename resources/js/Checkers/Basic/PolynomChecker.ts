import {CheckerAbstract, CheckerResult, CHECKERS, checkPolynomIsFactorized, makeCheckerResult} from "@/Checkers"
import {isPolynom, isPolynomPeak} from "@/Checkers/checkMathString.ts"

// const name = "polynom"
const description = `polynom,[paramètres]

**paramètres**
- f=factorisé
- F=entièrement factorisé \\((2x+4)(x-3)\\) ne passe pas.
- d=développé
- s=forme du sommet \\(a(x-b)^2+c\\)
`

export class PolynomChecker extends CheckerAbstract {
	#factorised: false | 'f' | 'F' // f = factorisé, F = entièrement factorisé.
	#developed: boolean
	#peak: boolean

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.POLYNOMIAL
		this.description = description

		this.#factorised = false
		if (this.config.includes("f") || this.config.includes("factors")) this.#factorised = 'f'
		if (this.config.includes("F") || this.config.includes("FACTORS")) this.#factorised = 'F'

		this.#developed = this.config.includes("d") || this.config.includes("develop")

		this.#peak = this.config.includes("s") || this.config.includes("sommet")
	}

	get format(): string {
		const opts = []

		if (this.#factorised === 'f') {
			opts.push("factorisé")
		} else if (
			this.#factorised === 'F'
		) {
			opts.push("entièrement factorisé")
		} else if (
			this.#developed
		) {
			opts.push("développé")
		}

		return `polynôme ${opts.join(", ")}`
	}

	override checkFormat(value: string): string {
		return isPolynom(value)
			? ""
			: "le polynôme n'est pas formé correctement."
	}

	override checkValue(value: string): CheckerResult {
		const A = isPolynom(value)
		const Q = isPolynom(this.answer)

		if (A === false) {
			return makeCheckerResult("le polynôme n'est pas formé correctement.")
		}

		if (Q === false) {
			return makeCheckerResult("le polynôme de réponse n'est pas formé correctement.")
		}


		// Polynom must be equals.
		if (!Q.isEqual(A)) {
			return makeCheckerResult("le polynôme n'est pas le même.")
		}

		/** Polynom checker config */
		// Factorized
		if (this.#factorised) {
			try {
				return makeCheckerResult(
					checkPolynomIsFactorized(value, this.#factorised === 'F')
						? ""
						: "le polynôme n'est pas (entièrement) factorisé."
				)
			} catch {
				return makeCheckerResult(
					"le polynôme n'est pas (entièrement) factorisé."
				)
			}
		}

		// Developed
		if (this.#developed) {
			if (!A.isDeveloped(value)) {
				return makeCheckerResult("le polynôme n'est pas (entièrement) développé.")
			}
		}

		// Forme du sommet
		if (this.#peak) {
			return isPolynomPeak(value)
				? makeCheckerResult()
				: makeCheckerResult("le polynôme n'est pas dans le bon format.")
		}

		// If all tests passes, it is correct !
		return makeCheckerResult()

	}

}
