import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"
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
	#factorized: boolean
	#developed: boolean

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.RATIONAL
		this.description = description

		this.#factorized = this.config.includes("f") || this.config.includes("factors")
		this.#developed = this.config.includes("d") || this.config.includes("develop")
		this.#reduced = this.config.includes("r") || this.config.includes("reduced")
	}

	get format(): string {
		const opts = []

		if (this.config.includes("f") || this.config.includes("factors")) {
			opts.push("factorisée")
		} else if (this.config.includes("d") || this.config.includes("develop")) {
			opts.push("développée")
		}
		if (this.config.includes("r") || this.config.includes("reduced")) {
			opts.push("réduite")
		}

		return `fraction rationnelle ${opts.join(", ")}`
	}


	override checkValue(value: string): CheckerResult {
		if (this.answer === '!!' || value === '!!') {
			return makeCheckerResult("Il semble qu'il y ait une erreur quelque part...")
		}

		// Données de la réponse
		const expectedRationnalReduced = new PolyFactor().fromString(this.answer).reduce()

		// Données des étudiants
		const givenRationnal = new PolyFactor().fromString(value)
		const givenRationnalReduced = givenRationnal.clone().reduce()

		// Les versions réduites partagent le même dénominateur.
		if (!givenRationnalReduced.numerator.isEqual(expectedRationnalReduced.numerator)) {
			return makeCheckerResult("le numérateur ne correspond pas à la réponse")
		}

		// Les versions réduites partagent le même numérateur.
		if (!givenRationnalReduced.denominator.isEqual(expectedRationnalReduced.denominator)) {
			return makeCheckerResult("le dénominateur ne correspond pas à la réponse")
		}

		if (this.#factorized) {
			let isFactorized = true
			givenRationnal.numerator.factors.forEach(factor => {
				if (isFactorized) {
					const polynom = factor.polynom
					if (polynom.factorize().length > 1) isFactorized = false
				}
			})

			if (!isFactorized) {
				return makeCheckerResult("le numérateur n'est pas factorisé")
			}

			isFactorized = true
			givenRationnal.numerator.factors.forEach(factor => {
				if (isFactorized) {
					const polynom = factor.polynom
					if (polynom.factorize().length > 1) isFactorized = false
				}
			})

			if (!isFactorized) {
				return makeCheckerResult("le dénominateur n'est pas factorisé")
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
