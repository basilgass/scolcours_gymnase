import { CheckerAbstract } from "@/Checkers/CheckerAbstract"
import { getCheckerClass } from "@/Composables/checkersConfig"
import { stripFirstCharacter, stripLastCharacter } from "@/helpers/helperFunctions"
import { Fraction } from "pimath"

const name = "vector"
const description = `vector,[paramètres]

**paramètres**
- co=accepte un vecteur colinéaire
- nb= les composantes sont des nombres
- frac= les composantes sont des fractions
`

export class VectorChecker extends CheckerAbstract {

    private secondaryChecker: CheckerAbstract
    private _colinear = false

    constructor(config?: string[] | string) {
        super(config)
        this.name = name
        this.description = description

        if (this.config.includes("co")) { this._colinear = true }

        if (this.secondaryCheckerName === undefined) {
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
        return `Vecteur ${this._colinear ? 'colinéaire ' : ''}sous la forme \\(\\begin{pmatrix}a\\\\b\\end{pmatrix}\\)<br>${this.secondaryChecker.format}`
    }

	checkFormat(value: string): string {

		if (value[0] !== "(" || value[value.length - 1] !== ")") {
			return "des vecteurs commencent et se terminent par des parenthèses"
		}


		return ""
	}

	checkValue(value: string): string {
		// On récupère les valeurs
		const values = value.split(";"),
			expectedValues = this.answer.split(";")


		if (values.length === 1) {
			return "des vecteurs ont au moins deux valeurs"
		}

		if (values.length !== expectedValues.length) {
			return "la dimension du vecteur ne correspond pas"
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
				a = new Fraction(values[i])
				b = new Fraction(expectedValues[i])

				if ((a.isZero() && b.isNotZero()) || a.isNotZero() && b.isZero()) {
					return `la ${i + 1}e composante est fausse.`
				}

				if (a.isNotZero() && b.isNotZero()) {
					if (k === undefined) {
						k = new Fraction(a.clone().divide(b))
					} else {
						if (a.isNotEqual(b.clone().multiply(k))) {
							return `la ${i + 1}e composante n'est pas proportionnelle`
						}
					}
				}
			}
		} else {
			for (let i = 0; i < values.length; i++) {
				const result = this.secondaryChecker.check(expectedValues[i], values[i])
				if (!result.result) {
					return `la ${i === 0 ? "1ère" : (i + 1) + "ème"} composante n'est pas juste.<br>${result.message}`
				}
			}
		}


		// tous les tests sont passés ! La réponse est donc juste
		return ""

	}

}


