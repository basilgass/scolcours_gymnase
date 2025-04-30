// TODO : Rational checker is not working - convert ot Polyfactors !
import {CheckerAbstract} from "../CheckerAbstract";
import {PolyFactor} from "pimath";
import {CHECKERS} from "../checker.config";

const name = "rational"
const description = `rational,[paramètres]

**paramètres**
- f=factorisée
- d=développée
- r=réduite
`

export class RationalChecker extends CheckerAbstract {
	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.RATIONAL
		this.description = description
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


	override checkValue(value: string): string {
		if (this.answer === '!!' || value === '!!') {
			return "Il semble qu'il y ait une erreur quelque part..."
		}


		let [num, den] = value.split("/")
		if (den === undefined) den = "1"
		let [expectedNum, expectedDen] = this.answer.split("/")
		if (expectedDen === undefined) expectedDen = "1"

		const givenRationnal = new PolyFactor().fromPolynom(num, den),
			givenRationnalReduced = new PolyFactor().fromPolynom(num, den).reduce(),
			expectedRationnal = new PolyFactor().fromPolynom(expectedNum, expectedDen).reduce()

		// Check if the reduced version of numerator and denominator are the same.
		if (!givenRationnalReduced.numerator.isEqual(expectedRationnal.numerator)) {
			return "le numérateur ne correspond pas à la réponse"
		}
		if (!givenRationnalReduced.denominator.isEqual(expectedRationnal.denominator)) {
			return "le dénominateur ne correspond pas à la réponse"
		}

		// TODO: RationalCheck must detect if it's factorized, developped or reduced !
		// if (this.config.includes("f") || this.config.includes("factors")) {
		//     if (!givenRationnal.numerator.isFactorized(num)) {
		//         return {
		//             result: false,
		//             message: "le numérateur n'est pas factorisé"
		//         }
		//     }
		//     if (!givenRationnal.denominator.isFactorized(den)) {
		//         return {
		//             result: false,
		//             message: "le dénominateur n'est pas factorisé"
		//         }
		//     }
		// }
		//

		if (this.config.includes("d") || this.config.includes("develop")) {
			const num = givenRationnal.numerator
			if (num.factors.length > 1 || !num.factors[1].power.isOne()) {
				return "le numérateur n'est pas développé"
			}

			const den = givenRationnal.denominator
			if (den.factors.length > 1 || !den.factors[1].power.isOne()) {
				return "le dénominateur n'est pas développé"
			}
		}

		// Check if it is reduced.
		if (this.config.includes("r") || this.config.includes("reduced")) {
			if (!givenRationnal.numerator.isEqual(givenRationnalReduced.numerator)) {
				return "la fraction rationnelle n'est pas réduite !"
			}
		}

		// If all tests passes, it is correct !
		return ""

	}

}
