import {CheckerAbstract, CheckerResult, CHECKERS, checkPolynomIsFactorized, makeCheckerResult} from "@/Checkers"
import {PolyFactor} from "pimath"

// const name = "rational"
const description = `rational,[paramètres]

**paramètres**
- f=factorisée
- d=développée
- r=réduite
`

export class RationalChecker extends CheckerAbstract {
	#reduced: boolean
	#factorized: false | 'f' | 'F' // f = factorisé, F = entièrement factorisé.
	#developed: boolean

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.RATIONAL
		this.description = description

		if (this.config.includes("f") || this.config.includes("factors")) this.#factorized = 'f'
		if (this.config.includes("F") || this.config.includes("FACTORS")) this.#factorized = 'F'

		this.#developed = this.config.includes("d") || this.config.includes("develop")
		this.#reduced = this.config.includes("r") || this.config.includes("reduced")
	}

	get format(): string {
		const opts = []

		if (this.#factorized) {
			opts.push(`${this.#factorized === 'F' ? 'entièrement ' : ''}factorisée`)
		} else if (this.#developed) {
			opts.push("développée")
		}

		if (this.#reduced) {
			opts.push("réduite")
		}

		return `fraction rationnelle ${opts.join(", ")}`
	}


	override checkValue(value: string): CheckerResult {
		if (this.answer === '!!' || value === '!!') {
			return makeCheckerResult("Il semble qu'il y ait une erreur quelque part...")
		}

		// Données de la réponse
		const expectedRational = new PolyFactor().fromString(this.answer)
		const expectedRationalReduced = expectedRational.factorize().reduce()

		// Données des étudiants
		const givenRationnal = new PolyFactor().fromString(value)

		const givenRationnalReduced = givenRationnal.factorize().reduce()
		// Les versions réduites des numérateurs sont différentes.
		if (!givenRationnalReduced.numerator.isEqual(expectedRationalReduced.numerator)) {
			return makeCheckerResult("le numérateur ne correspond pas à la réponse")
		}

		// Les versions réduites des dénominateurs sont différentes.
		if (!givenRationnalReduced.denominator.isEqual(expectedRationalReduced.denominator)) {
			return makeCheckerResult("le dénominateur ne correspond pas à la réponse")
		}

		// Si la factorisation est demandée, on peut encore réduire.
		// On part du principe que la division n'est possible que pour la fraction rationnelle, pas pour les coefficient
		if (this.#factorized) {
			const [num, den] = value.split('/')

			const numFactorized = checkPolynomIsFactorized(num, this.#factorized === 'F')

			// contrôle du numérateur
			if (!numFactorized) {
				return makeCheckerResult(`Le numérateur n'est pas ${this.#factorized === 'F' ? 'entièrement ' : ''}factorisé`)
			}

			// contrôle du dénominateur
			if (den) {
				const denFactorized = checkPolynomIsFactorized(den, this.#factorized === 'F')

				if (!denFactorized) {
					return makeCheckerResult(`Le dénominateur n'est pas ${this.#factorized === 'F' ? 'entièrement ' : ''}factorisé`)
				}
			}
		}


		if (this.#developed) {
			const num = givenRationnal.numerator
			// il y a plus d'un facteur ou la puissance de l'unique facteur n'est pas un.
			if (num.factors.length > 1 || !num.factors[0].power.isOne()) {
				return makeCheckerResult("le numérateur n'est pas développé")
			}

			const den = givenRationnal.denominator
			if (den.factors.length > 1 || !den.factors[0].power.isOne()) {
				return makeCheckerResult("le dénominateur n'est pas développé")
			}
		}

		if (this.#reduced) {
			if (!givenRationnal.numerator.isEqual(givenRationnalReduced.numerator)) {
				return makeCheckerResult("la fraction rationnelle n'est pas réduite !")
			}
		}

		// If all tests passes, it is correct !
		return makeCheckerResult()

	}

}


// function _checkFactorisation(value: PolyFactor): { score: number, display: string } {
// 	const result = {
// 		score: 1,
// 		display: ''
// 	}
//
// 	value.factors.forEach(factor => {
//
// 		if (result.score > 0) {
// 			const polynom = factor.polynom
// 			const factors = polynom.factorize()
// 			result.display = polynom.display
//
// 			// C'est factorisé - rien à faire
// 			if (factors.length === 1) {
// 				return
// 			}
//
// 			// Il y a deux facteurs - regarde si l'un des deux est une mise en évidence.
// 			if (factors.length === 2) {
// 				// On regarde s'il y a un facteur de mise en évidence.
// 				const k = factors.find(f => f.monoms.length === 1)
//
// 				if (k) {
// 					// On laisse passer une mise en évidence de -1
// 					if (k.value === -1) {
// 						return
// 					}
//
// 					// Le score dépend si ce n'est qu'un nombre ou un monome de type 2x, 2x^3,...
// 					result.score = Math.min(result.score, k.degree().isZero() ? 0.9 : 0.5)
// 					return
// 				}
// 			}
//
// 			result.score = 0
// 		}
// 	})
//
// 	return result
// }
