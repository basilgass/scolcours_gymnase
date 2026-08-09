import {expect, test, vi} from "vitest"
import {CHECKERS} from "@/Checkers/checker.config.ts"
import {PiChecker} from "@/Checkers/PiChecker.ts"
import {CHECKER_CLASSES} from "@/Checkers/checkerRegistry.ts"
import {splitIfOutsideParentheses} from "@/Checkers/checkerHelperFunctions.ts"
import {isEquationCircle, isEquationReduced, sortPartsByVariable} from "@/Checkers/checkMathString.ts"
import {NumberChecker} from "@/Checkers/Basic/NumberChecker"

test('PiChecker : secondaryChecker par défaut = exact', () => {
	// pas de "checker:" et secondaryChecker null -> version exact par défaut
	const checker = new PiChecker('number,2')

	expect(checker.secondaryChecker?.type).toBe(CHECKERS.EXACT)
})

test('PiChecker : nom inconnu -> checker STRING (défaut de résolution)', () => {
	// NOTE caractérisation : checkerNameToEnum renvoie CHECKERS.STRING pour tout
	// nom inconnu, et STRING existe dans CHECKER_CLASSES. La branche défensive
	// "checker null -> warn + fallback EXACT" de PiChecker est donc inatteignable
	// via la résolution de nom normale (aucun warn attendu ici).
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

	const checker = new PiChecker('inexistant')

	expect(checker.checker.type).toBe(CHECKERS.STRING)
	expect(warn).not.toHaveBeenCalled()

	warn.mockRestore()
})

test('PiChecker : getters answer / description / format', () => {
	const pi = new PiChecker('number,2')

	// answer est défini par check()
	pi.check('2', '2')
	expect(pi.answer).toBe('2')

	expect(typeof pi.description).toBe('string')
	expect(pi.description.length).toBeGreaterThan(0)
	expect(typeof pi.format).toBe('string')
})

test('PiChecker : setter secondaryChecker', () => {
	const pi = new PiChecker('number,2')
	pi.secondaryChecker = new NumberChecker('3')

	expect(pi.secondaryChecker?.type).toBe(CHECKERS.NUMBER)
})

test('PiChecker should parse a single checker', () => {
	const config = 'number,2'

	const checker = new PiChecker(config).checker

	expect(checker.type).toBe(CHECKERS.NUMBER)
	expect(checker.config).toHaveLength(1)
	expect(checker.config[0]).toBe('2')

})

test('PiChecker should parse a checker with a secondary checker', () => {
	const config = 'coord,checker:fraction'

	const checker = new PiChecker(config)

	expect(checker.checker.type).toBe(CHECKERS.COORDINATES)
	expect(checker.secondaryChecker?.type).toBe(CHECKERS.FRACTION)
})

test('Every checkers should match answer=given', () => {
	const pichecker = new PiChecker()
	const list = CHECKER_CLASSES

	const answer = 'hello'
	const given = 'hello'

	Object.values(list).forEach((checkerClass) => {
		pichecker.checker = new checkerClass()

		expect(pichecker.check(given, answer).result).toBeTruthy()
	})
})

test('split string in two parts (circle edition)', () => {
	const arr = [
		['(x+2)^2+(y+5)^2', '(x+2)^2', '(y+5)^2'],
		['(x+2)^2+y^2', '(x+2)^2', 'y^2'],
		['x^2+(y+5)^2', 'x^2', '(y+5)^2'],
		['x^2+y^2', 'x^2', 'y^2'],
		['y^2+x^2', 'x^2', 'y^2']
	]
	arr.forEach(a => {
		const values = splitIfOutsideParentheses(a[0], '+')
			.sort(sortPartsByVariable)

		expect(values).toHaveLength(2)
		expect(values[0]).toBe(a[1])
		expect(values[1]).toBe(a[2])
	})

})

test('equation is circle', () => {
	[
		'(x+2)^2+(y+5)^2=1',
		'(x+2)^2+y^2=1',
		'x^2+(y+5)^2=1',
		'x^2+y^2=1',
		'y^2+x^2=1'
	].forEach(a => {
		expect(isEquationCircle(a)).toBe(true)
	})
})

test('is equation reduced', () => {
	const a = '3x+1=5'
	const b = '6x+4=10'
	const c = '-x=10'

	expect(isEquationReduced(a)).toBe(true)
	expect(isEquationReduced(b)).toBe(false)
	expect(isEquationReduced(c)).toBe(true)
})
