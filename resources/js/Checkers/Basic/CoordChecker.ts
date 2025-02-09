import { CheckerAbstract } from "@/Checkers/CheckerAbstract"
import { stripFirstCharacter, stripLastCharacter } from "@/helpers/helperFunctions"
import { getCheckerClass } from "@/Composables/checkersConfig"

const name = "coord"
const description = `coord,[paramètres]

**paramètres**
- nb= les coordonnées sont des nombres
- frac= les coordonnées sont des fractions
`

export class CoordChecker extends CheckerAbstract {
    private secondaryChecker: CheckerAbstract
    constructor(config?:string[]|string) {
        super(config)
        this.name = name
        this.description = description

        if(this.secondaryCheckerName===undefined){
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

    readonly format = "Coordonnées d'un point sous la forme \\((a;b)\\)"

	checkFormat(value: string): string {
		// Manque les parenthèses
		if (value[0] !== "(" || value[value.length - 1] !== ")") {
			return "des coordonnées commencent et se terminent par des parenthèses"
		}

	}

	checkValue(value: string): string {

		// On récupère les valeurs
		const values = value.split(";"),
			expectedValues = this.answer.split(";")

		if (values.length === 1) {
			return "des coordonnées ont au moins deux valeurs, séparées par un \\(;\\)"
		}

		if (values.length !== expectedValues.length) {
			return "la dimension de la coordonnées ne correspond pas"
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


		// let eChecker = ExactChecker(config)
		for (let i = 0; i < values.length; i++) {
			const result = this.secondaryChecker.check(expectedValues[i], values[i])
			if (!result.result) {
				return `la ${i === 0 ? "1ère" : (i + 1) + "ème"} coordonnée n'est pas juste.<br>${result.message}`
			}
		}

		// tous les tests sont passés ! La réponse est donc juste
		return ""
	}

}
