import {CheckerAbstract, CheckerResult, CHECKERS, makeCheckerResult} from "@/Checkers"

// const name = "matrix"
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
		const [rows, columns] = dim.split("x").map(Number)
		const values = v?.split(',') ?? []

		return {
			dimension: {rows, columns},
			values
		}
	}

	get format(): string {
		return `${this.#fixedDimension ? ` Matrice($ { this.#fixedDimension } ) ` : 'Matrice'}<br/>${this.secondaryChecker?.format}`
	}

	override checkValue(value: string): CheckerResult {
		const answerData = this.parse(this.answer)
		const givenData = this.parse(value)

		// Check sur les dimensions
		if (givenData.dimension.rows === 0 ||
			isNaN(givenData.dimension.columns) ||
			givenData.dimension.columns === 0) {
			return makeCheckerResult("il faut donner les dimensions de la matrice.")
		}

		if (givenData.dimension.rows !== answerData.dimension.rows ||
			givenData.dimension.columns !== answerData.dimension.columns) {
			return makeCheckerResult("les dimensions de la matrice ne sont pas juste.")
		}

		// Les valeurs données ne sont pas suffisantes
		const nbOfValues = givenData.dimension.rows * givenData.dimension.columns
		if (givenData.values.length !== nbOfValues) {
			return makeCheckerResult(
				givenData.values.length < nbOfValues
					? "il manque des valeurs par rapport aux dimensions de la matrice"
					: "il y a trop de valeurs par rapport aux dimensions de la matrice"
			)
		}

		// Les valeurs doivent correspondre, dans l'ordre.
		const n = givenData.dimension.columns

		return this.secondaryCheckValues(
			givenData.values,
			answerData.values,
			(i: number, message: string) => {
				const row = Math.floor(i / n) + 1
				const col = i % n + 1
				return `\\(a_{ ${row}${col} }\\): ${message}`
			}
		)
	}


}
