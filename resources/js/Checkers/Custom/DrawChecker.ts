import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"

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
