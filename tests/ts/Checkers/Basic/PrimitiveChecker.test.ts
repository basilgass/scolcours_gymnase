import {expect, test} from "vitest"
import {PrimitiveChecker} from "@/Checkers/Basic/PrimitiveChecker"

test('polynôme juste mais constante manquante -> score 0.8', () => {
	const checker = new PrimitiveChecker('')
	const result = checker.check('x^2', 'x^2+c')

	expect(result.result).toBe(false)
	expect(result.score).toBe(0.8)
	expect(result.message).toBe('il manque la constante...')
})

test('primitive polynomiale fausse', () => {
	const checker = new PrimitiveChecker('')
	const result = checker.check('x^3+c', 'x^2+c')

	expect(result.result).toBe(false)
})

test('branche exponentielle atteinte (constante manquante)', () => {
	const checker = new PrimitiveChecker('')
	const result = checker.check('e^x', 'e^x+c')

	expect(result.result).toBe(false)
	expect(result.message).toBe('il manque la constante...')
})

test('branche logarithme atteinte (constante manquante)', () => {
	const checker = new PrimitiveChecker('')
	const result = checker.check('ln(x)', 'ln(x)+c')

	expect(result.result).toBe(false)
	expect(result.message).toBe('il manque la constante...')
})

test('format getter', () => {
	expect(new PrimitiveChecker('').format).toBe("primitive d'une fonction")
})
