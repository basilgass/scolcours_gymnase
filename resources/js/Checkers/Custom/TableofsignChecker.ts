import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"
import {ExactChecker} from "../Basic"
import {NumExp} from "pimath"

// const name = "tos"
const description = `tos,[paramètres]

**paramètres**
aucun
`

export class TableofsignChecker extends CheckerAbstract {
	private coords: boolean
	private grows: boolean

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.TABLE_OF_SIGNS
		this.description = description

		// Configuration
		this.grows = this.config.includes('g') || this.config.includes('grows')
		this.coords = this.config.includes('c') || this.config.includes('coords')

		// Le secondary checker par défaut.
		this.secondaryChecker = new ExactChecker()
	}

	get format(): string {
		if (this.coords) {
			return `Tableau de croissance avec min / max<br/>Coordonnées au format ${this.secondaryChecker?.format}`
		}

		if (this.grows) {
			return "Tableau de croissance"
		}

		return "Tableau de signes"
	}

	override checkFormat(value: string): string {
		const [zeroes, signs, grows_or_curves, coordinates] = value.split('@')

		if (!zeroes) return super.checkFormat(value)

		const columns = 2 * zeroes.split(',').length + 1

		// Ligne de signes
		if (signs === undefined) return "il faut entrer des signes."
		if (signs.length !== columns) return "il manque des éléments dans la ligne des signes."
		if (signs.replaceAll(/[+\-zd!]/g, '').length > 0) return "il y a des signes non compatibles."

		// Ligne de croissance ou de courbure
		if (grows_or_curves && grows_or_curves.length !== columns) {
			return "il manque des éléments dans la dernière ligne."
		}

		// Coordonnées - chaque coordonnées doit être complète !
		// coordinates.split(',').forEach(coord => {
		// 	if (!coord.startsWith('(') || !coord.endsWith(')') || coord.split(';').length !== 2) {
		// 		return "il y a une coordonnées qui n'est pas formatée correctement."
		// 	}
		// })

		return super.checkFormat(value)
	}

	override checkValue(value: string): CheckerResult {
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


			let check: CheckerResult

			// contrôle des zéros
			check = this.checkZeroes(zeroes)
			if (!check.result) return check


			// contrôle des signs
			if (signs.expected !== signs.provided) {
				return makeCheckerResult(
					"les signes ne sont pas justes"
				)
			}

			// contrôle de la croissance
			if (grows.expected !== grows.provided) {
				return makeCheckerResult(
					"la croissance n'est pas juste"
				)
			}

			// contrôle des coordonnées
			if (coords.expected.length > 0) {
				const expectedCoordinates = coords.expected.split(","),
					providedCoordinates = coords.provided.split(",")

				if (expectedCoordinates.length > providedCoordinates.length) {
					return makeCheckerResult("toutes les valeurs des extrêmes n'ont pas été données...")
				}

				if (expectedCoordinates.length < providedCoordinates.length) {
					return makeCheckerResult("il y a trop de valeurs d'extrèmes !")
				}

				return this.secondaryCheckValues(
					providedCoordinates, expectedCoordinates,
					(i: number, message: string) => `il y a une erreur avec ${i === 0 ? "la 1ère" : "la " + (i + 1) + "ème"} coordonnée: ${message}`
				)

			}


			return makeCheckerResult("Il y a une erreur dans le tableau de signes.")
		}

		return makeCheckerResult()
	}


	checkZeroes(zeroes: { expected: string[], provided: string[] }): CheckerResult {

		// Pas le bon nombre de zéro
		if (zeroes.expected.length !== zeroes.provided.length) {
			const diff = zeroes.expected.length - zeroes.provided.length

			return makeCheckerResult(
				diff < 0
					? "il y a trop de zéros"
					: "il manque des zéros")
		}

		// Les zéros doivent être dans l'ordre croissant
		const zeroesValues = zeroes.provided.map(z => new NumExp(z).evaluate())
		const isSorted = zeroesValues.every((val, i, arr) => i === 0 || arr[i - 1] <= val)
		if (!isSorted) {
			return makeCheckerResult("les zéros ne sont pas dans l'ordre croissant")
		}

		return this.secondaryCheckValues(zeroes.provided, zeroes.expected)
	}

}
