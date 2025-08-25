import {CheckerAbstract} from "../CheckerAbstract"
import {ExactChecker} from "../Basic"
import {CHECKERS} from "../checker.config"
import {NumExp} from "piexpression"

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
				expected: this.answer.split("@")[0].split(','),
				provided: value.split("@")[0].split(',')
			}
			const signs = {
				expected: this.answer.split("@")[1],
				provided: value.split("@")[1] ?? ""
			}
			const grows = {
				expected: this.answer.split("@")[2] ?? "",
				provided: value.split("@")[2] ?? ""
			}
			const coords = {
				expected: this.answer.split("@")[3] ?? "",
				provided: value.split("@")[3] ?? ""
			}

			if (zeroes.expected.length !== zeroes.provided.length) {
				const diff = zeroes.expected.length - zeroes.provided.length

				return diff < 0
					? "il y a trop de zéros"
					: "il manque des zéros"
			}

			// Les zéros doivent être dans l'ordre croissant
			const zeroesValues = zeroes.provided.map(z => new NumExp(z).evaluate())
			const isSorted = zeroesValues.every((val, i, arr) => i === 0 || arr[i - 1] <= val)
			if (!isSorted) {
				return "les zéros ne sont pas dans l'ordre croissant"
			}

			const expectedValues = zeroes.expected.map(z => new NumExp(z).evaluate())
			const diffIndexes = expectedValues.reduce<number[]>((acc, val, idx) => {
				if (val !== zeroesValues[idx]) acc.push(idx)
				return acc
			}, [])

			if (diffIndexes.length>0) {
				const positions = diffIndexes.map(i => `${i + 1}${i === 0 ? "er" : "ème"}`).join(", ")
				return diffIndexes.length === 1
					? `le ${positions} zéro est faux`
					: `les ${positions} zéros sont faux`
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
					const check = this.secondaryChecker?.check(expectedCoordinates[i], providedCoordinates[i]) ?? {
						result: false,
						message: ""
					}

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
