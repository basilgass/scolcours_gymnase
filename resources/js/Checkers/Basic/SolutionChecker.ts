import AsciiMathParser from "@/asciimath2tex.ts"
import {CheckerAbstract, CheckerResult, CHECKERS, ExactChecker, makeCheckerResult} from "@/Checkers"
import {NumExp} from "piexpression"

// const name = "solution"
const description = `solution|sol,[paramètres]

**paramètres**
checker = par défaut, c'est le "exact"
`

export class SolutionChecker extends CheckerAbstract {

	constructor(config?: string[] | string) {
		super(config)

		this.type = CHECKERS.SOLUTION
		this.description = description

		if (!this.secondaryChecker) {
			this.secondaryChecker = new ExactChecker()
		}
	}

	get format(): string {
		return [
			`Solution de la forme \\(\\mathcal{S}=\\{3;5\\}\\)`,
			this.secondaryChecker?.format ?? ''
		]
			.filter(x => x.trim() !== '')
			.join('<br/>')
	}


	override checkValue(value: string): CheckerResult {
		// On contrôle que c'est la bonne mise en forme.
		// TODO: regarder comment pour déplacer la quality dans le override CheckForamt
		let result = this.check_quality(value)
		if (!result.result) return result

		// Contrôle la cohérence de la réponse Real, ensemble, intervalle
		result = this.check_coherences(value)
		if (!result.result) return result

		if (isInterval(this.answer)) return this.check_intervals(value)

		if (isSimpleSet(this.answer)) return this.check_sets(value)

		return this.check_realSets(value)
	}

	check_coherences(value: string): CheckerResult {
		if (isEmptyOrReal(value) !== isEmptyOrReal(this.answer)) {
			return makeCheckerResult(
				"Ce n'est pas la bon type de réponse."
			)
		}

		const valueInterval = isInterval(value)
		const answerInterval = isInterval(this.answer)

		if (valueInterval !== answerInterval) {
			return makeCheckerResult(
				"Ce n'est pas la bon type de réponse."
			)
		}

		return makeCheckerResult()
	}

	check_interval(value: string, answer: string): CheckerResult {
		const expectedValues = answer
			.substring(1, answer.length - 1)
			.split(";")

		const givenValues = value
			.substring(1, value.length - 1)
			.split(";")

		const leftOpen = value[0] === ']'
		const rightOpen = value[value.length - 1] === '['
		const answerLeftOpen = answer[0] === ']'
		const answerRightOpen = answer[answer.length - 1] === '['


		if (givenValues.length !== 2) {
			return makeCheckerResult("Un intervalle doit avoir deux bornes.")
		}

		if (givenValues[0] === 'oo' || givenValues[1] === 'oo') {
			return makeCheckerResult("Le signe infini doit être signé: \\(+\\infty\\) ou \\(-\\infty\\)")
		}

		if (givenValues[0] === '+oo' || givenValues[1] === '-oo') {
			return makeCheckerResult("les deux bornes sont dans l'ordre croissant.")
		}

		if (
			(givenValues[0] === '-oo' && !leftOpen)
			||
			(givenValues[1] === '+oo' && !rightOpen)
		) {
			return makeCheckerResult("L'infini a toujours un crochet ouvert.")
		}

		// On vérifie que les deux valeurs non infinie sont dans l'ordre croissant.
		if (givenValues[0] !== '-oo' && givenValues[1] !== '+oo') {
			const expA = new NumExp(givenValues[0])
			const expB = new NumExp(givenValues[1])

			if (expA.isValid && expB.isValid) {
				const a = expA.evaluate()
				const b = expB.evaluate()

				if (a > b) {
					return makeCheckerResult("les deux bornes sont dans l'ordre croissant.")
				}
			}
		}

		// Les valeurs doivent être juste : comparaison avec infini
		if ((expectedValues[0] === '-oo' && givenValues[0] !== "-oo") ||
			(expectedValues[0] !== '-oo' && givenValues[0] === "-oo")) {
			return makeCheckerResult("La borne inférieure est fausse.")
		}
		if ((expectedValues[1] === '+oo' && givenValues[1] !== "+oo") ||
			(expectedValues[1] !== '+oo' && givenValues[1] === "+oo")) {
			return makeCheckerResult("La borne supérieure est fausse.")
		}

		// On a en théorie deux valeurs - elles doivent être juste avec le secondary checker.
		const check0 = this.secondaryChecker.check(givenValues[0], expectedValues[0])
		const check1 = this.secondaryChecker.check(givenValues[1], expectedValues[1])

		if (check0.result === false) {
			return makeCheckerResult(`La borne inférieure est fausse.<br/>${check0.message}`, check0.partial)
		}
		if (check1.result === false) {
			return makeCheckerResult(`La borne supérieure est fausse.<br/>${check1.message}`, check1.partial)
		}

		// La réponse voulue n'a pas les crochets correspondants.
		if (leftOpen !== answerLeftOpen || rightOpen !== answerRightOpen) {
			return makeCheckerResult("Il y a une erreur avec les crochets")
		}

		return makeCheckerResult()
	}

