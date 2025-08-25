import {Fraction, InputValue, Numeric, Polynom} from "pimath"
import type {matriceAugmenteeInterface} from "@/Components/Widgets/algebre/matrice-augmentee.vue"

/**
 * Résoluteur de matrice, avec étapes
 * 1. Dans la première colonne, on recherche le premier pivot -> (0,0)
 * 2. On supprime les autres valeurs dans la colonne
 *
 */

interface pivotInterface {
	row: number,
	col: number,
}

export class matrixSolver {
	#matrix: Fraction[][]
	#original: Fraction[][]
	#operations: Partial<matriceAugmenteeInterface>[]
	#pivot: { row: number, col: number }
	#separatorIndex: number

	constructor(matrix: Fraction[][], separator?: number) {
		this.#original = matrix.map(row => row.map(v => v.clone()))
		this.#matrix = matrix
		this.#operations = []
		this.#pivot = {row: 0, col: 0}
		this.#separatorIndex = separator ?? matrix[0].length
	}

	get original(): Fraction[][] {
		return this.#original
	}

	set original(original: Fraction[][]) {
		this.#original = original
	}

	get separatorIndex(): number {
		return this.#separatorIndex
	}

	set separatorIndex(value: number) {
		this.#separatorIndex = value
	}

	get matrix(): Fraction[][] {
		return this.#matrix
	}

	set matrix(matrix: Fraction[][]) {
		this.#matrix = matrix
	}

	get display(): string[][] {
		return this.#matrix.map(row => row.map(x => x.display))
	}

	get displayO(): string[][] {
		return this.#original.map(row => row.map(x => x.display))
	}

	get operations(): Partial<matriceAugmenteeInterface>[] {
		return this.#operations
	}

	get pivot(): { row: number; col: number } {
		return this.#pivot
	}

	set pivot(value: { row: number; col: number }) {
		this.#pivot = value
	}

	get pivotValue(): Fraction {
		return this.#matrix[this.#pivot.row][this.#pivot.col]
	}

	static arrayToMatrix(a: (number | string)[], rowLength: number): Fraction[][] {
		const M: Fraction[][] = []
		let row: Fraction[] = []
		for (let i = 0; i < a.length; i++) {
			if (i % rowLength === 0 && i > 0) {
				M.push(row)
				row = []
			}

			row.push(new Fraction(a[i]))
		}
		M.push(row)

		return M
	}

	static toFractionMatrix(polyMatrix: Polynom[][]): Fraction[][] {
		return polyMatrix.map(line => {
			return line.map((polynom: Polynom) => {
				return polynom.monomByDegree(0).coefficient.clone()
			})
		})
	}

	static gcd(matrix: Fraction[][], lineId: number, separatorIndex?: number): number {
		const row = matrix[lineId]

		const maxIndex = separatorIndex ?? row.length

		/** On ne peut pas avoir une pgcd dans les situations suivantes:
		 * - une des valeurs est une fraction
		 * - une des valeurs est 1 ou -1.
		 *
		 * On regarde toutes les valeurs qui sont avant le séparateur maxIndex
		 * */

		if (
			row
				.filter((value, i) => {
					return i < maxIndex && !value.isZero()
				})
				.some(value => {
					return !value.isRelative()
						|| value.clone().abs().isOne()
				})
		) {
			return 0
		}

		// Chaque valeur est un nombre.
		return Numeric.gcd(...row.map(x => x.value))
	}

	static swapLines<T>(arr: T[], index1: number, index2: number): void {
		if (index1 < 0 || index2 < 0 || index1 >= arr.length || index2 >= arr.length) {
			throw new Error("Indices out of bounds")
		}

		[arr[index1], arr[index2]] = [arr[index2], arr[index1]]
	}

	static multiplyByScalar(arr: (Fraction[] | Polynom[])[], target: number, value: InputValue<Fraction>): void {
		arr[target].forEach((aij) => {
			aij.multiply(value)
		})
	}

	static linearCombination(arr: Fraction[][] | Polynom[][], target: number, scalar: InputValue<Fraction>, reference: number): void {
		arr[target].forEach((aij, index) => {
			aij.add(
				arr[reference][index].clone()
					.multiply(new Fraction(scalar))
			)
		})
	}

