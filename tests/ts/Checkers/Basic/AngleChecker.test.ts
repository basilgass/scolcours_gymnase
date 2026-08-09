import {expect, test} from "vitest"
import {AngleChecker} from "@/Checkers/Basic/AngleChecker"

// --- checkFormat : logique de parsing déterministe (indépendante de PiRadian) ---

test('format : un angle en radian doit contenir pi', () => {
	const checker = new AngleChecker('')
	const result = checker.check('1', 'pi/3')

	expect(result.result).toBe(false)
	expect(result.message).toContain('doit contenir la valeur')
})

test('périodicité absente : signalée à la comparaison (branche format morte)', () => {
	// NOTE caractérisation : checkFormat ne rattrape PAS l'absence de périodicité
	// (parseValue renvoie '' et jamais undefined -> la branche "Il faut ajouter la
	// périodicité" est inatteignable). L'erreur remonte donc de checkWithPeriodic.
	const checker = new AngleChecker('p')
	const result = checker.check('pi/3', 'pi/3+k2pi')

	expect(result.result).toBe(false)
	expect(result.message).toBe("La partie périodique n'est pas juste.")
})

test('format : périodicité donnée alors qu\'elle est interdite', () => {
	const checker = new AngleChecker('')
	const result = checker.check('pi/3+kpi', 'pi/3')

	expect(result.result).toBe(false)
	expect(result.message).toBe("Il ne faut pas ajouter la périodicité")
})

test('format : plus d\'un signe + refusé', () => {
	const checker = new AngleChecker('p')
	const result = checker.check('pi/3+pi/2+k2pi', 'pi/3+k2pi')

	expect(result.result).toBe(false)
	expect(result.message).toBe("Il n'y a qu'un seul signe \\(+\\) dans ce format de réponse.")
})

test('format : angle en degrés doit être au format décimal', () => {
	const checker = new AngleChecker('deg')
	const result = checker.check('pi/3', '42')

	expect(result.result).toBe(false)
	expect(result.message).toBe("La valeur de l'angle n'est pas au format décimal")
})

// --- getter format : construction de la consigne ---

test('getter format : radian exact', () => {
	const checker = new AngleChecker('')

	expect(checker.format).toContain('radians')
	expect(checker.format).toContain('\\dfrac')
})

test('getter format : degrés', () => {
	const checker = new AngleChecker('deg')

	expect(checker.format).toContain('degrès')
	expect(checker.format).toContain('42.12')
})

test('getter format : mode digits (décimal)', () => {
	const checker = new AngleChecker('d')

	expect(checker.format).toContain('1.23')
})

test('getter format : périodique', () => {
	const checker = new AngleChecker('p')

	expect(checker.format).toContain('k')
})

// --- checkValue via PiRadian : angle radian exact ---

test('angle radian non réduit signalé', () => {
	const checker = new AngleChecker('')
	const result = checker.check('2pi/6', 'pi/3')

	expect(result.result).toBe(false)
	expect(result.message).toContain('réduit')
})

test('angle radian faux signalé', () => {
	const checker = new AngleChecker('')
	const result = checker.check('pi/2', 'pi/3')

	expect(result.result).toBe(false)
	expect(result.message).toContain('juste')
})

// --- checkWithPeriodic : radian exact, avec périodicité ---

test('périodique radian : partie périodique non réduite', () => {
	const checker = new AngleChecker('p')
	// 2pi/2 == pi (même périodicité) mais non réduite
	const result = checker.check('pi/3+k2pi/2', 'pi/3+kpi')

	expect(result.result).toBe(false)
	expect(result.message).toBe("La partie périodique n'est pas réduite.")
	expect(result.score).toBe(0.9)
})

test('périodique radian : angle non réduit', () => {
	const checker = new AngleChecker('p')
	const result = checker.check('2pi/6+k2pi', 'pi/3+k2pi')

	expect(result.result).toBe(false)
	expect(result.message).toBe("L'angle n'est pas réduit.")
	expect(result.score).toBe(0.9)
})

test('périodique radian : forme correcte acceptée', () => {
	const checker = new AngleChecker('p')
	// équivalent mais chaîne différente -> passe par checkWithPeriodic
	const result = checker.check('pi/3+k2pi', '2pi/6+k2pi')

	expect(result.result).toBe(true)
})

// --- mode digits (décimal), sans périodicité ---

test('digits sans période : valeur décimale équivalente acceptée', () => {
	const checker = new AngleChecker('d')
	// délègue au NumberChecker(2) ; 1.5 == 1.50 arrondi à 2 décimales
	const result = checker.check('1.5', '1.50')

	expect(result.result).toBe(true)
})

test('digits sans période : valeur décimale fausse', () => {
	const checker = new AngleChecker('d')
	const result = checker.check('2', '1.5')

	expect(result.result).toBe(false)
})

// --- mode digits avec périodicité décimale (d+) ---

test('digits périodique : forme correcte acceptée', () => {
	const checker = new AngleChecker('p,d+')
	const result = checker.check('1.50+k6.28', '1.5+k6.28')

	expect(result.result).toBe(true)
})

test('digits périodique : partie périodique fausse', () => {
	const checker = new AngleChecker('p,d+')
	const result = checker.check('1.5+k3.14', '1.5+k6.28')

	expect(result.result).toBe(false)
	expect(result.message).toContain("La partie périodique n'est pas juste.")
})

test('digits périodique : angle non multiple de la période', () => {
	const checker = new AngleChecker('p,d+')
	// (1.3 - 1.5) / 6.28 n'est pas entier -> angle faux
	const result = checker.check('1.3+k6.28', '1.5+k6.28')

	expect(result.result).toBe(false)
	expect(result.message).toBe("L'angle n'est pas juste")
})

test('digits périodique positif : angle négatif refusé', () => {
	const checker = new AngleChecker('p+,d+')
	// -1 diffère de 5.28 d'une période (6.28) mais est négatif
	const result = checker.check('-1+k6.28', '5.28+k6.28')

	expect(result.result).toBe(false)
	expect(result.message).toBe("L'angle doit être positif.")
	expect(result.score).toBe(0.5)
})

// --- checkWithPeriodic : contraintes positif / minimal (radian exact) ---

test('périodique radian positif : angle négatif refusé', () => {
	const checker = new AngleChecker('p+')
	// -pi/3 et 2pi/3 diffèrent d'une période (pi) ; -pi/3 est négatif
	const result = checker.check('-pi/3+kpi', '2pi/3+kpi')

	expect(result.result).toBe(false)
	expect(result.message).toBe("L'angle doit être positif.")
	expect(result.score).toBe(0.5)
})

test('périodique radian minimal : angle pas le plus proche de zéro', () => {
	const checker = new AngleChecker('p-')
	const result = checker.check('5pi/3+k2pi', '-pi/3+k2pi')

	expect(result.result).toBe(false)
	expect(result.message).toBe("L'angle n'est pas le plus proche de zéro.")
	expect(result.score).toBe(0.5)
})
