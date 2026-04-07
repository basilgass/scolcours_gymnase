import {expect, test} from "vitest"
import {VectorChecker} from "@/Checkers"

test('format invalide : sans parenthèses', () => {
	const checker = new VectorChecker()
	const result = checker.check('2;3', '(2;3)')

	expect(result.result).toBe(false)
	expect(result.message).toBe("des vecteurs commencent et se terminent par des parenthèses")
})

test('vecteur exact', () => {
	const checker = new VectorChecker()
	const result = checker.check('(2;3)', '(2;3)')

	expect(result.result).toBe(true)
})

test('dimension incorrecte', () => {
	const checker = new VectorChecker()
	const result = checker.check('(2;3;4)', '(2;3)')

	expect(result.result).toBe(false)
	expect(result.message).toBe("la dimension ne correspond pas")
})

test('composante incorrecte', () => {
	const checker = new VectorChecker()
	const result = checker.check('(5;3)', '(2;3)')

	expect(result.result).toBe(false)
})

test('vecteur de dimension 1 accepté', () => {
	const checker = new VectorChecker()
	const result = checker.check('(5)', '(5)')

	expect(result.result).toBe(true)
})

test('colinéaire valide', () => {
	const checker = new VectorChecker('co')
	const result = checker.check('(4;6)', '(2;3)')

	expect(result.result).toBe(true)
})

test('colinéaire valide avec scalaire négatif', () => {
	const checker = new VectorChecker('co')
	const result = checker.check('(-4;-6)', '(2;3)')

	expect(result.result).toBe(true)
})

test('non-colinéaire', () => {
	const checker = new VectorChecker('co')
	const result = checker.check('(4;7)', '(2;3)')

	expect(result.result).toBe(false)
	expect(result.message).toBe("la 2e composante n'est pas proportionnelle")
})

test('colinéaire : composante nulle vs non-nulle', () => {
	const checker = new VectorChecker('co')
	const result = checker.check('(0;6)', '(2;3)')

	expect(result.result).toBe(false)
	expect(result.message).toBe("la 1e composante est fausse.")
})
