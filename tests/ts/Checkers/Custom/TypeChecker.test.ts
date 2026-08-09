import {expect, test} from "vitest"
import {TypeChecker} from "@/Checkers/Custom/TypeChecker"

test('getter format : consigne fixe', () => {
	expect(new TypeChecker('').format).toBe("Cliquer sur les bonnes lettres.")
})

test('réponse correcte (casse identique)', () => {
	const checker = new TypeChecker('')
	// 'AB' === 'AB' -> court-circuit égalité exacte de check()
	const result = checker.check('AB', 'AB')

	expect(result.result).toBe(true)
})

test('réponse correcte insensible à la casse', () => {
	const checker = new TypeChecker('')
	// 'ab' !== 'AB' -> passe par checkValue, comparaison en majuscules -> juste
	const result = checker.check('ab', 'AB')

	expect(result.result).toBe(true)
})

test('réponse fausse signalée', () => {
	const checker = new TypeChecker('')
	const result = checker.check('AC', 'AB')

	expect(result.result).toBe(false)
	expect(result.message).toBe("La réponse n'est pas correcte")
})

test('valeur vide court-circuitée', () => {
	const checker = new TypeChecker('')
	const result = checker.check('', 'AB')

	expect(result.result).toBe(false)
	expect(result.message).toBe("Veuillez entrer une valeur")
})
