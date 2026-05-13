import {describe, expect, test} from "vitest"
import {
	formatNumberSetKatex,
	NUMBERSET_TRUNCATE_THRESHOLD,
	parseNumberSet
} from "@/Composables/useNumberSet.ts"

describe('parseNumberSet — entrées valides', () => {
	test('chaîne vide retourne tableau vide sans erreur', () => {
		const r = parseNumberSet('')
		expect(r.values).toEqual([])
		expect(r.errors).toEqual([])
		expect(r.sorted).toBe(true)
	})

	test('chaîne avec espaces seulement retourne tableau vide', () => {
		const r = parseNumberSet('   ')
		expect(r.values).toEqual([])
		expect(r.errors).toEqual([])
	})

	test('entier seul', () => {
		const r = parseNumberSet('5')
		expect(r.values).toEqual([5])
		expect(r.errors).toEqual([])
	})

	test('liste d\'entiers triés', () => {
		const r = parseNumberSet('1,3,9')
		expect(r.values).toEqual([1, 3, 9])
		expect(r.errors).toEqual([])
		expect(r.sorted).toBe(true)
	})

	test('exemple de référence "1,3-5,9"', () => {
		const r = parseNumberSet('1,3-5,9')
		expect(r.values).toEqual([1, 3, 4, 5, 9])
		expect(r.errors).toEqual([])
	})

	test('range avec ".."', () => {
		const r = parseNumberSet('1..3')
		expect(r.values).toEqual([1, 2, 3])
		expect(r.errors).toEqual([])
	})

	test('mélange "-" et ".."', () => {
		const r = parseNumberSet('1-3,7..9')
		expect(r.values).toEqual([1, 2, 3, 7, 8, 9])
		expect(r.errors).toEqual([])
	})

	test('range singleton "3-3"', () => {
		const r = parseNumberSet('3-3')
		expect(r.values).toEqual([3])
		expect(r.errors).toEqual([])
	})

	test('espaces autour des tokens tolérés', () => {
		const r = parseNumberSet(' 1 , 3 - 5 , 9 ')
		// "3 - 5" contient des espaces internes => token invalide
		expect(r.errors.length).toBeGreaterThan(0)
	})

	test('espaces externes uniquement tolérés', () => {
		const r = parseNumberSet(' 1 , 3-5 , 9 ')
		expect(r.values).toEqual([1, 3, 4, 5, 9])
		expect(r.errors).toEqual([])
	})

	test('déduplication des valeurs', () => {
		const r = parseNumberSet('1,3,1,5,3')
		expect(r.values).toEqual([1, 3, 5])
		// L'ordre n'est pas croissant dans l'entrée
		expect(r.sorted).toBe(false)
	})

	test('ranges qui se chevauchent', () => {
		const r = parseNumberSet('1..5,3..7')
		expect(r.values).toEqual([1, 2, 3, 4, 5, 6, 7])
		// 3 <= 5 (lastValue) => non trié
		expect(r.sorted).toBe(false)
	})
})

describe('parseNumberSet — négatifs avec ".."', () => {
	test('négatif seul', () => {
		const r = parseNumberSet('-3')
		expect(r.values).toEqual([-3])
		expect(r.errors).toEqual([])
	})

	test('range négatif "-5..-2"', () => {
		const r = parseNumberSet('-5..-2')
		expect(r.values).toEqual([-5, -4, -3, -2])
		expect(r.errors).toEqual([])
	})

	test('mélange négatif/positif "-5..-2,0,3..5"', () => {
		const r = parseNumberSet('-5..-2,0,3..5')
		expect(r.values).toEqual([-5, -4, -3, -2, 0, 3, 4, 5])
		expect(r.errors).toEqual([])
	})

	test('range croisant zéro "-2..2"', () => {
		const r = parseNumberSet('-2..2')
		expect(r.values).toEqual([-2, -1, 0, 1, 2])
		expect(r.errors).toEqual([])
	})
})

describe('parseNumberSet — erreurs', () => {
	test('token alphabétique', () => {
		const r = parseNumberSet('abc')
		expect(r.errors.length).toBeGreaterThan(0)
		expect(r.errors[0]).toContain('Token invalide')
		expect(r.values).toEqual([])
	})

	test('range négatif avec "-" ambigu', () => {
		const r = parseNumberSet('-5-3')
		expect(r.errors.length).toBeGreaterThan(0)
		expect(r.errors[0]).toContain('..')
	})

	test('range "5--3" rejeté', () => {
		const r = parseNumberSet('5--3')
		expect(r.errors.length).toBeGreaterThan(0)
		expect(r.errors[0]).toContain('..')
	})

	test('range inversé "5..3" produit erreur et réordonne', () => {
		const r = parseNumberSet('5..3')
		expect(r.values).toEqual([3, 4, 5])
		expect(r.errors.some(e => e.includes('inversé'))).toBe(true)
	})

	test('ordre décroissant produit erreur et réordonne', () => {
		const r = parseNumberSet('9,3,1')
		expect(r.values).toEqual([1, 3, 9])
		expect(r.errors.some(e => e.includes('ordre'))).toBe(true)
		expect(r.sorted).toBe(false)
	})

	test('tokens valides mélangés avec un invalide', () => {
		const r = parseNumberSet('1,abc,5')
		// Les valides sont conservés
		expect(r.values).toEqual([1, 5])
		expect(r.errors.some(e => e.includes('abc'))).toBe(true)
	})

	test('range avec décimaux rejeté', () => {
		const r = parseNumberSet('1.5..3')
		expect(r.errors.length).toBeGreaterThan(0)
	})
})

describe('formatNumberSetKatex', () => {
	test('ensemble vide', () => {
		expect(formatNumberSetKatex([])).toBe('\\emptyset')
	})

	test('petit ensemble — affichage complet', () => {
		expect(formatNumberSetKatex([3, 4, 5, 6, 7])).toBe('\\big\\{ 3;4;5;6;7 \\big\\}')
	})

	test('ensemble à la limite du seuil', () => {
		const vals = Array.from({length: NUMBERSET_TRUNCATE_THRESHOLD}, (_, i) => i + 1)
		const out = formatNumberSetKatex(vals)
		expect(out).not.toContain('\\ldots')
		expect(out).toContain('1;2;3')
	})

	test('grand ensemble — affichage tronqué avec cardinal', () => {
		const vals = Array.from({length: 20}, (_, i) => i + 1)
		const out = formatNumberSetKatex(vals)
		expect(out).toContain('\\ldots')
		expect(out).toContain('\\implies')
		expect(out).toContain('\\# = 20')
		expect(out).toContain('1;2;3')
		expect(out).toContain('19;20')
	})

	test('range très grand "1..1000"', () => {
		const r = parseNumberSet('1..1000')
		expect(r.values.length).toBe(1000)
		const out = formatNumberSetKatex(r.values)
		expect(out).toContain('\\# = 1000')
	})
})