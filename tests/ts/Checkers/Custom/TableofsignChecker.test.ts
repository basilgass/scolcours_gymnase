import {expect, test} from "vitest"
import {TableofsignChecker} from "@/Checkers/Custom/TableofsignChecker"

// Format d'une réponse : zeroes@signs@croissance@coordonnées
// n zéros -> la ligne de signes doit avoir 2n+1 colonnes.

// --- checkFormat ---

test('format : ligne de signes absente', () => {
	const checker = new TableofsignChecker('')
	const result = checker.check('-2,3', '-2,3@+z-z+')

	expect(result.result).toBe(false)
	expect(result.message).toBe('il faut entrer des signes.')
})

test('format : ligne de signes trop courte', () => {
	const checker = new TableofsignChecker('')
	const result = checker.check('-2,3@+z-', '-2,3@+z-z+')

	expect(result.result).toBe(false)
	expect(result.message).toBe('il manque des éléments dans la ligne des signes.')
})

test('format : signe non compatible', () => {
	const checker = new TableofsignChecker('')
	const result = checker.check('-2,3@+z-zx', '-2,3@+z-z+')

	expect(result.result).toBe(false)
	expect(result.message).toBe('il y a des signes non compatibles.')
})

// --- checkValue : zéros ---

test('zéros manquants', () => {
	const checker = new TableofsignChecker('')
	const result = checker.check('-2@-z+', '-2,3@+z-z+')

	expect(result.result).toBe(false)
	expect(result.message).toBe('il manque des zéros')
})

test('zéros dans le mauvais ordre', () => {
	const checker = new TableofsignChecker('')
	const result = checker.check('3,-2@+z-z+', '-2,3@+z-z+')

	expect(result.result).toBe(false)
	expect(result.message).toBe('les zéros ne sont pas dans l\'ordre croissant')
})

test('valeur de zéro fausse', () => {
	const checker = new TableofsignChecker('')
	const result = checker.check('-2,4@+z-z+', '-2,3@+z-z+')

	expect(result.result).toBe(false)
})

// --- checkValue : signes / croissance / coordonnées ---

test('signes faux', () => {
	const checker = new TableofsignChecker('')
	const result = checker.check('-2,3@+z+z+', '-2,3@+z-z+')

	expect(result.result).toBe(false)
	expect(result.message).toBe('les signes ne sont pas justes')
})

test('croissance fausse', () => {
	const checker = new TableofsignChecker('')
	const result = checker.check('-2,3@+z-z+@bbbbb', '-2,3@+z-z+@aaaaa')

	expect(result.result).toBe(false)
	expect(result.message).toBe('la croissance n\'est pas juste')
})

test('coordonnée d\'extrême fausse', () => {
	const checker = new TableofsignChecker('c')
	const result = checker.check('-2,3@+z-z+@ddddd@(0;9)', '-2,3@+z-z+@ddddd@(0;5)')

	expect(result.result).toBe(false)
})

// --- getter format ---

test('getter format : tableau de signes par défaut', () => {
	expect(new TableofsignChecker('').format).toBe('Tableau de signes')
})

test('getter format : tableau de croissance (g)', () => {
	expect(new TableofsignChecker('g').format).toBe('Tableau de croissance')
})

test('getter format : coordonnées (c)', () => {
	expect(new TableofsignChecker('c').format).toContain('Coordonnées')
})
