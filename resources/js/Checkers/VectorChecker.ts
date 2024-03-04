import {getCheckerClass} from "@/Composables/checkersConfig"
import {CheckerBase} from "@/Checkers/CheckerBase"
import {PiMath} from "pimath/esm"
import {stripFirstCharacter, stripLastCharacter} from "@/helpers/helperFunctions"

const name = "vector"
const description = `vector,[paramètres]

**paramètres**
- co=accepte un vecteur colinéaire
- nb= les composantes sont des nombres
- frac= les composantes sont des fractions
`

export class VectorChecker extends CheckerBase {
    private secondaryChecker: CheckerBase

    constructor(config?: string[]|string) {
        super(config)
        this.name = name
        this.description = description

        if(this.secondaryCheckerName===undefined) {
            if (this.config.includes("nb")) {
                this.secondaryCheckerName = "number"
            } else if (this.config.includes("frac")) {
                this.secondaryCheckerName = "fraction"
            } else {
                this.secondaryCheckerName = "exact"
            }
        }

        this.secondaryChecker = new (getCheckerClass(this.secondaryCheckerName))(this.secondaryCheckerOptions)
    }

    get format(): string {
        return `Vecteur sous la forme \\(\\begin{pmatrix}a\\\\b\\end{pmatrix}\\)<br>${this.secondaryChecker.format}`
    }

    check(expected: string, given: string): { result: boolean; message: string } {

        // Manque les parenthèses
        if (given[0] !== "(" || given[given.length - 1] !== ")") {
            return {
                result: false,
                message: "des vecteurs commencent et se terminent par des parenthèses"
            }
        }

        // On récupère les valeurs
        const values = given.split(";"),
            expectedValues = expected.split(";")


        if (values.length === 1) {
            return {
                result: false,
                message: "des vecteurs ont au moins deux valeurs"
            }
        }

        if (values.length !== expectedValues.length) {
            return {
                result: false,
                message: "la dimension du vecteur ne correspond pas"
            }
        }

        // remove the parentese from the first and last value.
        values[0] = stripFirstCharacter(values[0])
        values[values.length - 1] = stripLastCharacter(values[values.length - 1])

        if (expectedValues[0].startsWith("(")) {
            expectedValues[0] = stripFirstCharacter(expectedValues[0])
        }

        if (expectedValues[expectedValues.length - 1].endsWith(")")) {
            expectedValues[expectedValues.length - 1] = stripLastCharacter(expectedValues[expectedValues.length - 1])
        }

        if (this.config.includes("co")) {
            // suppose that each values are fraction
            let a, b, k

            for (let i = 0; i < values.length; i++) {
                a = new PiMath.Fraction(values[i])
                b = new PiMath.Fraction(expectedValues[i])

                if ((a.isZero() && b.isNotZero()) || a.isNotZero() && b.isZero()) {
                    return {
                        result: false,
                        message: `la ${i + 1}e composante est fausse.`
                    }
                }

                if (a.isNotZero() && b.isNotZero()) {
                    if (k === undefined) {
                        k = new PiMath.Fraction(a.clone().divide(b))
                    } else {
                        if (a.isNotEqual(b.clone().multiply(k))) {
                            return {
                                result: false,
                                message: `la ${i + 1}e composante n'est pas proportionnelle`
                            }
                        }
                    }
                }
            }
        } else {
            for (let i = 0; i < values.length; i++) {
                const result = this.secondaryChecker.check(expectedValues[i], values[i])
                if (!result.result) {
                    return {
                        result: false,
                        message: `la ${i === 0 ? "1ère" : (i + 1) + "ème"} composante n'est pas juste.<br>${result.message}`
                    }
                }
            }
        }


        // tous les tests sont passés ! La réponse est donc juste
        return {
            result: true,
            message: ""
        }


    }

}


