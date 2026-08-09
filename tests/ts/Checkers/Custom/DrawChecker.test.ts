import {expect, test} from "vitest"
import {DrawChecker} from "@/Checkers/Custom/DrawChecker"

test('points justes (ordre identique)', () => {
	const checker = new DrawChecker('')
	const result = checker.check('A,C', 'A,B')

	expect(result.result).toBe(false)
	expect(result.message).toBe('(2): le point n\'est pas juste.')
})

test('sort : points justes dans un ordre différent', () => {
	const checker = new DrawChecker('sort')
	const result = checker.check('B,A', 'A,B')

	expect(result.result).toBe(true)
})

test('cas fonction y= : pente fausse', () => {
	const checker = new DrawChecker('')
	const result = checker.check('y=3x+1', 'y=2x+1')

	expect(result.result).toBe(false)
	expect(result.message).toBe("La pente n'est pas juste.")
})

test('cas fonction y= : ordonnée à l\'origine fausse', () => {
	const checker = new DrawChecker('')
	const result = checker.check('y=2x+5', 'y=2x+1')

	expect(result.result).toBe(false)
	expect(result.message).toBe("L'ordonnée à l'origine n'est pas juste.")
})

test('cas fonction y= : juste malgré une écriture différente', () => {
	const checker = new DrawChecker('')
	const result = checker.check('y=2x+1', 'y=1+2x')

	expect(result.result).toBe(true)
})

test('format getter', () => {
	expect(new DrawChecker('').format).toBe('déplacer les points')
})
