import {normalizeExpression} from "@/Checkers/normalizeExpression"
import {describe, expect, test} from "vitest"

describe('normalizeExpression - étapes de base', () => {
	test('supprime les multiplications explicites (hors entre chiffres)', () => {
		expect(normalizeExpression('2*x')).toBe('2x')
		expect(normalizeExpression('a*b*c')).toBe('abc')
	})

	test('conserve la multiplication entre deux chiffres', () => {
		expect(normalizeExpression('2*3')).toBe('2*3')
	})

	test('transforme root(n)(radicande) en nthrt(radicande,n)', () => {
		expect(normalizeExpression('root(3)(x+1)')).toBe('nthrt(x+1,3)')
	})

	test('transforme root(n)x^m en nthrt(x,n)^(m)', () => {
		expect(normalizeExpression('root(3)x^5')).toBe('nthrt(x,3)^(5)')
	})

	test('transforme root(n)45 en nthrt(45,n)', () => {
		expect(normalizeExpression('root(3)45')).toBe('nthrt(45,3)')
	})

	test('gère les racines n-ièmes imbriquées', () => {
		expect(normalizeExpression('root(2)(root(3)(x))')).toBe('nthrt(nthrt(x,3),2)')
	})

	test('ajoute les parenthèses d\'argument à une racine carrée', () => {
		expect(normalizeExpression('sqrt5')).toBe('sqrt(5)')
	})
})

describe('normalizeExpression - encadrement des exposants', () => {
	test('encadre systématiquement un exposant entier', () => {
		expect(normalizeExpression('x^2')).toBe('x^(2)')
	})

	test('normalise un exposant déjà parenthésé en un encadrement canonique', () => {
		expect(normalizeExpression('x^(2)')).toBe('x^(2)')
	})

	test('encadre un exposant négatif', () => {
		expect(normalizeExpression('x^-3')).toBe('x^(-3)')
	})

	test('encadre un exposant décimal', () => {
		expect(normalizeExpression('x^2.5')).toBe('x^(2.5)')
	})

	test('préserve une fraction d\'exposant déjà parenthésée', () => {
		expect(normalizeExpression('x^(1/2)')).toBe('x^(1/2)')
	})

	test('préserve un exposant négatif déjà parenthésé', () => {
		expect(normalizeExpression('x^(-3)')).toBe('x^(-3)')
	})
})

describe('normalizeExpression - puissances de fonctions trigonométriques', () => {
	test('sin^n(...) devient (sin(...))^(n)', () => {
		expect(normalizeExpression('sin^3(2x+5)')).toBe('(sin(2x+5))^(3)')
	})

	test('fonctionne pour cos et tan', () => {
		expect(normalizeExpression('cos^2(x)')).toBe('(cos(x))^(2)')
		expect(normalizeExpression('tan^4(x-1)')).toBe('(tan(x-1))^(4)')
	})

	test('gère une parenthèse imbriquée dans l\'argument', () => {
		expect(normalizeExpression('sin^2(2(x+1))')).toBe('(sin(2(x+1)))^(2)')
	})

	test('gère une imbrication de parenthèses profonde', () => {
		expect(normalizeExpression('cos^2(((x)))')).toBe('(cos(((x))))^(2)')
	})

	test('gère l\'imbrication de deux fonctions trigonométriques', () => {
		expect(normalizeExpression('sin^2(cos^3(x))')).toBe('(sin((cos(x))^(3)))^(2)')
	})

	test('transforme plusieurs occurrences dans une même expression', () => {
		expect(normalizeExpression('sin^2(x)+cos^2(x)')).toBe('(sin(x))^(2)+(cos(x))^(2)')
	})

	test('combine la canonicalisation d\'exposant ^(n) puis l\'enveloppe trigo', () => {
		expect(normalizeExpression('sin^(3)(x)')).toBe('(sin(x))^(3)')
	})
})

describe('normalizeExpression - non-régression', () => {
	test('encadre les exposants d\'une expression polynomiale', () => {
		expect(normalizeExpression('x^2+3x-1')).toBe('x^(2)+3x-1')
	})

	test('ne touche pas à sin(...) sans exposant', () => {
		expect(normalizeExpression('sin(2x+5)')).toBe('sin(2x+5)')
	})

	test('n\'entre pas en boucle sur une parenthèse non fermée', () => {
		expect(normalizeExpression('sin^2(x')).toBe('sin^(2)(x')
	})
})
