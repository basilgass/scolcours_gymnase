import {describe, expect, test} from "vitest"
import {matrixSolver} from "@/Components/Widgets/algebre/matrixSolver.ts"

describe('matrice augmentée - auto solve', () => {

	test('valeur non nulle, sur ou sous le pivot', () => {
		const M = matrixSolver.arrayToMatrix([
			2, 1, 0,
			1, 0, 0,
			4, 0, 3], 3)

		const MS = new matrixSolver(M)

		expect(MS.checkColumn({row: 0, col: 0})).toBeTruthy()
		expect(MS.checkColumn({row: 1, col: 1})).toBeFalsy()
		expect(MS.checkColumn({row: 0, col: 2})).toBeTruthy()
	})

	test('le 1 est dans la colonne, sur ou sous le pivot', () => {
		const M = matrixSolver.arrayToMatrix([
			2, 1, 1,
			1, 2, 2,
			4, 3, 1], 3)

		const MS = new matrixSolver(M)

		const ops = MS.moveOneToPivot({row: 0, col: 0})

		expect(ops).toHaveLength(1)
		expect(ops[0].target).toBe(1)
		expect(ops[0].operation).toBe('x')
		expect(ops[0].reference).toBe(0)

		const ops2 = MS.moveOneToPivot({row: 1, col: 1})
		expect(ops2).toHaveLength(0)

		const ops3 = MS.moveOneToPivot({row: 2, col: 2})
		expect(ops3).toHaveLength(0)

		expect(MS.matrix[0][0].display).toBe('1')

	})

	test('le 1 est constructible par gcd, sous ou sous le pivot', () => {
		const M = matrixSolver.arrayToMatrix([
			2, 1, 0,
			4, 8, -12,
			7, 0, 3], 3)

		const MS = new matrixSolver(M)

		const ops = MS.reduceLineByGcdToOne({row: 0, col: 0})

		expect(ops).toHaveLength(2)
		expect(MS.matrix[0][0].display).toBe('1')
		expect(MS.matrix[1][0].display).toBe('2')
	})

	test('le 1 est constructible par gcd, sous ou sous le pivot, avec une valeur négative', () => {
		const M = matrixSolver.arrayToMatrix([
			2, 1, 0,
			-4, 8, -12,
			7, 0, 3], 3)

		const MS = new matrixSolver(M)

		const ops = MS.reduceLineByGcdToOne({row: 0, col: 0})

		expect(ops).toHaveLength(2)
		expect(MS.matrix[0][0].display).toBe('1')
		expect(MS.matrix[1][0].display).toBe('2')
	})

	test('le 1 est constructible, sur ou sous le pivot', () => {
		const M = matrixSolver.arrayToMatrix([
			2, 1, 0,
			3, 0, 0,
			4, 0, 3], 3)

		const MS = new matrixSolver(M)

		const ops = MS.linearCombinationToOne({row: 0, col: 0})

		expect(ops).toHaveLength(1)
		expect(MS.matrix[0][0].display).toBe('2')
		expect(MS.matrix[1][0].display).toBe('1')
	})

	test('normalize line', () => {
		const M = matrixSolver.arrayToMatrix([
			2, 6, -8,
			3, 1, 1,
			0, 1, -4], 3)

		const MS = new matrixSolver(M)

		const ops = MS.normalizeLine({row: 0, col: 0})
		expect(ops).toHaveLength(1)

		MS.normalizeLine({row: 2, col: 2})

		expect(MS.matrix[0][0].display).toBe('1')
		expect(MS.matrix[0][1].display).toBe('3')
		expect(MS.matrix[0][2].display).toBe('-4')

		expect(MS.matrix[2][0].display).toBe('0')
		expect(MS.matrix[2][1].display).toBe('-1/4')
		expect(MS.matrix[2][2].display).toBe('1')
	})

	test('clean column', () => {
		const M = matrixSolver.arrayToMatrix([
			1, 3, 1,
			3, 1, 1,
			4, 4, 1], 3)

		const MS = new matrixSolver(M)

		MS.cleanColumnWithPivot({col: 0, row: 0})

		expect(MS.matrix[0][0].display).toBe('1')
		expect(MS.matrix[1][0].display).toBe('0')
		expect(MS.matrix[1][1].display).toBe('-8')
		expect(MS.matrix[1][2].display).toBe('-2')

		MS.restore()

		const ops = MS.cleanColumnWithPivot({col: 1, row: 1})

		expect(ops).toHaveLength(2)
		expect(MS.matrix[0][1].display).toBe('0')
		expect(MS.matrix[1][1].display).toBe('1')
		expect(MS.matrix[2][1].display).toBe('0')
	})

	test('auto solve', () => {
		const M = matrixSolver.arrayToMatrix([
			2, 1, 0,
			1, 0, 0,
			4, 0, 3], 3)

		const MS = new matrixSolver(M)

		MS.solve()

		expect(MS.operations).toHaveLength(4)

		MS.matrix.forEach((row, i) => {
			row.forEach((aij, j) => {
				expect(aij.display).toBe(i === j ? '1' : '0')
			})
		})
	})

	test('auto solve random', () => {
		const M = matrixSolver.arrayToMatrix([
			-8, -1, 2,
			4, 4, 8,
			-5, -3, 5], 3)

		const MS = new matrixSolver(M)
		MS.solve()

		MS.matrix.forEach((row, i) => {
			row.forEach((aij, j) => {
				expect(aij.display).toBe(i === j ? '1' : '0')
			})
		})
	})

	test('auto solve random with separator', () => {
		const M = matrixSolver.arrayToMatrix([
			2, 1, -1, 1,
			1, 2, 1, 8,
			3, -1, 2, 7
		], 4)

		const MS = new matrixSolver(M)
		MS.solve()

		MS.matrix.forEach((row, i) => {
			row.forEach((aij, j) => {
					if (j < row.length - 1) {
						expect(aij.display).toBe(i === j ? '1' : '0')
					}
				}
			)
		})

		expect(MS.matrix[0][3].display).toBe('1')
		expect(MS.matrix[1][3].display).toBe('2')
		expect(MS.matrix[2][3].display).toBe('3')
	})

	test('auto solve completely random row', () => {
		const M = matrixSolver.arrayToMatrix([
			3, 1, 5, 1,
			7, 13, 11, 8,
			9, 15, 17, 7,
		], 4)

		const MS = new matrixSolver(M, 3)

		MS.solve()

		expect(MS.matrix[0][3].display).toBe('71/44')
		expect(MS.matrix[1][3].display).toBe('21/44')
		expect(MS.matrix[2][3].display).toBe('-19/22')

	})

	test('auto solve : 2.12', () => {
		const M = matrixSolver.arrayToMatrix([
			2, 0, 2, 1, 0,
			0, 1, 4, 0, 0,
			3, 1, 7, -4, 0,
			4, -1, 0, -1, 0
		], 5)

		const MS = new matrixSolver(M, 4)

		MS.solve()

		expect(MS.matrix[0][0].display).toBe('1')
		expect(MS.matrix[1][1].display).toBe('1')
		expect(MS.matrix[2][3].display).toBe('1')
		MS.matrix[3].forEach((aij) => {
			expect(aij.display).toBe('0')
		})

	})
})
