import {describe, expect, test} from "vitest"
import {ExactChecker} from "@/Checkers"

/**
 * ExactChecker compare deux valeurs EXACTES (après normalisation + évaluation NumExp).
 *
 * Deux modes :
 *  - défaut : la bonne valeur mais sous une forme différente => résultat partiel
 *    (result=false, score 0.3, message « juste mais pas sous la forme attendue »).
 *  - soft   : toute écriture de même valeur est acceptée (result=true).
 */

function checkStrict(given: string, expected: string) {
	return new ExactChecker('').check(given, expected)
}

function checkSoft(given: string, expected: string) {
	return new ExactChecker('soft').check(given, expected)
}

/**
 * Verrouille l'invariant central : `given` et `expected` sont la même VALEUR mais
 * d'une forme différente => partiel (0.3) en mode défaut, accepté en mode soft.
 */
function expectEquivalentForm(given: string, expected: string): void {
	const strict = checkStrict(given, expected)
	expect(strict.result, `strict: ${given} vs ${expected}`).toBe(false)
	expect(strict.score).toBe(0.3)

	const soft = checkSoft(given, expected)
	expect(soft.result, `soft: ${given} vs ${expected}`).toBe(true)
}

describe('ExactChecker - égalité stricte et format', () => {
	test('accepte une réponse strictement identique', () => {
		expect(checkStrict('1/2', '1/2').result).toBe(true)
	})

	test('accepte une réponse identique après normalisation (sqrt sans parenthèses)', () => {
		// '2sqrt2' et '2sqrt(2)' se normalisent en la même chaîne => accepté même en défaut
		expect(checkStrict('2sqrt2', '2sqrt(2)').result).toBe(true)
	})

	test('retire le préfixe # de la réponse donnée', () => {
		expect(checkStrict('#1/2', '1/2').result).toBe(true)
	})

	test('rejette une entrée non reconnue', () => {
		const result = checkStrict('3xsi', '2')
		expect(result.result).toBe(false)
		expect(result.message).toBe("La réponse n'est pas une valeur exacte reconnue.")
	})

	test('ne plante pas sur une entrée qui casse le parsing', () => {
		// '(((' fait échouer le parsing NumExp : le checker doit répondre proprement,
		// sans laisser l'exception s'échapper.
		const result = checkStrict('(((', '2')
		expect(result.result).toBe(false)
		expect(result.message).toBe("La réponse n'est pas une valeur exacte reconnue.")
	})

	test('signale une réponse attendue malformée sans planter', () => {
		const result = checkStrict('2', '(((')
		expect(result.result).toBe(false)
		expect(result.message).toBe("La réponse attendue n'est pas une valeur exacte reconnue.")
	})

	test('rejette une valeur numériquement fausse', () => {
		const result = checkStrict('3/4', '1/2')
		expect(result.result).toBe(false)
		expect(result.score).toBe(0)
		expect(result.message).toBe("La réponse donnée n'est pas juste.")
	})
})

describe('ExactChecker - radicaux et rationalisation', () => {
	test('reconnaît une écriture rationalisée équivalente', () => {
		// (3+sqrt(18))/6 = (1+sqrt(2))/2
		expectEquivalentForm('(3+sqrt(18))/6', '(1+sqrt(2))/2')
	})

	test('reconnaît une racine simplifiée', () => {
		// sqrt(18) = 3 sqrt(2)
		expectEquivalentForm('sqrt(18)', '3sqrt(2)')
	})

	test('signale une racine restée au dénominateur', () => {
		// 1/sqrt(2) = sqrt(2)/2, mais la racine n'est pas rationalisée
		const result = checkStrict('1/sqrt(2)', 'sqrt(2)/2')
		expect(result.result).toBe(false)
		expect(result.score).toBe(0.3)
		expect(result.message).toContain("racine au dénominateur")
	})
})

describe('ExactChecker - puissances et racines n-ièmes', () => {
	test('reconnaît une puissance rationnelle (racine cubique)', () => {
		// 8^(1/3) = 2
		expectEquivalentForm('8^(1/3)', '2')
	})

	test('reconnaît une puissance rationnelle (racine carrée)', () => {
		// 9^(1/2) = 3
		expectEquivalentForm('9^(1/2)', '3')
	})

	test('reconnaît un exposant négatif', () => {
		// 2^(-1) = 1/2
		expectEquivalentForm('2^(-1)', '1/2')
	})

	test('reconnaît une racine n-ième écrite avec root()', () => {
		// root(3)(8) = 2 (nécessite le bon ordre nthrt(radicande,degré))
		expectEquivalentForm('root(3)(8)', '2')
	})
})

describe('ExactChecker - log, ln, trigonométrie et fractions', () => {
	test('reconnaît un logarithme décimal', () => {
		// log(100) = 2 (log = base 10)
		expectEquivalentForm('log(100)', '2')
	})

	test('reconnaît un logarithme népérien', () => {
		// ln(e) = 1
		expectEquivalentForm('ln(e)', '1')
	})

	test('reconnaît une valeur trigonométrique (radians)', () => {
		// sin(pi/6) = 1/2
		expectEquivalentForm('sin(pi/6)', '1/2')
	})

	test('reconnaît cos(0) = 1', () => {
		expectEquivalentForm('cos(0)', '1')
	})

	test('signale une fraction non réduite', () => {
		// 2/4 = 1/2 mais n'est pas réduite
		const result = checkStrict('2/4', '1/2')
		expect(result.result).toBe(false)
		expect(result.score).toBe(0.3)
		expect(result.message).toContain("réduire la fraction")
	})
})

/**
 * Logarithmes en base n : logn(value, base) = ln(value) / ln(base).
 *
 * Supporté depuis piexpression 0.1.4 (bundlé dans pimath 0.2.11). Une base <= 0,
 * égale à 1, ou une valeur <= 0 produit NaN (pas d'exception) => rejeté comme faux.
 */
describe('ExactChecker - logarithmes en base n', () => {
	test('reconnaît log en base 2 : logn(8,2) = 3', () => {
		expectEquivalentForm('logn(8,2)', '3')
	})

	test('reconnaît log en base 5 : logn(25,5) = 2', () => {
		expectEquivalentForm('logn(25,5)', '2')
	})

	test('reconnaît une base fractionnaire : logn(8,1/2) = -3', () => {
		expectEquivalentForm('logn(8,1/2)', '-3')
	})

	test('rejette une base invalide (n = 1)', () => {
		const result = checkStrict('logn(8,1)', '3')
		expect(result.result).toBe(false)
		expect(result.score).toBe(0)
		expect(result.message).toBe("La réponse donnée n'est pas juste.")
	})
})