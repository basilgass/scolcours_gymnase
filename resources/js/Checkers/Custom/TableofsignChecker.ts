import {CheckerAbstract} from "../CheckerAbstract";
import {ExactChecker} from "../Basic";
import {CHECKERS} from "../checker.config";

const name = "tos"
const description = `tos,[paramètres]

**paramètres**
aucun
`
export class TableofsignChecker extends CheckerAbstract {
	private grows: boolean
    private coords: boolean

    constructor(config: string[] | string) {
        super(config)
        this.type = CHECKERS.TABLE_OF_SIGNS
        this.description = description

        this.grows = this.config.includes('g') || this.config.includes('grows')
        this.coords = this.config.includes('c') || this.config.includes('coords')

		this.secondaryChecker = new ExactChecker()
    }

    get format(): string {
        if (this.coords) {
            return `Tableau de croissance avec min / max<br/>Coordonnées au format ${this.secondaryChecker?.format}`
        } else if (this.grows) {
            return "Tableau de croissance"
        }
        return "Tableau de signes"
    }

	override checkValue(value: string): string {
		if (this.answer !== value) {
			const zeroes = {
					expected: this.answer.split("@")[0],
					provided: value.split("@")[0]
				},
				signs = {
					expected: this.answer.split("@")[1],
					provided: value.split("@")[1] ?? ""
				},
				grows = {
					expected: this.answer.split("@")[2] ?? "",
					provided: value.split("@")[2] ?? ""
				},
				coords = {
					expected: this.answer.split("@")[3] ?? "",
					provided: value.split("@")[3] ?? ""
				}

			if (zeroes.expected !== zeroes.provided) {
				//TODO: compare each zeroes...
				return "les zéros ne sont pas justes"
			}

			if (signs.expected !== signs.provided) {
				return "les signes ne sont pas justes"
			}

			if (grows.expected !== grows.provided) {
				return "la croissance n'est pas juste"
			}

			// Check the coordinates
			if (coords.expected.length > 0) {
				const expectedCoordinates = coords.expected.split(","),
					providedCoordinates = coords.provided.split(",")

				if (expectedCoordinates.length !== providedCoordinates.length) {
					return "toutes les valeurs des extrêmes n'ont pas été données..."
				}

				for (let i = 0; i < expectedCoordinates.length; i++) {
					const check = this.secondaryChecker?.check(expectedCoordinates[i], providedCoordinates[i]) ?? {result: false, message: ""}

					if (!check.result) {
						return `il y a une erreur avec ${i === 0 ? "la 1ère" : "la " + (i + 1) + "ème"} coordonnée`
					}
				}
			}


			return "Il y a une erreur dans le tableau de signes."
		}

		return ""
	}


}
