import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"

const description = `draw
@sort
@input=A,B,C
@p=<pidraw parameters>
pidraw code`

export class ZonesChecker extends CheckerAbstract {
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
		const zonesG = value.split(',')
		const zonesA = this.answer.split(',')

		zonesG.sort()
		zonesA.sort()

		if (zonesG.length < zonesA.length) {
			return makeCheckerResult("Il manque une ou plusieurs zones.")
		} else if (zonesG.length > zonesA.length) {
			return makeCheckerResult("Il y a une ou plusieurs zones en trop.")
		}

		const diff = new Set(zonesG).difference(new Set(zonesA))
		const n = diff.size
		if (n > 0) {
			return makeCheckerResult(`Il y a ${n} zone${n > 1 ? 's' : ''} fausse${n > 1 ? 's' : ''}`)
		}
		return makeCheckerResult()
	}
}
