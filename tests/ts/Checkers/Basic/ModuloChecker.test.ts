import {expect, test} from "vitest"
import {ModuloChecker} from "@/Checkers/Basic/ModuloChecker"

test('congruence juste (valeur non identique, même classe)', () => {
	const checker = new ModuloChecker('')
	const result = checker.check('2mod5', '7mod5')

	expect(result.result).toBe(true)
})

test('mauvais modulo -> score 0.3', () => {
	const checker = new ModuloChecker('')
	const result = checker.check('2mod4', '7mod5')

	expect(result.result).toBe(false)
	expect(result.score).toBe(0.3)
	expect(result.message).toBe("le modulo n'est pas correct.")
})

test('valeur non congruente -> score 0', () => {
	const checker = new ModuloChecker('')
	const result = checker.check('3mod5', '7mod5')

	expect(result.result).toBe(false)
	expect(result.score).toBe(0)
	expect(result.message).toBe("la valeur n'est pas correcte.")
})

test('format sans mod refusé', () => {
	const checker = new ModuloChecker('')
	const result = checker.check('7', '7mod5')

	expect(result.result).toBe(false)
	expect(result.message).toContain('congruence')
})

test('format sans nombre avant le modulo', () => {
	const checker = new ModuloChecker('')
	const result = checker.check('mod5', '7mod5')

	expect(result.result).toBe(false)
	expect(result.message).toBe('il faut donner un nombre avant le modulo')
})

test('option + : valeur négative refusée', () => {
	const checker = new ModuloChecker('+')
	const result = checker.check('-3mod5', '2mod5')

	expect(result.result).toBe(false)
	expect(result.score).toBe(0.3)
	expect(result.message).toBe('la valeur doit être positive')
})

test('option + : valeur non minimale refusée', () => {
	const checker = new ModuloChecker('+')
	const result = checker.check('7mod5', '2mod5')

	expect(result.result).toBe(false)
	expect(result.score).toBe(0.4)
	expect(result.message).toBe("la valeur n'est pas le plus petit possible")
})

test('option + : valeur positive minimale acceptée', () => {
	const checker = new ModuloChecker('+')
	const result = checker.check('2mod5', '7mod5')

	expect(result.result).toBe(true)
})

test('format getter selon option +', () => {
	expect(new ModuloChecker('').format).toBe('réponse sous forme de congruence modulo')
	expect(new ModuloChecker('+').format).toContain('la plus petite possible')
})
