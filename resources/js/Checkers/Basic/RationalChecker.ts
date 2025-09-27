import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"
import {PolyFactor} from "pimath"

const name = "rational"
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

		let [num, den] = value.split("/")
		if (den === undefined) den = "1"
		let [expectedNum, expectedDen] = this.answer.split("/")
		if (expectedDen === undefined) expectedDen = "1"

		const givenRationnal = new PolyFactor().fromPolynom(num, den),
			givenRationnalReduced = new PolyFactor().fromPolynom(num, den).reduce(),
			expectedRationnal = new PolyFactor().fromPolynom(expectedNum, expectedDen).reduce()

		if (!givenRationnalReduced.numerator.isEqual(expectedRationnal.numerator)) {
			return makeCheckerResult("le numérateur ne correspond pas à la réponse")
		}
		if (!givenRationnalReduced.denominator.isEqual(expectedRationnal.denominator)) {
			return makeCheckerResult("le dénominateur ne correspond pas à la réponse")
		}

		if (this.#factorized) {
			const Nfactorized = givenRationnal.numerator.factorize()
		    if (Nfactorized.factors.length!==givenRationnal.numerator.factors.length) {
		       return makeCheckerResult("le numérateur n'est pas factorisé")
		    }
			const Dfactorized = givenRationnal.denominator.factorize()
			if (Dfactorized.factors.length!==givenRationnal.denominator.factors.length) {
		        return makeCheckerResult("le dénominateur n'est pas factorisé")
		    }
		}


		if (this.#developed) {
			const num = givenRationnal.numerator
			if (num.factors.length > 1 || !num.factors[1].power.isOne()) {
				return makeCheckerResult("le numérateur n'est pas développé")
			}

			const den = givenRationnal.denominator
			if (den.factors.length > 1 || !den.factors[1].power.isOne()) {
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
