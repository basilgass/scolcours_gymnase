import {expect, test} from "vitest"
import {StudyChecker} from "@/Checkers/Custom/StudyChecker"

test('éléments justes dans un ordre différent', () => {
	const checker = new StudyChecker('')
	const result = checker.check('b,a', 'a,b')

	expect(result.result).toBe(true)
})

test('éléments manquants', () => {
	const checker = new StudyChecker('')
	const result = checker.check('a', 'a,b')

	expect(result.result).toBe(false)
	expect(result.message).toBe('il manque 1 élément')
})

test('éléments en trop', () => {
	const checker = new StudyChecker('')
	const result = checker.check('a,b,c', 'a,b')

	expect(result.result).toBe(false)
	expect(result.message).toBe('il y a 1 élément en trop')
})

test('erreurs sur les éléments (préfixe différent)', () => {
	const checker = new StudyChecker('')
	const result = checker.check('x,y', 'a,b')

	expect(result.result).toBe(false)
	expect(result.message).toBe('il y a 2 erreurs')
})

test('erreurs dans le tracé (même préfixe, valeur différente)', () => {
	const checker = new StudyChecker('')
	const result = checker.check('a&1,b&2', 'a&9,b&8')

	expect(result.result).toBe(false)
	expect(result.message).toBe('il y a 2 erreurs dans le tracé')
})

test('format getter', () => {
	expect(new StudyChecker('').format).toBe('Tracer le graphe')
})
