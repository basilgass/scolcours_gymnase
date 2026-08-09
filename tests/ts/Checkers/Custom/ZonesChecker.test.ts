import {expect, test} from "vitest"
import {ZonesChecker} from "@/Checkers/Custom/ZonesChecker"

test('zones justes dans un ordre différent', () => {
	const checker = new ZonesChecker('')
	const result = checker.check('b2,a1', 'a1,b2')

	expect(result.result).toBe(true)
})

test('deux zones dans la même colonne refusées', () => {
	const checker = new ZonesChecker('')
	const result = checker.check('a1,b1', 'a1')

	expect(result.result).toBe(false)
	expect(result.message).toBe('Il ne peut pas y avoir deux zones dans la même colonne')
})

test('zones manquantes', () => {
	const checker = new ZonesChecker('')
	const result = checker.check('a1', 'a1,b2')

	expect(result.result).toBe(false)
	expect(result.message).toBe('Il manque une ou plusieurs zones.')
})

test('zones en trop', () => {
	const checker = new ZonesChecker('')
	const result = checker.check('a1,b2,c3', 'a1,b2')

	expect(result.result).toBe(false)
	expect(result.message).toBe('Il y a une ou plusieurs zones en trop.')
})

test('une zone fausse (singulier)', () => {
	const checker = new ZonesChecker('')
	const result = checker.check('a1,b3', 'a1,b2')

	expect(result.result).toBe(false)
	expect(result.message).toBe('Il y a 1 zone fausse')
})

test('deux zones fausses (pluriel)', () => {
	const checker = new ZonesChecker('')
	const result = checker.check('c1,d2', 'a1,b2')

	expect(result.result).toBe(false)
	expect(result.message).toBe('Il y a 2 zones fausses')
})

test('format getter', () => {
	expect(new ZonesChecker('').format).toBe('sélectionner les zones')
})