	check_intervals(value: string): CheckerResult {
		const intervals = value.split('uu')
		const answerIntervals = this.answer.split('uu')

		if (intervals.length !== answerIntervals.length) {
			return makeCheckerResult(
				answerIntervals.length > intervals.length
					? "Il manque un ou plusieurs intervalle(s)"
					: "Il y a un ou plusieurs intervalle(s) en trop")
		}


		const results: string[] = []
		let isPartial = true
		intervals.forEach((interval, count) => {
			const checks = answerIntervals.map(answer => this.check_interval(interval, answer))
			const index = checks.findIndex(check => check.result)

			if (index !== -1) {
				answerIntervals.splice(index, 1)
				return
			}

			const partialIndex = checks.findIndex(check => check.partial)
			if (partialIndex !== -1) {
				answerIntervals.splice(partialIndex, 1)
				results.push(`(${count + 1}) : ${checks[partialIndex].message}`)
				return
			}

			isPartial = false
			results.push(`(${count + 1}) : \\(${new AsciiMathParser().parse(interval)}\\) n'est pas dans les solutions`)
		})

		return makeCheckerResult(
			results.length > 0
				? results.join('<br/>')
				: ""
			,
			isPartial
		)
	}

	check_quality(value: string): CheckerResult {
		// C'est un ensemble particulier, sans accolade => OK
		if (isEmptyOrReal(value)) {
			return makeCheckerResult()
		}

		// Un ensemble type IR ou emptyset est entouré d'accolades => faux
		if (isEmptyOrReal(value, true)) {
			return makeCheckerResult(
				`${new AsciiMathParser().parse(
					value.slice(1, -1), // enlever le premier et le dernier caractère
				)} est déjà un ensemble.`,
				value === `{${this.answer}} `
			)
		}

		// A partir de là, c'est forcément un ensemble ou un intervalle
		const estIntervalle = isInterval(value)

		// Le nombre d'accolades ouvrantes = nombre d'accolades fermantes
		const openBracesCount = value.split('{').length - 1
		const closeBracesCount = value.split('}').length - 1

		// Pas le même nombre d'accolades.
		if (openBracesCount !== closeBracesCount) {
			return makeCheckerResult(
				`il n'y a pas le même nombre d'accolade ouvrante que fermante.`
			)
		}

		if (!estIntervalle && openBracesCount === 0) {
			return makeCheckerResult(
				"il faut au moins des accolades dans un intervalle."
			)
		}

		// Dans le cas d'intervalle, chaque morceau doit commencer et se terminer par un crochet.
		if (estIntervalle) {
			const intervalles = value.split('uu')
			if (
				intervalles.some(intervalle => {
					const first = intervalle[0]
					const last = intervalle[intervalle.length - 1]
					return !['[', ']'].includes(first) || !['[', ']'].includes(last)
				})
			) {
				return makeCheckerResult(`Un intervalle commence par un \\( [ \\) ou un \\( ] \\)`)
			}
		}


		return makeCheckerResult()
	}

