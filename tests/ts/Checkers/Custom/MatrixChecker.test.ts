import {expect, test} from "vitest"
import {MatrixChecker} from "@/Checkers/Custom/MatrixChecker"
import {NumberChecker} from "@/Checkers/Basic/NumberChecker"

function makeChecker(config = ''): MatrixChecker {
	const checker = new MatrixChecker(config)
	// MatrixChecker délègue la comparaison des cellules à un checker secondaire :
	// sans lui, secondaryCheckValues -> requireSecondaryChecker() jette.
	checker.secondaryChecker = new NumberChecker('')
	return checker
}

test('dimensions manquantes', () => {
	const checker = makeChecker()
	const result = checker.check('2;1,2', '2x2;1,2,3,4')

	expect(result.result).toBe(false)
	expect(result.message).toBe('il faut donner les dimensions de la matrice.')
})

test('dimensions fausses', () => {
	const checker = makeChecker()
	const result = checker.check('3x2;1,2,3,4,5,6', '2x2;1,2,3,4')

	expect(result.result).toBe(false)
	expect(result.message).toBe('les dimensions de la matrice ne sont pas juste.')
})

test('valeurs manquantes', () => {
	const checker = makeChecker()
	const result = checker.check('2x2;1,2,3', '2x2;1,2,3,4')

	expect(result.result).toBe(false)
	expect(result.message).toBe('il manque des valeurs par rapport aux dimensions de la matrice')
})

test('valeurs en trop', () => {
	const checker = makeChecker()
	const result = checker.check('2x2;1,2,3,4,5', '2x2;1,2,3,4')

	expect(result.result).toBe(false)
	expect(result.message).toBe('il y a trop de valeurs par rapport aux dimensions de la matrice')
})

test('une cellule fausse', () => {
	const checker = makeChecker()
	const result = checker.check('2x2;1,2,3,9', '2x2;1,2,3,4')

	expect(result.result).toBe(false)
})

test('matrice juste malgré une écriture différente', () => {
	const checker = makeChecker()
	const result = checker.check('2x2;1.0,2,3,4', '2x2;1,2,3,4')

	expect(result.result).toBe(true)
})
