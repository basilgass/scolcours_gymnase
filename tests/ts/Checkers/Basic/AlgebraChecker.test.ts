import {expect, test} from "vitest"
import {AlgebraChecker} from "@/Checkers/Basic/AlgebraChecker"

test('équivalence après normalisation des multiplications', () => {
	// normalizeExpression retire les multiplications explicites -> '2*x' === '2x'
	const checker = new AlgebraChecker('')
	const result = checker.check('2*x', '2x')

	expect(result.result).toBe(true)
})

test('équivalence par évaluation numérique (2x+x == 3x)', () => {
	const checker = new AlgebraChecker('')
	const result = checker.check('2x+x', '3x')

	expect(result.result).toBe(true)
})

test('expression fausse détectée par comparaison numérique', () => {
	const checker = new AlgebraChecker('')
	const result = checker.check('x', '2x')

	expect(result.result).toBe(false)
	expect(result.message).toContain('comparaison numérique')
})

test('config frac : construit et valide une équivalence', () => {
	const checker = new AlgebraChecker('frac')
	const result = checker.check('2x+x', '3x')

	expect(result.result).toBe(true)
})
