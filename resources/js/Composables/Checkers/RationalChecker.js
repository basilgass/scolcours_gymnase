import {PiMath} from "pimath/esm"

export function RationalChecker(options) {
	return {
		format: () => {
			let opts = []

			if (options.includes("f") || options.includes("factors")) {
				opts.push("factorisée")
			} else if (options.includes("d") || options.includes("develop")) {
				opts.push("développée")
			}
			if (options.includes("r") || options.includes("reduced")) {
				opts.push("réduite")
			}

			return `fraction rationnelle ${opts.join(", ")}`
		},
		check: (expectedAnswer, answer) => {
			let [num, den] = answer.split("/")
			if (den === undefined) den = 1
			let [expectedNum, expectedDen] = expectedAnswer.split("/")
			if (expectedDen === undefined) expectedDen = 1

			let givenRationnal = new PiMath.Rational(num, den),
				givenRationnalReduced = (new PiMath.Rational(num, den)).reduce(),
				expectedRationnal = (new PiMath.Rational(expectedNum, expectedDen)).reduce()

			// Check if the reduced version of numerator and denominator are the same.
			if (!givenRationnalReduced.numerator.isEqual(expectedRationnal.numerator)) {
				return {
					result: false,
					message: "le numérateur ne correspond pas à la réponse"
				}
			}
			if (!givenRationnalReduced.denominator.isEqual(expectedRationnal.denominator)) {
				return {
					result: false,
					message: "le dénominateur ne correspond pas à la réponse"
				}
			}

			if (options.includes("f") || options.includes("factors")) {
				if (!givenRationnal.numerator.isFactorized(num)) {
					return {
						result: false,
						message: "le numérateur n'est pas factorisé"
					}
				}
				if (!givenRationnal.denominator.isFactorized(den)) {
					return {
						result: false,
						message: "le dénominateur n'est pas factorisé"
					}
				}
			}

			if (options.includes("d") || options.includes("develop")) {
				if (!givenRationnal.numerator.isDeveloped(num)) {
					return {
						result: false,
						message: "le numérateur n'est pas développé"
					}
				}
				if (!givenRationnal.denominator.isDeveloped(den)) {
					return {
						result: false,
						message: "le dénominateur n'est pas développé"
					}
				}
			}

			// Check if it is reduced.
			if (options.includes("r") || options.includes("reduced")) {
				if (!givenRationnal.numerator.isEqual(givenRationnalReduced.numerator)) {
					return {
						result: false,
						message: "la fraction rationnelle n'est pas réduite !"
					}
				}
			}

			// If all tests passes, it is correct !
			return {
				result: true,
				message: ""
			}
		}
	}
}