	check_realSets(value: string): CheckerResult {
		// <real set>\{substract set}
		const [real, subtractSet] = value.split('\\\\')
		const [answerReal, answerSubtractSet] = this.answer.split('\\\\')

		if (!realSets.includes(real)) {
			return makeCheckerResult("Les solutions avec une soustraction commencent par des ensembles rééels")
		}

		if (real !== answerReal) {
			// on suppose que, par défaut answerReal utilise l'étoile.
			// Si l'ensemble de base donné n'a pas l'étoile, mais que l'on soustrait le zéro...
			// réponse fausse, mais partiel ok.
			if (
				answerReal.includes('^**') &&
				!real.includes('^**') && subtractSet
			) {
				const hasZeroInSubtractSet = extractSetValues(subtractSet).includes('0')

				if (hasZeroInSubtractSet) {
					return makeCheckerResult("Il ne faut pas soustraire zéro, mais mettre une étoile à l'ensemble réel", true)
				}
			}

			return makeCheckerResult("L'ensemble réel de base est faux.")
		}

		if (subtractSet === undefined && answerSubtractSet) {
			return makeCheckerResult("Il faut soustraire quelques éléments")
		}

		if (subtractSet && answerSubtractSet === undefined) {
			return makeCheckerResult("Pourquoi avoir soustrait un ensemble ?")
		}

		// Il ne reste plus qu'à comparer la partie soustraite.
		if (answerSubtractSet) {
			const answer = '' + this.answer
			this.answer = answerSubtractSet
			const subtractResult = this.check_sets(subtractSet)
			this.answer = answer

			if (subtractResult.result === false) {
				return makeCheckerResult(`La partie soustraite est fausse<br>${subtractResult.message}`, subtractResult.partial)
			}
		}

		return makeCheckerResult()
	}

	check_sets(value: string): CheckerResult {
		const expectedValues = extractSetValues(this.answer)
		const givenValues = extractSetValues(value)

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
		givenValues.forEach((given: string, count: number) => {
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

			if (partial !== -1) {
				// Une réponse partielle a été trouvée.
				// on l'enlève de la liste des réponses possibles.
				expectedValues.splice(partial, 1)
				// On rajoute l'erreur.
				errors.push(`(${count + 1}) ${results[partial].message}`)
				return
			}

			// Aucune réponse ne correspond - c'est vraiment faux
			partialOnly = false
			errors.push(`(${count + 1}) aucune réponse ne correspond dans les solutions.`)
		})

		return makeCheckerResult(
			errors.length > 0
				? errors.join('<br/>')
				: "",
			partialOnly
		)

	}

}

const realSets = [
	'!!',
	'RR', "RR^**", "RR_+", "RR_+^**", "RR_-", "RR_-^**"
]

function isSimpleSet(value: string): boolean {
	return value[0] === '{' && value[value.length - 1] === '}'
}

function isInterval(value: string): boolean {
	return value.includes("[") || value.includes("]")
}

function isEmptyOrReal(value: string, withExtraBraces = false): boolean {
	return realSets.some(s => withExtraBraces
		? `{${s}}` === value
		: s === value)
}

function extractSetValues(value: string): string[] {
	return value
		.substring(1, value.length - 1)
		.split(";")
}


// TODO: SolutionChecker a revoir pour plus de cohérence.
// 1. cohérence de la réponse (le format)
// 2. correspondance format answer - value (les deux des intervalles, les deux des ensembles, ...)
// 3a. si c'est des ensembles :
//		a. nombre d'éléments
//		b. correspondance des valeurs avec checker secondaire.
// 3b. si c'est des intervalles :
// 		a. ordre des éléments (croisant)
// 		b. sens des crochets
// 		c. contrôle des valeurs (infini) et avec checker secondaire
