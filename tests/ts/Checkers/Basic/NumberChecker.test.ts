import {expect, test} from "vitest"
import {NumberChecker} from "@/Checkers"

test('detect exact value', () => {
	const config = '3'
	const expected = '1.234'
	const given = '1.234'

	const checker = new NumberChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeTruthy()
})

test('detect similar value, not strict', () => {
	const config = '3'
	const expected = '1.230'
	const given = '1.23'

	const checker = new NumberChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeTruthy()
})

test('detect similar value, strict', () => {
	const config = '3,s'
	const expected = '1.230'
	const given = '1.23'
	const given0 = '1.230'

	const checker = new NumberChecker(config)
	const result = checker.check(given, expected)
	const result0 = checker.check(given0, expected)

	expect(result.result).toBeFalsy()
	expect(result0.result).toBeTruthy()
})

test('wrong number of decimals - valeur arrondie correcte (score partiel)', () => {
	const config = '3'
	const expected = '1.234'
	const given = '1.23'       // 1.234 arrondi à 2 décimales = 1.23 ✓

	const checker = new NumberChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeFalsy()
	expect(result.message).toEqual('Il faut 3 chiffre(s) après la virgule.')
	expect(result.score).toEqual(0.7)
})

test('wrong number of decimals - valeur fausse (score zéro)', () => {
	const config = '2'
	const expected = '2.30'
	const given = '2.1'        // valeur différente ET mauvais nb de décimales

	const checker = new NumberChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeFalsy()
	expect(result.message).toEqual("La réponse n'est pas juste.")
	expect(result.score).toEqual(0)
})

test('near answer detection', () => {
	const config = '3'
	const expected = '1.234'
	const given = '1.235'
	const given1 = '1.233'
	const given2 = '1.236'

	const checker = new NumberChecker(config)
	const result = checker.check(given, expected)
	const result1 = checker.check(given1, expected)
	const result2 = checker.check(given2, expected)

	expect(result.result).toBeFalsy()
	expect(result.message).toEqual('Peut être un problème d\'arrondi ?')

	expect(result1.result).toBeFalsy()
	expect(result1.message).toEqual('Peut être un problème d\'arrondi ?')

	expect(result2.result).toBeFalsy()
	expect(result2.message).to.not.equal('Peut être un problème d\'arrondi ?')
})

test('la réponse est de signe opposé', () => {
	const config = '3'
	const expected = '1.234'
	const given = '-1.234'

	const checker = new NumberChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBe(false)
	expect(result.message).toBe("Peut être un problème de signe...")
})

test('partie entière incorrecte', () => {
	const config = '3'
	const expected = '1.234'
	const given1 = '4.234'
	const given2 = '4.765'

	const checker = new NumberChecker(config)
	const result1 = checker.check(given1, expected)
	const result2 = checker.check(given2, expected)

	expect(result1.result).toBe(false)
	expect(result1.message).toBe("La réponse n'est pas juste.")

	expect(result2.result).toBe(false)
	expect(result2.message).toBe("La réponse n'est pas juste.")
})

test("d'autres erreurs", () => {
	const checker = new NumberChecker()
	const result = checker.check('3', "3.12")
	expect(result.result).toBe(false)
	expect(result.message).toBe("La réponse n'est pas juste.")
})

test('format invalide : entrée non numérique', () => {
	const checker = new NumberChecker('2')
	const result = checker.check('abc', '1.23')
	expect(result.result).toBe(false)
	expect(result.message).toBe('Veuillez entrer un nombre')
})

test('format invalide : signe - pas en première position', () => {
	const checker = new NumberChecker('2')
	const result = checker.check('3-4', '1.23')
	expect(result.result).toBe(false)
	expect(result.message).toBe('Le signe `-` doit être en première position.')
})

test('format invalide : signe - présent plusieurs fois', () => {
	const checker = new NumberChecker('2')
	const result = checker.check('--3', '1.23')
	expect(result.result).toBe(false)
	expect(result.message).toBe("Le signe `-` ne peut apparaître qu'une seule fois.")
})

test('format invalide : point décimal sans chiffre précédent', () => {
	const checker = new NumberChecker('2')
	const result = checker.check('.5', '0.50')
	expect(result.result).toBe(false)
	expect(result.message).toBe('Un chiffre doit précéder le point décimal.')
})

test('format invalide : point décimal présent plusieurs fois', () => {
	const checker = new NumberChecker('2')
	const result = checker.check('3.5.6', '1.23')
	expect(result.result).toBe(false)
	expect(result.message).toBe("Le point décimal ne peut apparaître qu'une seule fois.")
})

test('nombre entier sans décimale (config=0)', () => {
	const checker = new NumberChecker('0')

	const result = checker.check('5', '5')
	expect(result.result).toBe(true)

	const resultDecimal = checker.check('5.1', '5')
	expect(resultDecimal.result).toBe(false)
	expect(resultDecimal.message).toBe("La réponse ne doit pas avoir de décimales.")
})

test('strict mode - fewer decimals, value rounded correctly (score partiel)', () => {
	const config = '3,s'
	const expected = '1.230'
	const given = '1.23'       // valeur correcte mais trop peu de décimales en mode strict

	const checker = new NumberChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeFalsy()
	expect(result.message).toEqual('Il faut 3 chiffre(s) après la virgule.')
	expect(result.score).toEqual(0.7)
})

test('strict mode - fewer decimals, wrong value (score zéro)', () => {
	const config = '3,s'
	const expected = '1.234'
	const given = '1.20'       // mauvais nb de décimales ET valeur fausse en mode strict

	const checker = new NumberChecker(config)
	const result = checker.check(given, expected)

	expect(result.result).toBeFalsy()
	expect(result.message).toEqual("La réponse n'est pas juste.")
	expect(result.score).toEqual(0)
})

test('alternatives || acceptées', () => {
	const checker = new NumberChecker('3')

	const result = checker.check('1.235', '1.234||1.235')
	expect(result.result).toBe(true)

	const resultFail = checker.check('1.236', '1.234||1.235')
	expect(resultFail.result).toBe(false)
})
