import {expect, test} from "vitest"
import {Equation} from "pimath"
import {checkCircle, checkMinMaxEquation, checkReducedEquation} from "@/Checkers/checkerCheckFunctions.ts"
import {PolynomChecker} from "@/Checkers/Basic/PolynomChecker"

// --- checkReducedEquation : coefficient commun (lcm) doit valoir 1 ---

test('checkReducedEquation : équation réduite -> pas de message', () => {
	expect(checkReducedEquation(new Equation('x=1'))).toBe("")
})

test('checkReducedEquation : équation non réduite -> message', () => {
	expect(checkReducedEquation(new Equation('2x=2'))).toBe("l'équation n'est pas réduite.")
})

// --- checkCircle : forme centre - rayon ---

test('checkCircle : cercle canonique accepté', () => {
	const value = 'x^2+y^2=1'
	expect(checkCircle(value, new Equation(value))).toBe("")
})

test('checkCircle : cercle décentré accepté', () => {
	const value = '(x-2)^2+(y+3)^2=4'
	expect(checkCircle(value, new Equation(value))).toBe("")
})

test('checkCircle : degrés incorrects signalés', () => {
	const value = 'x+y=1'
	expect(checkCircle(value, new Equation(value))).toBe("L'équation n'a pas les bons degrés.")
})

test('checkCircle : format incorrect signalé', () => {
	// degrés 2 en x et y mais un monôme parasite -> centre mal formé
	const value = 'x^2+y^2+x=1'
	expect(checkCircle(value, new Equation(value))).toBe("L'équation n'est pas dans le bon format.")
})

// --- checkMinMaxEquation : un côté doit être exactement y ---

test('checkMinMaxEquation : aucun côté = y -> message', () => {
	const secondary = new PolynomChecker('')
	const result = checkMinMaxEquation('x=x^2', 'y=x^2', secondary)

	expect(result).toBe("Un côté de l'équation doit juste être (y)")
})

test('checkMinMaxEquation : forme du sommet correcte -> délégué sans erreur', () => {
	const secondary = new PolynomChecker('')
	const result = checkMinMaxEquation('y=(x-2)^2+3', 'y=(x-2)^2+3', secondary)

	expect(result).toBe("")
})
