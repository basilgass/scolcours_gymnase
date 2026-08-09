import {expect, test} from "vitest"
import {InputChecker} from "@/Checkers/Basic/InputChecker"

test('getter format : réponse textuelle', () => {
	expect(new InputChecker('').format).toBe("Réponse textuelle")
})

test('sans norm : seule l\'égalité exacte (via check) passe', () => {
	const checker = new InputChecker('')
	// 'hello world' === 'hello world' -> court-circuit égalité exacte
	expect(checker.check('hello world', 'hello world').result).toBe(true)
})

test('sans norm : différence de casse rejetée (pas de normalisation)', () => {
	const checker = new InputChecker('')
	// 'Hello' !== 'hello' -> checkValue sans normalisation -> faux
	const result = checker.check('Hello', 'hello')

	expect(result.result).toBe(false)
	expect(result.message).toBe("La réponse n'est pas correcte")
})

test('norm : normalisation rend deux variantes équivalentes', () => {
	const checker = new InputChecker('norm')
	// La casse/accents/espaces sont normalisés par Cipher._normalize
	const result = checker.check('Hello  World', 'hello world')

	expect(result.result).toBe(true)
})

test('norm : réponse réellement différente reste fausse', () => {
	const checker = new InputChecker('norm')
	const result = checker.check('foo', 'bar')

	expect(result.result).toBe(false)
	expect(result.message).toBe("La réponse n'est pas correcte")
})
