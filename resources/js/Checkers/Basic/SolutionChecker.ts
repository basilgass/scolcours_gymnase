import {CheckerAbstract, CheckerResult, CHECKERS} from "@/Checkers"
import {braceSorter} from "@/Checkers/checkerHelperFunctions.ts"
import AsciiMathParser from "@/asciimath2tex.ts"
import {partial} from "lodash"

const name = "solution"
const description = `solution|sol,[paramètres]

**paramètres**
checker = par défaut, c'est le "exact"
`

// TODO: SolutionChecker a revoir pour plus de cohérence.
export class SolutionChecker extends CheckerAbstract {

	constructor(config?: string[] | string) {
		super(config)

		this.type = CHECKERS.SOLUTION
		this.description = description

	}

	get format(): string {
		return `Solution de la forme \\(\\mathcal{S}=\\{3;5\\}\\)<br/>${this.secondaryChecker?.format}`
	}


	override checkValue(value: string): CheckerResult {
		// Ensemble vide / réelles entre accolades.
		if (isEmptyOrReal(value, true)) {
			return this.makeCheckerResult(
				`${new AsciiMathParser().parse(
					value.slice(1, -1), // enlever le premier et le dernier caractère
				)} est déjà un ensemble.`,
				value === `{${this.answer}} `
			)
		}

		if (isEmptyOrReal(this.answer) && !isEmptyOrReal(value)) {
			// la réponse donnée n'est pas un cas particulier, mais on devrait l'avoir...
			return this.makeCheckerResult("Ce n'est pas le bon ensemble de solution.")
		}

		// La réponse donnée et espérée ne sont pas des cas particuliers

		// La solution espérée est avec des accolades: contrôle que les accolades sont présents et le bon nombre
		if (this.answer.startsWith("{")) {
			if (!value.startsWith("{")) {
				// Manque les accolades
				return this.makeCheckerResult("L'ensemble des solutions doit avoir des \\(\\{ \\}\\).")
			}

			// vérifie qu'il y a bien le bon nombre d'accolades ouvrantes et fermantes
			if (value.split("{").length !== value.split("}").length) {
				return this.makeCheckerResult("Le nombre d'accolades ouvrantes est différent des fermantes.")
			}
		}

		// Si la solution est avec intervalle mais pas la réponse.
		if (isWithInterval(this.answer) && !isWithInterval(value)) {
			return this.makeCheckerResult(
				isWithInterval(this.answer)
					? "La solution contient un intervalle."
					: "La solution ne contient pas d'intervalle."
			)
		}

		// La solution n'est pas un intervalle.
		if (!isWithInterval(this.answer)) {
			// On devrait être dans la situation : {a;b;c;d}
			const expectedValues = this.answer
				.substring(1, this.answer.length - 1)
				.split(";")

			const givenValues = value
				.substring(1, value.length - 1)
				.split(";")

			// différence sur le nombre de réponses
			const diff = expectedValues.length - givenValues.length

			const errors: string[] = []
			let partialOnly = true

			if (diff !== 0) {
				errors.push(diff > 0
					? `Il manque ${diff} réponse${diff > 1 ? 's' : ''}.`
					: `Il y a ${-diff} réponse${diff < -1 ? 's' : ''} en trop.`
				)
				partialOnly = false
			}

			givenValues.forEach((given: string, count: number)=>{
				const results = expectedValues
					.map(checkValue => this.secondaryChecker.check(given, checkValue))

				// Une réponse correcte existe.
				const index = results
					.findIndex((value) => value.result)
				if (index !== -1) {
					// Un résultat correspondant a été trouvé :
					// on l'enlève de la liste des réponses possibles.
					expectedValues.splice(index, 1)
					return
				}

				// On recherche une réponse partielle
				const partial = results
					.findIndex(value => value.partial)

				if (partial!==-1) {
					// Une réponse partielle a été trouvée.
					// on l'enlève de la liste des réponses possibles.
					expectedValues.splice(partial, 1)
					// On rajoute l'erreur.
					errors.push(`(${count+1}) ${results[partial].message}`)
					return
				}

				// Aucune réponse ne correspond - c'est vraiment faux
				partialOnly = false
				errors.push(`(${count+1}) aucune réponse ne correspond dans les solutions.`)

			})

			return this.makeCheckerResult(
				errors.length > 0
					? errors.join('<br/>')
					: "",
				partialOnly
			)
		}

		// La solution peut être du type IR\setminus {a;b;c}

		// Ce n'est pas dans le bon ordre (cas des ensembles, pas des intervalles)
		if (!this.answer.includes("]") && !this.answer.includes("[")) {
			const inBracketsExpectedValue = braceSorter(this.answer)
			const inBracketsGivenValue = braceSorter(value)

			return this.makeCheckerResult(
				inBracketsGivenValue === inBracketsExpectedValue
					? ""
					: "Une ou plusieurs valeurs sont fausses."
			)
		}


		// tODO: Aucune aide à a la résolution des intervalles.
		return this.makeCheckerResult("Les solutions données ne sont pas justes.")
	}
}

function isWithInterval(value: string): boolean {
	return value.includes("[") || value.includes("]")
}

function isEmptyOrReal(value: string, withExtraBraces = false): boolean {
	return realSets.some(s => withExtraBraces
		? `{${s}}` === value
		: s === value)
}

const realSets = ['!!', 'RR', "RR^**", "RR_+", "RR_+^**", "RR_-", "RR_-^**"]