	restore() {
		this.#matrix = this.#original.map(row => row.map(v => v.clone()))
	}

	column(colIndex: number): Fraction[] {
		return this.#matrix.map(x=>x[colIndex])
	}

	solve(): Partial<matriceAugmenteeInterface>[] {
		this.#operations = []
		this.#pivot = {row: 0, col: 0}

		// Reset the matrix to the original state
		this.restore()

		// La première colonne commence par 1 et n'a plus que des zéros.
		while (this.#pivot.col < this.#separatorIndex && this.#pivot.row < this.#matrix.length) {
			// Les operations pour la colonne en cours.
			let stepOperations: Partial<matriceAugmenteeInterface>[] = []

			// On contrôle si tous les éléments sous le pivot actuel (col+1) il n'y a que des zéros
			// → pas possible de trouver un pivot
			// → on passe à la colonne suivante.
			if (!this.checkColumn(this.#pivot)) {
				this.#pivot.col++
				continue
			}

			// Il y a un pivot constructible.
			if (!this.pivotValue.isOne()) {
				// Recherche du 1 (un) sur le pivot ou en dessous
				stepOperations = this.moveOneToPivot(this.#pivot)

				// Tentative de réduction d'une ligne par le pgcd
				if (stepOperations.length === 0) {
					stepOperations = this.reduceLineByGcdToOne(this.#pivot)
				}

				// Recherche d'un 1 (un) constructible par combinaison linéaire simple
				if (stepOperations.length === 0) {
					stepOperations = this.linearCombinationToOne(this.#pivot)

					if (stepOperations.length > 0 && !this.pivotValue.isOne()) {
						stepOperations.push(...this.moveOneToPivot(this.#pivot))
					}
				}


				if (stepOperations.length === 0) {
					// méthode brute.
					stepOperations = this.normalizeLine(this.#pivot)
				}

				// a partir d'ici, on a le pivot = 1 en (0,0)
				this.#operations.push(...stepOperations)
			}

			this.#operations.push(...this.cleanColumnWithPivot(this.#pivot))

			// On va vers le point pivot suivant
			this.#pivot.col++
			this.#pivot.row++
		}

		return this.#operations
	}

	updateMatrix(op: Partial<matriceAugmenteeInterface>): Partial<matriceAugmenteeInterface> {
		switch (op.operation) {
			case 'x':
				matrixSolver.swapLines(this.#matrix, op.target, op.reference)
				break
			case '+':
				matrixSolver.linearCombination(this.#matrix, op.target, op.value, op.reference)
				break
			case '-':
				matrixSolver.linearCombination(this.#matrix, op.target, new Fraction(op.value).opposite(), op.reference)
				break
			case '*':
				matrixSolver.multiplyByScalar(this.#matrix, op.target, op.value)
				break
			case '/':
				matrixSolver.multiplyByScalar(this.#matrix, op.target, new Fraction(op.value).inverse())
				break
		}

		return op
	}


	checkColumn(pivot: pivotInterface): boolean {
		// il doit y avoir au moins une valeur au pivot ou en-dessus
		return this.#matrix
			.filter((_, index) => index >= pivot.row) // que les lignes à partir du pivot ou en dessous.
			.map(row => row[pivot.col]) // On ne regarde que les valeurs de la colonne du pivot
			.some(value => !value.isZero()) // une des valeurs n'est pas nul
	}

	moveOneToPivot(pivot: pivotInterface): Partial<matriceAugmenteeInterface>[] {
		const lineWithOne = this.#matrix.findIndex((line, i) => {
			return i>pivot.row && line[pivot.col].isOne()
		})

		// Il n'y a pas de un
		if (lineWithOne === -1) {
			return []
		}

		// Il y a un 1, mais est en-dessus du pivot
		if (lineWithOne <= pivot.row) {
			return []
		}

		// On modifie la matrice
		return [this.updateMatrix({
			target: lineWithOne,
			operation: 'x',
			reference: pivot.row,
		})]
	}

	reduceLineByGcdToOne(pivot: pivotInterface): Partial<matriceAugmenteeInterface>[] {
		// On regarde toutes les valeurs de la ligne en cours, ou en dessous.

		for (let i = pivot.row; i < this.matrix.length; i++) {
			const gcd = matrixSolver.gcd(this.#matrix, i, this.#separatorIndex)
			const value = this.#matrix[i][pivot.col].value

			if (gcd === 0 || gcd !== Math.abs(value)) {
				continue
			}

			const ops: Partial<matriceAugmenteeInterface>[] = [
				{
					target: i,
					operation: '/',
					value: (value > 0 ? gcd : -gcd).toString()
				}
			]

			if (i > pivot.row) {
				// La ligne qui contiendra le 1 n'est pas la ligne du pivot -> permuter.
				ops.push({
					target: i,
					operation: 'x',
					reference: pivot.row
				})
			}

			ops.forEach(op => {
				this.updateMatrix(op)
			})

			return ops
		}

		return []
	}

	linearCombinationToOne(pivot: pivotInterface): Partial<matriceAugmenteeInterface>[] {

		/**
		 * On ne traite que la ligne du pivot et en-dessous.
		 * -> x et y sont interchangeables.
		 * -> x+ny = 1  => n = (-x+1)/y
		 * -> x+ny = -1 => n = (-x-1)/y
		 */

		// (-x+1)/y=n
		for (let lineIndex = pivot.row; lineIndex < this.#matrix.length; lineIndex++) {
			const x = this.#matrix[lineIndex][pivot.col].clone()

			if (x.isZero()) {
				continue
			}

			for (let line2Index = pivot.row; line2Index < this.#matrix.length; line2Index++) {
				if (lineIndex !== line2Index) {
					const y = this.#matrix[line2Index][pivot.col]

					if (y.isZero()) {
						continue
					}

					// (-x+1)/y=n
					const F = x.clone().opposite().add(1).divide(y)
					if (F.isRelative()) {
						return [this.updateMatrix(
							{
								target: lineIndex,
								operation: F.isPositive() ? '+' : '-',
								value: F.abs().display,
								reference: line2Index,
							}
						)]
					}

				}
			}
		}

// (-x-1)/y=n
		for (let lineIndex = pivot.row; lineIndex < this.#matrix.length; lineIndex++) {
			const x = this.#matrix[lineIndex][pivot.col].clone()

			if (x.isZero()) {
				continue
			}
			for (let line2Index = pivot.row; line2Index < this.#matrix.length; line2Index++) {
				if (lineIndex !== line2Index) {
					const y = this.#matrix[line2Index][pivot.col]
					if (y.isZero()) {
						continue
					}
					// (-x-1)/y=n
					const F = x.clone().opposite().subtract(1).divide(y)
					if (F.isRelative()) {
						return [
							this.updateMatrix(
								{
									target: lineIndex,
									operation: F.isPositive() ? '+' : '-',
									value: F.abs().display,
									reference: line2Index,
								}
							),
							this.updateMatrix(
								{
									target: lineIndex,
									operation: "*",
									value: '-1',
								}
							)
						]
					}
				}
			}
		}

		return []
	}

	normalizeLine(pivot: pivotInterface): Partial<matriceAugmenteeInterface>[] {
		const v = this.#matrix[pivot.row][pivot.col]

		if (v.isZero()) {
			return []
		}

		return [this.updateMatrix({
			target: pivot.row,
			operation: '/',
			value: v.clone().display
		})]
	}

	cleanColumnWithPivot(pivot: pivotInterface): Partial<matriceAugmenteeInterface>[] {
		const ops: Partial<matriceAugmenteeInterface>[] = []

		this.#matrix.forEach((row, index) => {
			if (index !== pivot.row && !row[pivot.col].isZero()) {
				const F = row[pivot.col].clone()

				ops.push(
					this.updateMatrix(
						{
							target: index,
							operation: F.isPositive() ? '-' : '+',
							reference: pivot.row,
							value: F.abs().display
						}
					)
				)
			}
		})

		return ops
	}
}

