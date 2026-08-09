import {expect, test} from "vitest"
import {FunctionChecker} from "@/Checkers/Basic/FunctionChecker"

test('getter format : sans option', () => {
	expect(new FunctionChecker('').format).toBe("fonction ")
})

test('getter format : développée réduite', () => {
	expect(new FunctionChecker('d').format).toContain("développée réduite")
})

test('fonction équivalente acceptée', () => {
	const checker = new FunctionChecker('')
	// délègue au PolynomChecker : 2x+2x == 4x
	const result = checker.check('2x+2x', '4x')

	expect(result.result).toBe(true)
})

test('fonction fausse : message reformulé "la fonction"', () => {
	const checker = new FunctionChecker('')
	const result = checker.check('x+1', 'x+2')

	expect(result.result).toBe(false)
	// FunctionChecker remplace "le polynôme" par "la fonction" dans le message
	expect(result.message).toContain('la fonction')
	expect(result.message).not.toContain('le polynôme')
})

test('config développée : forme factorisée refusée', () => {
	const checker = new FunctionChecker('d')
	// (x+1)(x+1) équivaut à x^2+2x+1 mais n'est pas développé
	const result = checker.check('(x+1)(x+1)', 'x^2+2x+1')

	expect(result.result).toBe(false)
	expect(result.message).toContain('la fonction')
})
