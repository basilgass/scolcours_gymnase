import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"
import {Polynom} from "pimath"

const description = `draw
@sort
@input=A,B,C
@p=<pidraw parameters>
pidraw code`

export class DrawChecker extends CheckerAbstract {
	#sort: boolean
	readonly format = "déplacer les points"

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.DRAW
		this.description = description

		this.#sort = this.config.includes('sort')
	}

	checkValue(value: string): CheckerResult {
		if (this.answer.startsWith('y=')) {
			// il s'agit d'un cas de contrôle d'une fonction.
			const af = new Polynom(this.answer.split('y=')[1])
			const am = af.monomByDegree().coefficient

			const gf = new Polynom(value.split('y=')[1])
			const gm = gf.monomByDegree().coefficient

			if (!am.isEqual(gm)) {
				return makeCheckerResult("La pente n'est pas juste.")
			}

			const aH = af.monomByDegree(0).coefficient
			const gH = gf.monomByDegree(0).coefficient

			if (!aH.isEqual(gH)) {
				return makeCheckerResult("L'ordonnée à l'origine n'est pas juste.")
			}

			return makeCheckerResult()
		}

		// On vérifie point par point
		const points = value.split(',')
		const answerPoints = this.answer.split(',')

		if (this.#sort) {
			points.sort()
			answerPoints.sort()
		}

		const errors: string[] = []
		points.forEach((pt, index) => {
			if (pt !== answerPoints[index]) {
				errors.push(`(${index + 1}): le point n'est pas juste.`)
			}
		})

		if (errors.length > 0) {
			return makeCheckerResult(errors, points.length / errors.length)
		}

		return makeCheckerResult()
	}
}
