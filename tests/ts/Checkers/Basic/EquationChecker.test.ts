import {expect, test} from "vitest"
import {EquationChecker} from "@/Checkers/Basic/EquationChecker"

// --- getter format : construction déterministe de la consigne ---

test('getter format : sans option', () => {
	expect(new EquationChecker('').format).toBe('équation ')
})

test('getter format : canonique', () => {
	expect(new EquationChecker('c').format).toBe('équation canonique')
})

test('getter format : réduite', () => {
	expect(new EquationChecker('r').format).toBe('équation réduite')
})

test('getter format : centre-rayon', () => {
	expect(new EquationChecker('circle').format).toContain('centre - rayon')
})

test('getter format : sommet', () => {
	expect(new EquationChecker('s').format).toContain('sommet')
})

test('getter format : pente + ordonnée (mxh)', () => {
	expect(new EquationChecker('mxh').format).toContain('pente')
})

test('getter format : canonique et réduite combinées', () => {
	expect(new EquationChecker('c,r').format).toBe('équation canonique, réduite')
})

// --- checkFormat / checkValue ---

test('format : ce n\'est pas une équation', () => {
	const checker = new EquationChecker('')
	const result = checker.check('hello', 'x=1')

	expect(result.result).toBe(false)
	expect(result.message).toBe("ce n'est pas une équation reconnue.")
})

test('équation équivalente (multiple) acceptée', () => {
	const checker = new EquationChecker('')
	const result = checker.check('2x=2', 'x=1')

	expect(result.result).toBe(true)
})

test('équation fausse', () => {
	const checker = new EquationChecker('')
	const result = checker.check('x=2', 'x=1')

	expect(result.result).toBe(false)
	expect(result.message).toBe("l'équation n'est pas juste.")
})

test('mxh : doit commencer par y=', () => {
	const checker = new EquationChecker('mxh')
	const result = checker.check('2x=y', 'y=2x')

	expect(result.result).toBe(false)
	expect(result.message).toBe("l'équation commence par \\(y=\\ldots\\)")
})

// --- mxh : réduction pente / ordonnée ---

test('mxh : y=constante réduite acceptée', () => {
	const checker = new EquationChecker('mxh')
	const result = checker.check('y=5', '2y=10')

	expect(result.result).toBe(true)
})

test('mxh : pente + ordonnée réduites acceptées', () => {
	const checker = new EquationChecker('mxh')
	const result = checker.check('y=2x+3', '2y=4x+6')

	expect(result.result).toBe(true)
})

test('mxh : pente non réduite signalée', () => {
	const checker = new EquationChecker('mxh')
	const result = checker.check('y=2/4x+3', '2y=x+6')

	expect(result.result).toBe(false)
	expect(result.message).toBe('on peut réduire la pente...')
	expect(result.score).toBe(0.5)
})

// --- canonique (=0, ordre des variables) ---

test('canonique : forme non =0 signalée', () => {
	const checker = new EquationChecker('c')
	const result = checker.check('x=1', 'x-1=0')

	expect(result.result).toBe(false)
	expect(result.message).toContain('canonique')
	expect(result.score).toBe(0.5)
})

test('canonique : ne pas commencer par un négatif', () => {
	const checker = new EquationChecker('c')
	const result = checker.check('-x+1=0', 'x-1=0')

	expect(result.result).toBe(false)
	expect(result.message).toBe('on évite de commencer par un nombre négatif')
	expect(result.score).toBe(0.9)
})

test('canonique : variables dans le mauvais ordre', () => {
	const checker = new EquationChecker('c')
	const result = checker.check('y+x=0', 'x+y=0')

	expect(result.result).toBe(false)
	expect(result.message).toBe('conventionnellement, on écrit les variables dans l\'ordre alphabétique.')
})

test('canonique : forme correcte acceptée', () => {
	const checker = new EquationChecker('c')
	const result = checker.check('x+y=0', 'y+x=0')

	expect(result.result).toBe(true)
})

// --- réduction (config r) ---

test('réduite : forme réduite acceptée', () => {
	// x=1 est la forme réduite (coefficient commun 1) -> acceptée.
	const checker = new EquationChecker('r')
	const result = checker.check('x=1', '2x=2')

	expect(result.result).toBe(true)
})

test('réduite : forme non réduite signalée', () => {
	// 2x=2 équivaut à x=1 mais son coefficient commun est 2 -> pas réduite.
	const checker = new EquationChecker('r')
	const result = checker.check('2x=2', 'x=1')

	expect(result.result).toBe(false)
	expect(result.message).toBe("l'équation n'est pas réduite.")
})

// --- forme du sommet (peak) ---

test('sommet : forme correcte acceptée', () => {
	const checker = new EquationChecker('s')
	const result = checker.check('y=x^2', 'x^2=y')

	expect(result.result).toBe(true)
})

test('sommet : forme incorrecte signalée', () => {
	const checker = new EquationChecker('s')
	const result = checker.check('2y=2x^2', 'y=x^2')

	expect(result.result).toBe(false)
	expect(result.message).toBe("l'équation n'est pas sous la forme du sommet")
})

// --- forme centre-rayon (cercle) ---

test('cercle : forme correcte acceptée', () => {
	const checker = new EquationChecker('circle')
	const result = checker.check('x^2+y^2=1', 'y^2+x^2=1')

	expect(result.result).toBe(true)
})

test('cercle : forme incorrecte signalée', () => {
	const checker = new EquationChecker('circle')
	const result = checker.check('2x^2+2y^2=2', 'x^2+y^2=1')

	expect(result.result).toBe(false)
	expect(result.message).toBe("l'équation n'est pas sous la forme centre-rayon")
})
