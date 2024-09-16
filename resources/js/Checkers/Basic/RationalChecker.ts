import  PiMath from "pimath"
import { CheckerAbstract } from "@/Checkers/CheckerAbstract"

const name = "rational"
const description = `rational,[paramètres]

**paramètres**
- f=factorisée
- d=développée
- r=réduite
`
export class RationalChecker extends CheckerAbstract {
    constructor(config:string[]|string) {
        super(config)
        this.name = name
        this.description = description
    }

    check(expected: string, given: string): { result: boolean; message: string } {
		// TODO: ajouter le check impossible de manière générique à tous les claviers !
		if(expected===given){
			return {
				result: true,
				message: ""
			}
		}
		if(expected==='!!' || given==='!!'){
			return {
				result: false,
				message: "Il semble qu'il y ait une erreur quelque part..."
			}
		}
        let [num, den] = given.split("/")
        if (den === undefined) den = "1"
        let [expectedNum, expectedDen] = expected.split("/")
        if (expectedDen === undefined) expectedDen = "1"

        const givenRationnal = new PiMath.Rational(num, den),
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

        if (this.config.includes("f") || this.config.includes("factors")) {
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

        if (this.config.includes("d") || this.config.includes("develop")) {
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
        if (this.config.includes("r") || this.config.includes("reduced")) {
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

}
