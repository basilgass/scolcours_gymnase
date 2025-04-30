import {CheckerAbstract} from "../CheckerAbstract"
import {CHECKERS} from "../checker.config"

const name = "matrix"
const description = `matrix,[paramètres]

**paramètres**
Basic checker
`

interface dimensionType {
	rows: number,
	columns: number
}

export class MatrixChecker extends CheckerAbstract {
	#fixedDimension: string

	constructor(config: string[] | string) {
		super(config)
		this.type = CHECKERS.MATRIX
		this.description = description

		this.#fixedDimension = (config as string[])
			.filter(x => x.startsWith('dim:'))[0]?.split('dim:')[1] ?? undefined
	}

	parse(value: string): { dimension: dimensionType, values: string[] } {
		const [dim, v] = value.split(";")
		const [rows, columns] = value.split("x").map(Number)
		const values = v?.split(',') ?? []

		return {
			dimension: {rows, columns},
			values
		}
	}

	get format(): string {
		return this.#fixedDimension ? `Matrice (${this.#fixedDimension})` : 'Matrice'
	}

	override checkValue(value: string): string {

		const answerData = this.parse(this.answer)
		const givenData = this.parse(value)


		// Check sur les dimensions
		if (givenData.dimension.rows === 0 ||
			isNaN(givenData.dimension.columns) ||
			givenData.dimension.columns === 0) {
			return "il faut donner les dimensions de la matrice."
		}

		if (givenData.dimension.rows !== answerData.dimension.rows ||
			givenData.dimension.columns !== answerData.dimension.columns) {
			return "les dimensions de la matrice ne sont pas juste."
		}

		// Check sur les valeurs

		return ""
	}


}
