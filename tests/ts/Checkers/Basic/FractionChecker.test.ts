import {expect, test} from "vitest"
import {FractionChecker} from "@/Checkers/Basic/FractionChecker"

test('getter format : sans option', () => {
	expect(new FractionChecker('').format).toBe("réponse sous forme de fraction")
})

test('getter format : réduite', () => {
	expect(new FractionChecker('r').format).toContain("réduite")
})

test('checkFormat : numérateur non numérique', () => {
	const checker = new FractionChecker('')
	const result = checker.check('a/3', '1/3')

	expect(result.result).toBe(false)
	expect(result.message).toBe("Le numérateur n'est pas un nombre.")
})

test('checkFormat : dénominateur non numérique', () => {
	const checker = new FractionChecker('')
	const result = checker.check('1/b', '1/3')

	expect(result.result).toBe(false)
	expect(result.message).toBe("Le dénominateur n'est pas un nombre.")
})

test('checkFormat : fraction vide refusée', () => {
	const checker = new FractionChecker('')
	// '1/2=' -> la seconde partie est vide
	const result = checker.check('1/2=', '1/2')

	expect(result.result).toBe(false)
	expect(result.message).toBe("merci de donner une fraction...")
})

test('chaîne d\'égalités équivalentes acceptée', () => {
	const checker = new FractionChecker('')
	// 2/4 = 1/2 : toutes équivalentes, dernière valeur = réponse
	const result = checker.check('2/4=1/2', '1/2')

	expect(result.result).toBe(true)
})

test('chaîne d\'égalités non équivalentes signalée', () => {
	const checker = new FractionChecker('')
	const result = checker.check('1/2=1/3', '1/3')

	expect(result.result).toBe(false)
	expect(result.message).toContain('ne sont pas équivalents')
})

test('detect exact value', () => {
	const config = ''
	const expected = '2/3'
	const given = '2/3'

	const checker = new FractionChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeTruthy()
})

test('similar fraction, not reduced', () => {
	const config = ''
	const expected = '2/3'
	const given = '4/6'

	const checker = new FractionChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeTruthy()
})

test('similar fraction, reduced', () => {
	const config = 'r'
	const expected = '2/3'
	const given = '4/6'

	const checker = new FractionChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeFalsy()
	expect(result.message).toEqual('La fraction n\'est pas réduite.')
})

test('wrong formatted fraction', () => {
	const config = 'r'
	const expected = '-2/3'
	const given = '2/-3'

	const checker = new FractionChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeFalsy()
	expect(result.message).toEqual('Le dénominateur doit être positif.')
})

test('dénominateur zéro', () => {
	const checker = new FractionChecker('')
	const result = checker.check('2/0', '1/2')

	expect(result.result).toBe(false)
	expect(result.message).toBe("Le dénominateur ne peut pas être zéro.")
})

test('entier accepté comme fraction', () => {
	const checker = new FractionChecker('')
	const result = checker.check('2', '2/1')

	expect(result.result).toBe(true)
})

test('dénominateur 1 — message de simplification', () => {
	const checker = new FractionChecker('')
	const result = checker.check('3/1', '3')

	expect(result.result).toBe(false)
	expect(result.score).toBe(0.9)
	expect(result.message).toBe("Une fraction avec `1` au dénominateur peut être simplifiée.")
})

test('alternatives || acceptées', () => {
	const checker = new FractionChecker('')

	const result = checker.check('1/2', '1/2||2/4')
	expect(result.result).toBe(true)

	const resultFail = checker.check('1/3', '1/2||2/4')
	expect(resultFail.result).toBe(false)
})
