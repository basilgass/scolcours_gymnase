import {expect, test} from "vitest"
import {QcmChecker} from "@/Checkers/Custom/QcmChecker"

test('sélections justes dans un ordre différent', () => {
	const checker = new QcmChecker('')
	const result = checker.check('b,a', 'a,b')

	expect(result.result).toBe(true)
})

test('sélection fausse', () => {
	const checker = new QcmChecker('')
	const result = checker.check('a,c', 'a,b')

	expect(result.result).toBe(false)
	expect(result.message).toBe("La réponse n'est pas correcte")
})

test('sélection incomplète', () => {
	const checker = new QcmChecker('')
	const result = checker.check('a', 'a,b')

	expect(result.result).toBe(false)
	expect(result.message).toBe("La réponse n'est pas correcte")
})

test('format getter', () => {
	expect(new QcmChecker('').format).toBe('questionnaire à choix multiples')
})
