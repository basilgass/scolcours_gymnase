import {CheckerAbstract, makeCheckerResult} from "../CheckerAbstract"
import {CheckerResult, CHECKERS} from "../checker.config"

const description = `draw
@input=A,B,C
@p=<pidraw parameters>
pidraw code`

export class DrawChecker extends CheckerAbstract {
	readonly format = "déplacer les points"

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.DRAW
		this.description = description
	}

	checkValue(value: string): CheckerResult {
		// On peut vérifier point par point
		const points = value.split(',')
		const answerPoints = this.answer.split(',')

		const errors: string[] = []
		points.forEach((pt, index) => {
			if (pt !== answerPoints[index]) {
				errors.push(`(${index + 1}): le point n'est pas juste.`)
			}
		})


		return makeCheckerResult(errors.join('<br>'))
	}

}
